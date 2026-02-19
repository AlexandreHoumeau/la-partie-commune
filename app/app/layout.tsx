// PAS de "use client" ici
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
      {/* On délègue la gestion de l'UI (sidebar/collapse) au composant client */}
      <AppLayoutClient>
        {children}
      </AppLayoutClient>
    </AgencyProvider>
  )
}