// PAS de "use client" ici
export const dynamic = 'force-dynamic'

import { getAuthenticatedUserContext } from "@/actions/profile.server"
import { AgencyProvider } from "@/providers/agency-provider"
import { AppLayoutClient } from "../app-layout-client"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userContext = await getAuthenticatedUserContext()

  if (!userContext) {
    return <div>Non authentifié</div>
  }

  return (
    <AgencyProvider initialData={userContext}>
      <AppLayoutClient>
        {children}
      </AppLayoutClient>
    </AgencyProvider>
  )
}