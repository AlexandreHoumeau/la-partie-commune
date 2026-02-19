"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Building2, ChevronsLeft, ChevronsRight, ChevronsUpDown, Command, Kanban, LayoutDashboard, LogOut, Settings, ShieldCheck, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AppSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (v: boolean) => void }) {
    const pathname = usePathname()
    const isLinkActive = (href: string) => href === "/app" ? pathname === "/app" : pathname.startsWith(href)

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn(
                "fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex",
                isCollapsed ? "w-20" : "w-64"
            )}>
                {/* Toggle Button */}
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-white shadow-sm z-30"
                >
                    {isCollapsed ? <ChevronsRight className="h-3 w-3" /> : <ChevronsLeft className="h-3 w-3" />}
                </Button>

                {/* --- AGENCY SWITCHER --- */}
                <div className="flex h-16 items-center px-4 overflow-hidden text-nowrap">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                            <Command className="size-5" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="truncate font-bold text-slate-900 text-sm">Mon Agence</span>
                                <span className="text-[10px] text-blue-600 font-bold uppercase">Admin</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- NAVIGATION --- */}
                <div className="flex-1 px-3 py-6 space-y-8 overflow-y-auto no-scrollbar">
                    <NavGroup label="Plateforme" isCollapsed={isCollapsed}>
                        <NavItem icon={LayoutDashboard} label="Dashboard" href="/app" active={isLinkActive("/app")} isCollapsed={isCollapsed} />
                        <NavItem icon={Briefcase} label="Opportunités" href="/app/opportunities" active={isLinkActive("/app/opportunities")} isCollapsed={isCollapsed} />
                        <NavItem icon={Kanban} label="Projets" href="/app/projects" active={isLinkActive("/app/projects")} isCollapsed={isCollapsed} />
                    </NavGroup>

                    <NavGroup label="Management" isCollapsed={isCollapsed}>
                        <NavItem icon={Building2} label="Clients" href="/app/clients" active={isLinkActive("/app/clients")} isCollapsed={isCollapsed} />
                        <NavItem icon={Users} label="Équipe" href="/app/team" active={isLinkActive("/app/team")} isCollapsed={isCollapsed} />
                    </NavGroup>
                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 border-t border-slate-100">
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <Avatar className="h-9 w-9 rounded-xl shrink-0">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">JD</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold truncate">John Doe</span>
                                <span className="text-[11px] text-slate-500 truncate">john@doe.com</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}

function NavGroup({ label, children, isCollapsed }: any) {
    return (
        <div className="space-y-1">
            {!isCollapsed && <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>}
            {children}
        </div>
    )
}

function NavItem({ icon: Icon, label, href, active, isCollapsed }: any) {
    const content = (
        <Link href={href}>
            <Button variant="ghost" className={cn(
                "w-full justify-start gap-3 h-10 px-3 transition-all relative",
                active ? "text-blue-600 bg-blue-50/50 font-bold" : "text-slate-500 hover:bg-slate-50",
                isCollapsed && "justify-center px-0"
            )}>
                {active && <div className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full" />}
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-blue-600" : "text-slate-400")} />
                {!isCollapsed && <span className="text-sm truncate">{label}</span>}
            </Button>
        </Link>
    )

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
        )
    }
    return content
}