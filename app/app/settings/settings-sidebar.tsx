'use client'

import {
	BarChart3,
	Building2,
	CreditCard,
	Sparkles,
	User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = [
	{ id: 'profile', label: 'Profil', icon: User, href: '/app/settings/profile' },
	{ id: 'agency', label: 'Agence', icon: Building2, href: '/app/settings/agency' },
	{ id: 'ai', label: 'Agent IA', icon: Sparkles, href: '/app/settings/ai' },
	{ id: 'tracking', label: 'Suivi', icon: BarChart3, href: '/app/settings/tracking' },
	{ id: 'billing', label: 'Facturation', icon: CreditCard, href: '/app/settings/billing' }
]

export default function SettingsSidebar() {
	const pathname = usePathname()

	return (
		<aside className="flex-shrink-0 w-ful p-2">
			<div className="sticky top-8 w-ful">
				<nav className="space-y-1 w-full">
					{sections.map((section) => {
						const Icon = section.icon
						const isActive = pathname.startsWith(section.href)

						return (
							<Link
								key={section.id}
								href={section.href}
								className={`
									w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
									${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}>
								<span className="flex-1 text-left">{section.label}</span>
							</Link>
						)
					})}
				</nav>
			</div>
		</aside>
	)
}