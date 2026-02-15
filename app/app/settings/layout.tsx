import { fetchSettingsData } from '@/actions/settings.server'
import { Separator } from '@/components/ui/separator'
import { SettingsProvider } from './settings-context'
import SettingsSidebar from './settings-sidebar'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await fetchSettingsData()

  return (
    <SettingsProvider data={data}>
      <div className="min-h-screen bg-white">
        <div className='py-4 px-4'>
          <h1 className="text-2xl font-bold text-slate-900 ">Paramètres</h1>
          <p className="text-sm text-slate-500">Gérez votre profil, votre agence et vos préférences</p>
        </div>
        <Separator orientation="horizontal" className="" />
        <div className="mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-2 flex mr-4">
              <div className="flex-1 min-w-0">
                <SettingsSidebar />
              </div>

              <Separator
                orientation="vertical"
                className="w-px shrink-0 bg-slate-200"
              />
            </div>            <main className="flex-1 col-span-10 min-w-0">
              <div className="bg-white p-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SettingsProvider>
  )
}