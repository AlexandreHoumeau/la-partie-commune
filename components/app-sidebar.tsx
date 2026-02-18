"use client"

import { motion } from "framer-motion"
import {
    Briefcase,
    Building2,
    ChevronsUpDown,
    Command,
    Kanban,
    LayoutDashboard,
    LogOut,
    Settings,
    ShieldCheck,
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
import { cn } from "@/lib/utils"
import { useAgency } from "@/providers/agency-provider"

const mainNav = [
    { label: "Tableau de bord", href: "/app", icon: LayoutDashboard },
    { label: "Opportunités", href: "/app/opportunities", icon: Briefcase },
    { label: "Projets", href: "/app/projects", icon: Kanban },
]

const secondaryNav = [
    { label: "Clients", href: "/app/clients", icon: Building2 },
    { label: "Équipe", href: "/app/team", icon: Users },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { agency, first_name, last_name, email, role } = useAgency()

    const fullName = `${first_name} ${last_name}`
    const initials = `${first_name?.charAt(0) || ""}${last_name?.charAt(0) || ""}`

    const isLinkActive = (href: string) => {
        if (href === "/app") return pathname === "/app"
        return pathname.startsWith(href)
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-100 bg-white md:flex">

            {/* --- AGENCY SWITCHER --- */}
            <div className="flex h-16 items-center px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-slate-50 transition-colors">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-200 shadow-lg">
                                <Command className="size-5" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold text-slate-900">{agency?.name || "Mon Agence"}</span>
                                <span className="truncate text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                                    {role?.replace("agency_", "")}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 ml-2 mt-1 shadow-xl border-slate-100" align="start">
                        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 tracking-widest p-3">Agences liées</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-blue-50">
                            <div className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                                <Building2 className="size-4 text-slate-600" />
                            </div>
                            <span className="font-medium text-slate-700">{agency?.name}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* --- NAVIGATION --- */}
            <ScrollArea className="flex-1 px-3 py-6">
                <nav className="space-y-8">
                    {/* Groupe Plateforme */}
                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Plateforme</p>
                        {mainNav.map((item) => {
                            const active = isLinkActive(item.href)
                            return (
                                <NavItem key={item.href} item={item} active={active} />
                            )
                        })}
                    </div>

                    {/* Groupe Management */}
                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
                        {secondaryNav.map((item) => {
                            const active = isLinkActive(item.href)
                            return (
                                <NavItem key={item.href} item={item} active={active} />
                            )
                        })}
                    </div>
                </nav>
            </ScrollArea>

            {/* --- FOOTER / USER --- */}
            <div className="p-4 mt-auto border-t border-slate-50 bg-slate-50/50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2 hover:bg-white hover:shadow-sm transition-all group">
                            <div className="relative">
                                <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm">
                                    <AvatarFallback className="rounded-xl bg-blue-600 text-white text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{fullName}</span>
                                <span className="truncate text-[11px] text-slate-500">{email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-slate-100 mb-4" side="right" align="end" sideOffset={12}>
                        <div className="px-2 py-3 mb-2 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-900">{fullName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{email}</p>
                        </div>

                        <DropdownMenuGroup className="space-y-1">
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2 focus:bg-blue-50 focus:text-blue-700">
                                <Link href="/app/settings/profile">
                                    <Settings className="mr-3 h-4 w-4" />
                                    <span>Mon Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2 focus:bg-blue-50 focus:text-blue-700">
                                <Link href="/app/settings/billing">
                                    <ShieldCheck className="mr-3 h-4 w-4" />
                                    <span>Abonnement</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="my-2 bg-slate-100" />

                        <DropdownMenuItem className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer py-2">
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Déconnexion</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}

function NavItem({ item, active }: { item: any, active: boolean }) {
    return (
        <Link href={item.href} className="block relative">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-3 h-10 px-3 transition-all duration-200 group relative overflow-hidden",
                    active
                        ? "text-blue-600 bg-blue-50/50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
            >
                {/* Pilule active verticale */}
                {active && (
                    <motion.div
                        layoutId="sidebarActive"
                        className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full"
                    />
                )}

                <item.icon className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className={cn("text-sm font-medium", active && "font-bold")}>{item.label}</span>
            </Button>
        </Link>
    )
}