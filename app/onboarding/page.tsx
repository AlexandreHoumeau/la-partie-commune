import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login");

    // Check if profile already exists — if so, no need for onboarding
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

    if (profile) redirect("/app");

    // Extract name from Google metadata
    const meta = user.user_metadata;
    const fullName: string = meta?.full_name || meta?.name || "";
    const parts = fullName.trim().split(" ");
    const defaultFirstName = meta?.given_name || parts[0] || "";
    const defaultLastName = meta?.family_name || parts.slice(1).join(" ") || "";

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-4 py-12">
            <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
            <OnboardingForm
                defaultFirstName={defaultFirstName}
                defaultLastName={defaultLastName}
            />
        </div>
    );
}
