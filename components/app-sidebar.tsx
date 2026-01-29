"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Briefcase,
    Kanban,
    Users,
    Building2,
    Settings,
    LogOut
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
    {
        label: "Dashboard",
        href: "/app",
        icon: LayoutDashboard
    },
    {
        label: "Opportunities",
        href: "/app/opportunities",
        icon: Briefcase
    },
    {
        label: "Projects",
        href: "/app/projects",
        icon: Kanban
    }
]

const secondaryItems = [
    {
        label: "Clients",
        href: "/app/clients",
        icon: Building2
    },
    {
        label: "Team",
        href: "/app/team",
        icon: Users
    }
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-background">
            {/* Brand */}
            <div className="flex h-16 items-center px-6 text-lg font-semibold">
                Atelier
            </div>

            <Separator />

            {/* Main navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-2",
                                    isActive && "font-medium"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}

                <Separator className="my-4" />

                {secondaryItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <Separator />

            {/* Footer */}
            <div className="p-3">
                <Link href="/app/settings">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => {
                        // hook supabase signOut here
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    )
}
