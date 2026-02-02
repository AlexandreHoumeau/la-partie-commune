import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex bg-neutral-50">
            <AppSidebar />
            <main className="flex-1 p-6 bg-neutral-50 rounded-md">{children}</main>
        </div>
    )
}
