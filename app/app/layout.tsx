import { getAuthenticatedUserContext } from "@/actions/profile.server"
import { AppSidebar } from "@/components/app-sidebar"
import { AgencyProvider } from "@/providers/agency-provider"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userContext = await getAuthenticatedUserContext()
  if (!userContext) {
    // Optionally, you could redirect to a login page here
    return <div>Non authentifié</div>
  }

  return (
    <AgencyProvider initialData={userContext}>
      <div className="h-screen bg-neutral-50">
        <AppSidebar />

        <main className="ml-64 overflow-y-auto bg-neutral-50">
          {children}
        </main>
      </div>
    </AgencyProvider>
  )
}
