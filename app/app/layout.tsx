import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen bg-neutral-50">
      <AppSidebar />

      <main className="ml-64 overflow-y-auto p-6 bg-neutral-50">
        {children}
      </main>
    </div>
  )
}
