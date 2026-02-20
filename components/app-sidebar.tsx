"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    Users,
    PanelLeftClose,
    PanelLeftOpen
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

interface AppSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export function AppSidebar({ isCollapsed, setIsCollapsed }: AppSidebarProps) {
    const pathname = usePathname()
    const { agency, first_name, last_name, email, role } = useAgency()
    const [mounted, setMounted] = useState(false)

    // Évite les erreurs d'hydratation avec Framer Motion
    useEffect(() => {
        setMounted(true)
    }, [])

    const fullName = `${first_name} ${last_name}`
    const initials = `${first_name?.charAt(0) || ""}${last_name?.charAt(0) || ""}`

    const isLinkActive = (href: string) => {
        if (href === "/app") return pathname === "/app"
        return pathname.startsWith(href)
    }

    if (!mounted) return null

    return (
        <TooltipProvider delayDuration={0}>
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:flex"
            >
                {/* --- TOGGLE BUTTON --- */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    {isCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
                </button>

                {/* --- AGENCY SWITCHER --- */}
                <div className="flex h-16 items-center px-4 overflow-hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn(
                                "w-full justify-start transition-colors hover:bg-slate-50",
                                isCollapsed ? "px-0 justify-center h-10 w-10 mx-auto" : "gap-3 px-2"
                            )}>
                                <div className="flex shrink-0 aspect-square size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-200 shadow-lg">
                                    <Command className="size-4" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="grid flex-1 text-left text-sm leading-tight overflow-hidden"
                                        >
                                            <span className="truncate font-bold text-slate-900">{agency?.name || "Mon Agence"}</span>
                                            <span className="truncate text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                                                {role?.replace("agency_", "")}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isCollapsed && <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 ml-2 mt-1 shadow-xl border-slate-100 rounded-xl" align="start">
                            <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 tracking-widest p-3">Agences liées</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-3 p-3 cursor-pointer focus:bg-blue-50 rounded-lg">
                                <div className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                                    <Building2 className="size-4 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-700">{agency?.name}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* --- NAVIGATION --- */}
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-6">
                        {/* Groupe Plateforme */}
                        <div className="space-y-1">
                            {!isCollapsed ? (
                                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Plateforme</p>
                            ) : (
                                <div className="h-4" /> // Spacer quand collapsed
                            )}
                            {mainNav.map((item) => (
                                <NavItem key={item.href} item={item} active={isLinkActive(item.href)} isCollapsed={isCollapsed} />
                            ))}
                        </div>

                        {/* Groupe Management */}
                        <div className="space-y-1">
                            {!isCollapsed ? (
                                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Management</p>
                            ) : (
                                <div className="w-8 mx-auto h-px bg-slate-100 my-4" /> // Séparateur quand collapsed
                            )}
                            {secondaryNav.map((item) => (
                                <NavItem key={item.href} item={item} active={isLinkActive(item.href)} isCollapsed={isCollapsed} />
                            ))}
                        </div>
                    </nav>
                </ScrollArea>

                {/* --- FOOTER / USER --- */}
                <div className="p-3 mt-auto border-t border-slate-100 bg-slate-50/50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn(
                                "h-auto w-full transition-all group hover:bg-white hover:shadow-sm",
                                isCollapsed ? "justify-center p-2" : "justify-start gap-3 p-2"
                            )}>
                                <div className="relative shrink-0">
                                    <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                        <AvatarFallback className="rounded-xl bg-blue-600 text-white text-xs font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="grid flex-1 text-left text-sm leading-tight overflow-hidden"
                                        >
                                            <span className="truncate font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{fullName}</span>
                                            <span className="truncate text-[10px] text-slate-500">{email}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isCollapsed && <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0" />}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-slate-100 mb-2 ml-2" side={isCollapsed ? "right" : "top"} align="end" sideOffset={12}>
                            <div className="px-3 py-3 mb-2 bg-slate-50 rounded-xl">
                                <p className="text-xs font-bold text-slate-900">{fullName}</p>
                                <p className="text-[10px] text-slate-500 truncate">{email}</p>
                            </div>

                            <DropdownMenuGroup className="space-y-1">
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5 focus:bg-blue-50 focus:text-blue-700">
                                    <Link href="/app/settings/profile">
                                        <Settings className="mr-3 h-4 w-4" />
                                        <span className="font-medium">Mon Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5 focus:bg-blue-50 focus:text-blue-700">
                                    <Link href="/app/settings/billing">
                                        <ShieldCheck className="mr-3 h-4 w-4" />
                                        <span className="font-medium">Abonnement</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="my-2 bg-slate-100" />

                            <DropdownMenuItem className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer py-2.5">
                                <LogOut className="mr-3 h-4 w-4" />
                                <span className="font-medium">Déconnexion</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.aside>
        </TooltipProvider>
    )
}

function NavItem({ item, active, isCollapsed }: { item: any, active: boolean, isCollapsed: boolean }) {
    const navContent = (
        <Button
            variant="ghost"
            className={cn(
                "w-full transition-all duration-200 group relative overflow-hidden h-10",
                isCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-start gap-3 px-3",
                active ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
        >
            {/* Pilule active verticale */}
            {active && (
                <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <item.icon className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
            )} />

            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className={cn("text-sm whitespace-nowrap overflow-hidden", active ? "font-bold" : "font-medium")}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    )

    return (
        <Link href={item.href} className="block relative">
            {isCollapsed ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        {navContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10} className="font-semibold rounded-lg bg-slate-900 text-white">
                        {item.label}
                    </TooltipContent>
                </Tooltip>
            ) : (
                navContent
            )}
        </Link>
    )
}