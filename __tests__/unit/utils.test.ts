import { describe, it, expect, vi } from "vitest";
import { generateSlug, getInitials, cn, getUniqueSlug } from "@/lib/utils";

describe("generateSlug", () => {
  it("met en minuscule", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("supprime les accents", () => {
    expect(generateSlug("Café & Boulangerie")).toBe("cafe-boulangerie");
  });

  it("remplace les espaces multiples par un seul tiret", () => {
    expect(generateSlug("Refonte   du   site")).toBe("refonte-du-site");
  });

  it("supprime les caractères spéciaux", () => {
    expect(generateSlug("Mon projet ! (2024)")).toBe("mon-projet-2024");
  });

  it("fusionne les tirets consécutifs", () => {
    expect(generateSlug("A & B")).toBe("a-b");
  });

  it("supprime les espaces en début et fin", () => {
    expect(generateSlug("  Projet web  ")).toBe("projet-web");
  });

  it("gère les caractères accentués variés", () => {
    expect(generateSlug("Île-de-France / été")).toBe("ile-de-france-ete");
  });
});

describe("cn", () => {
  it("fusionne des classes Tailwind", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("résout les conflits Tailwind (dernière classe gagne)", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("ignore les valeurs falsy (undefined, false, null)", () => {
    expect(cn("base", undefined, false, null, "extra")).toBe("base extra");
  });
});

describe("getUniqueSlug", () => {
  function makeMockSupabase(existingSlugs: string[]) {
    const seen = new Set(existingSlugs);
    return {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn((_, slug: string) => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: seen.has(slug) ? { slug } : null,
                error: null,
              })
            ),
          })),
        })),
      })),
    };
  }

  it("retourne le slug de base s'il est disponible", async () => {
    const supabase = makeMockSupabase([]);
    const result = await getUniqueSlug(supabase as any, "mon-projet");
    expect(result).toBe("mon-projet");
  });

  it("ajoute -1 si le slug de base existe déjà", async () => {
    const supabase = makeMockSupabase(["mon-projet"]);
    const result = await getUniqueSlug(supabase as any, "mon-projet");
    expect(result).toBe("mon-projet-1");
  });

  it("incrémente jusqu'à trouver un slug libre", async () => {
    const supabase = makeMockSupabase(["mon-projet", "mon-projet-1", "mon-projet-2"]);
    const result = await getUniqueSlug(supabase as any, "mon-projet");
    expect(result).toBe("mon-projet-3");
  });
});

describe("getInitials", () => {
  it("retourne les initiales prénom + nom", () => {
    expect(getInitials("Jean", "Dupont")).toBe("JD");
  });

  it("met les initiales en majuscule", () => {
    expect(getInitials("alice", "martin")).toBe("AM");
  });

  it("utilise l'email si prénom/nom absents", () => {
    expect(getInitials(undefined, undefined, "john@example.com")).toBe("JO");
  });

  it("retourne ?? si aucune donnée", () => {
    expect(getInitials()).toBe("??");
  });

  it("préfère prénom+nom même si email est fourni", () => {
    expect(getInitials("Marie", "Curie", "mc@example.com")).toBe("MC");
  });
});
