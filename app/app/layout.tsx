// import { AppSidebar } from "@/components/layout/AppSidebar";
// import { AppHeader } from "@/components/layout/AppHeader";


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* <AppSidebar /> */}
            <div className="flex flex-1 flex-col">
                {/* <AppHeader /> */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}