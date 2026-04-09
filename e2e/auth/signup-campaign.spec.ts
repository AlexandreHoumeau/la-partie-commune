import { test, expect } from "@playwright/test";
import { generateTestEmail, confirmUserByEmail } from "../helpers/test-users";
import { getAdminClient } from "../helpers/supabase-admin";

const TEST_CAMPAIGN_CODE = "e2e-test-campaign";
const TEST_CAMPAIGN_DAYS = 7;

test.describe("Signup — campaign demo access", () => {
  const admin = getAdminClient();

  test.beforeAll(async () => {
    // Seed the test campaign (upsert so re-runs are safe)
    const { error } = await admin.from("demo_campaigns").upsert({
      code: TEST_CAMPAIGN_CODE,
      demo_days: TEST_CAMPAIGN_DAYS,
      active: true,
      uses_count: 0,
    });
    if (error) throw new Error(`Failed to seed test campaign: ${error.message}`);
  });

  test.afterAll(async () => {
    await admin.from("demo_campaigns").delete().eq("code", TEST_CAMPAIGN_CODE);
  });

  test("email/password signup via campaign URL sets demo_ends_at on the agency", async ({
    page,
  }) => {
    const email = generateTestEmail();
    const password = "TestPassword123!";

    // 1. Visit signup page with campaign param
    await page.goto(`/auth/signup?campaign=${TEST_CAMPAIGN_CODE}`);

    // 2. Fill and submit the signup form
    await page.getByLabel("Nom de l'agence").fill("Campaign E2E Agency");
    await page.getByLabel("Prénom").fill("Jean");
    await page.getByLabel("Nom", { exact: true }).fill("Dupont");
    await page.getByLabel("Adresse email").fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.getByLabel("Confirmation").fill(password);
    await page.getByRole("button", { name: "Créer mon espace" }).click();

    // 3. Wait for the email confirmation screen
    await expect(page.getByText("Vérifiez vos emails")).toBeVisible({
      timeout: 10_000,
    });

    // 4. Confirm the user so they can receive a magic link
    await confirmUserByEmail(email);

    // 5. Generate a magic link to drive the browser through the real callback route.
    //    bootstrapUser() will run and pick up campaign_code from user_metadata.
    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (linkError || !linkData)
      throw new Error(`generateLink failed: ${linkError?.message}`);

    await page.goto(
      `/auth/callback?token_hash=${linkData.properties.hashed_token}&type=email`
    );

    // 6. Wait for redirect after bootstrapping (lands on /app or /onboarding)
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15_000 });

    // 7. Verify demo_ends_at was set on the agency
    const { data: usersPage } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    const user = usersPage.users.find((u) => u.email === email);
    expect(user, "auth user should exist").toBeDefined();

    const { data: profile } = await admin
      .from("profiles")
      .select("agency_id")
      .eq("id", user!.id)
      .single();
    expect(profile?.agency_id, "profile should have agency_id").toBeTruthy();

    const { data: agency } = await admin
      .from("agencies")
      .select("demo_ends_at")
      .eq("id", profile!.agency_id)
      .single();

    expect(agency?.demo_ends_at, "demo_ends_at should be set").not.toBeNull();

    const diffDays = Math.round(
      (new Date(agency!.demo_ends_at).getTime() - Date.now()) /
        (1000 * 3600 * 24)
    );
    expect(diffDays).toBeGreaterThanOrEqual(TEST_CAMPAIGN_DAYS - 1);
    expect(diffDays).toBeLessThanOrEqual(TEST_CAMPAIGN_DAYS);

    // 8. Verify uses_count was incremented
    const { data: campaign } = await admin
      .from("demo_campaigns")
      .select("uses_count")
      .eq("code", TEST_CAMPAIGN_CODE)
      .single();
    expect(campaign?.uses_count).toBeGreaterThanOrEqual(1);
  });

  test("email/password signup without campaign URL does NOT set demo_ends_at", async ({
    page,
  }) => {
    const email = generateTestEmail();
    const password = "TestPassword123!";

    await page.goto("/auth/signup");
    await page.getByLabel("Nom de l'agence").fill("No Campaign E2E Agency");
    await page.getByLabel("Prénom").fill("Jean");
    await page.getByLabel("Nom", { exact: true }).fill("Dupont");
    await page.getByLabel("Adresse email").fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.getByLabel("Confirmation").fill(password);
    await page.getByRole("button", { name: "Créer mon espace" }).click();

    await expect(page.getByText("Vérifiez vos emails")).toBeVisible({
      timeout: 10_000,
    });

    await confirmUserByEmail(email);

    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (linkError || !linkData)
      throw new Error(`generateLink failed: ${linkError?.message}`);

    await page.goto(
      `/auth/callback?token_hash=${linkData.properties.hashed_token}&type=email`
    );
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15_000 });

    const { data: usersPage } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    const user = usersPage.users.find((u) => u.email === email);
    expect(user).toBeDefined();

    const { data: profile } = await admin
      .from("profiles")
      .select("agency_id")
      .eq("id", user!.id)
      .single();
    expect(profile?.agency_id).toBeTruthy();

    const { data: agency } = await admin
      .from("agencies")
      .select("demo_ends_at")
      .eq("id", profile!.agency_id)
      .single();

    expect(agency?.demo_ends_at).toBeNull();
  });

  test("campaign with max_uses exhausted does NOT grant demo", async ({
    page,
  }) => {
    // Create a separate exhausted campaign
    const exhaustedCode = "e2e-exhausted-campaign";
    await admin.from("demo_campaigns").upsert({
      code: exhaustedCode,
      demo_days: 14,
      active: true,
      max_uses: 1,
      uses_count: 1, // already at limit
    });

    const email = generateTestEmail();
    const password = "TestPassword123!";

    await page.goto(`/auth/signup?campaign=${exhaustedCode}`);
    await page.getByLabel("Nom de l'agence").fill("Exhausted Campaign Agency");
    await page.getByLabel("Prénom").fill("Jean");
    await page.getByLabel("Nom", { exact: true }).fill("Dupont");
    await page.getByLabel("Adresse email").fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.getByLabel("Confirmation").fill(password);
    await page.getByRole("button", { name: "Créer mon espace" }).click();

    await expect(page.getByText("Vérifiez vos emails")).toBeVisible({
      timeout: 10_000,
    });

    await confirmUserByEmail(email);

    const { data: exhaustedLinkData, error: exhaustedLinkError } =
      await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (exhaustedLinkError || !exhaustedLinkData)
      throw new Error(`generateLink failed: ${exhaustedLinkError?.message}`);

    await page.goto(
      `/auth/callback?token_hash=${exhaustedLinkData.properties.hashed_token}&type=email`
    );
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15_000 });

    const { data: usersPage } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    const user = usersPage.users.find((u) => u.email === email)!;
    const { data: profile } = await admin
      .from("profiles")
      .select("agency_id")
      .eq("id", user.id)
      .single();
    const { data: agency } = await admin
      .from("agencies")
      .select("demo_ends_at")
      .eq("id", profile!.agency_id)
      .single();

    expect(agency?.demo_ends_at).toBeNull();

    // Cleanup
    await admin.from("demo_campaigns").delete().eq("code", exhaustedCode);
  });
});
