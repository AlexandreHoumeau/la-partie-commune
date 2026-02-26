// PAS de "use client" ici
export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import { getAuthenticatedUserContext } from "@/actions/profile.server"
import { AgencyProvider } from "@/providers/agency-provider"
import { AppLayoutClient } from "../app-layout-client"
import { createClient } from "@/lib/supabase/server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userContext = await getAuthenticatedUserContext()

  if (!userContext) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      redirect("/onboarding")
    }
    redirect("/auth/login")
  }

  return (
    <AgencyProvider initialData={userContext}>
      <AppLayoutClient>
        {children}
      </AppLayoutClient>
    </AgencyProvider>
  )
}