"use client"

import {
    Briefcase,
    Building2,
    ChevronsUpDown,
    Command,
    Kanban,
    LayoutDashboard,
    LogOut,
    Settings,
    Sparkles,
    Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAgency } from "@/providers/agency-provider"

const mainNav = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "Opportunities", href: "/app/opportunities", icon: Briefcase },
    { label: "Projects", href: "/app/projects", icon: Kanban },
]

const secondaryNav = [
    { label: "Clients", href: "/app/clients", icon: Building2 },
    { label: "Team", href: "/app/team", icon: Users },
]

export function AppSidebar() {
    const pathname = usePathname()

    // Destructure everything from the context
    const { agency, first_name, last_name, email, role } = useAgency()

    const fullName = `${first_name} ${last_name}`
    const initials = `${first_name?.charAt(0) || ""}${last_name?.charAt(0) || ""}`

    const isLinkActive = (href: string) => {
        if (href === "/app" && pathname === "/app") return true;
        if (href !== "/app" && pathname.startsWith(href)) return true;
        return false;
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">

            {/* Header / Agency Switcher */}
            <div className="flex h-[60px] items-center px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Command className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{agency?.name}</span>
                                <span className="truncate text-xs text-muted-foreground uppercase tracking-tighter">
                                    {role?.replace("_", " ")}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Agencies</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <Command className="size-4 shrink-0" />
                            </div>
                            {agency?.name}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="flex flex-col gap-6">
                    {/* Platform Group */}
                    <div className="flex flex-col gap-1">
                        <div className="px-2 text-xs font-medium text-muted-foreground/70 mb-2 uppercase tracking-wider">
                            Platform
                        </div>
                        {mainNav.map((item) => {
                            const isActive = isLinkActive(item.href)
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3 h-9 px-3 font-normal transition-all",
                                            isActive && "font-medium bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
                                            !isActive && "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Management Group */}
                    <div className="flex flex-col gap-1">
                        <div className="px-2 text-xs font-medium text-muted-foreground/70 mb-2 uppercase tracking-wider">
                            Management
                        </div>
                        {secondaryNav.map((item) => {
                            const isActive = isLinkActive(item.href)
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3 h-9 px-3 font-normal",
                                            isActive && "font-medium bg-sidebar-accent text-sidebar-accent-foreground",
                                            !isActive && "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </ScrollArea>

            <Separator />

            {/* Footer / User Profile */}
            <div className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg border">
                                {/* Use a real image if you add one to your schema later */}
                                <AvatarFallback className="rounded-lg bg-neutral-200 text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{fullName}</span>
                                <span className="truncate text-xs text-muted-foreground">{email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56 rounded-lg" side="right" align="end" sideOffset={12}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg bg-neutral-200 font-bold">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{fullName}</span>
                                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/app/settings/profile" className="cursor-pointer flex w-full items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/app/settings/billing" className="cursor-pointer flex w-full items-center">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Billing
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                            onClick={async () => {
                                // Add your Supabase signOut logic here
                                console.log("Logging out...")
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}