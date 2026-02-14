'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Building2, 
  Sparkles, 
  BarChart3, 
  CreditCard
} from 'lucide-react'

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
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Paramètres
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez votre profil et votre agence
          </p>
        </div>

        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = pathname.startsWith(section.href)

            return (
              <Link
                key={section.id}
                href={section.href}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{section.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}