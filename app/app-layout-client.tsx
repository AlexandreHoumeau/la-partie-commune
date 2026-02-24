"use client"

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main className={cn(
                "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 flex flex-col",
                isCollapsed ? "pl-20" : "pl-64"
            )}>
                {children}
            </main>
        </div>
    )
}