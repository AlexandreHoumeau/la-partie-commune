'use client'

import { BarChart3, Building2, CreditCard, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion" // Optionnel mais recommandé pour l'animation

const sections = [
    { id: 'profile', label: 'Profil', icon: User, href: '/app/settings/profile' },
    { id: 'agency', label: 'Agence', icon: Building2, href: '/app/settings/agency' },
    { id: 'ai', label: 'Agent IA', icon: Sparkles, href: '/app/settings/ai' },
    { id: 'billing', label: 'Facturation', icon: CreditCard, href: '/app/settings/billing' }
]

export default function SettingsNavbar() {
    const pathname = usePathname()

    return (
        <div className="w-full pb-6 border-b border-slate-100 mb-8">
            <nav className="flex p-1 gap-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/50 overflow-x-auto no-scrollbar">
                {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = pathname === section.href

                    return (
                        <Link
                            key={section.id}
                            href={section.href}
                            className={cn(
                                "group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            )}
                            style={isActive ? { color: 'var(--brand-secondary, #6366F1)' } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <Icon
                                className={cn("h-4 w-4 shrink-0 z-10 transition-colors", !isActive && "text-slate-400 group-hover:text-slate-600")}
                                style={isActive ? { color: 'var(--brand-secondary, #6366F1)' } : undefined}
                            />

                            <span className="relative z-10">{section.label}</span>

                            {section.id === 'ai' && (
                                <span
                                    className="relative z-10 flex h-2 w-2 rounded-full animate-pulse hidden md:block"
                                    style={{ backgroundColor: 'var(--brand-secondary, #6366F1)' }}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}