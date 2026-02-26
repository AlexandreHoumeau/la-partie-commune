import { fetchSettingsData } from '@/actions/settings.server'
import { BillingStatus } from '@/components/billing/BillingStatus'

export default async function BillingPage() {
    const settings = await fetchSettingsData()

    return (
        <div className="space-y-8">
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Facturation</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez votre abonnement et vos paiements</p>
                </div>

                {settings.billing && settings.agency ? (
                    <BillingStatus
                        billing={settings.billing}
                        agencyId={settings.agency.id}
                    />
                ) : (
                    <p className="text-sm text-slate-500">Aucune information de facturation disponible.</p>
                )}
            </section>
        </div>
    )
}
