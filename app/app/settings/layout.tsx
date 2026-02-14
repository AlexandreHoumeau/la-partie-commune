import { SettingsProvider } from './settings-context'
import SettingsSidebar from './settings-sidebar'

async function getSettingsData(userId: string) {
  // REMPLACE PAR TON VRAI APPEL DB/API
  // Exemple Supabase :
  // const { data } = await supabase
  //   .from('settings')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .single()
  // return data

  return {
    profile: {
      firstName: 'Jean',
      lastName: 'Dupont',
      position: 'Agent immobilier',
      email: 'jean.dupont@partiecommune.fr',
      phone: '+33 6 12 34 56 78'
    },
    agency: {
      name: 'Partie Commune',
      website: 'https://www.partiecommune.fr',
      phone: '+33 1 23 45 67 89',
      email: 'contact@partiecommune.fr',
      address: '123 rue de la République, 75001 Paris',
      description: 'Agence immobilière spécialisée',
      logo: null,
      primaryColor: '#3b82f6',
      team: []
    },
    ai: {
      context: '',
      keyPoints: '',
      tone: 'professional',
      additionalInstructions: ''
    },
    tracking: {
      enabled: true,
      trackOpens: true,
      trackClicks: true,
      utmSource: 'email',
      utmMedium: 'partiecommune',
      utmCampaign: 'prospection'
    },
    billing: {
      plan: 'Professional',
      amount: 49,
      nextPayment: '2026-03-14',
      paymentMethod: { last4: '4242', expiry: '12/2026' },
      invoices: []
    }
  }
}

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Récupère le vrai userId depuis ta session
  const userId = 'user-123'
  const settingsData = await getSettingsData(userId)

  return (
    <SettingsProvider data={settingsData}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8 p-8">
            <SettingsSidebar />

            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SettingsProvider>
  )
}