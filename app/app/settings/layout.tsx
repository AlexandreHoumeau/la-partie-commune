// SettingsLayout.tsx
import { fetchSettingsData } from '@/actions/settings.server'
import { SettingsProvider } from './settings-context'
import SettingsSidebar from './settings-sidebar'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const data = await fetchSettingsData()

  return (
    <SettingsProvider data={data}>
      {/* Fond légèrement grisé pour faire ressortir les cartes blanches */}
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-[1200px] mx-auto px-4 py-8">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Paramètres</h1>
            <p className="text-[15px] text-slate-500 mt-1">
              Gérez l'identité de votre agence et les accès de votre équipe.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar avec largeur fixe sur desktop */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <SettingsSidebar />
            </aside>

            {/* Zone de contenu principale */}
            <main className="flex-1 min-w-0">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SettingsProvider>
  )
}