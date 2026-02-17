// SettingsSidebar.tsx
'use client'

import { BarChart3, Building2, CreditCard, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils" // Assure-toi d'avoir cet utilitaire shadcn

const sections = [
	{ id: 'profile', label: 'Profil personnel', icon: User, href: '/app/settings/profile' },
	{ id: 'agency', label: 'Agence', icon: Building2, href: '/app/settings/agency' },
	{ id: 'ai', label: 'Agent IA', icon: Sparkles, href: '/app/settings/ai' },
	{ id: 'tracking', label: 'Suivi', icon: BarChart3, href: '/app/settings/tracking' },
	{ id: 'billing', label: 'Facturation', icon: CreditCard, href: '/app/settings/billing' }
]

export default function SettingsSidebar() {
	const pathname = usePathname()

	return (
		<nav className="flex flex-col gap-1">
			{sections.map((section) => {
				const Icon = section.icon
				const isActive = pathname === section.href // Match exact ou startsWith selon ton besoin

				return (
					<Link
						key={section.id}
						href={section.href}
						className={cn(
							"group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
							isActive
								? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
								: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
						)}
					>
						<Icon className={cn(
							"h-4 w-4 shrink-0 transition-colors",
							isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
						)} />
						<span>{section.label}</span>

						{/* Indicateur visuel subtil quand actif */}
						{isActive && (
							<div className="absolute left-0 w-1 h-4 bg-blue-600 rounded-r-full" />
						)}
					</Link>
				)
			})}
		</nav>
	)
}