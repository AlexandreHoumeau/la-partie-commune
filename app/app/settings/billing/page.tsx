export default function BillingPage() {
    return (
        <div className="space-y-8">
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Facturation</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez votre abonnement et vos paiements</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="text-sm font-medium text-slate-600">Plan actuel</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">Professional</div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Actif
                        </span>
                    </div>
                    <div className="text-sm text-slate-600">
                        <div>€49/mois</div>
                        <div className="text-xs text-slate-500 mt-1">Prochain paiement le 14 mars 2026</div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Méthode de paiement</h3>
                    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-900">•••• •••• •••• 4242</div>
                                <div className="text-xs text-slate-500">Expire 12/2026</div>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Modifier
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Historique</h3>
                    <div className="space-y-2">
                        {[
                            { date: '14 fév 2026', amount: '49,00 €', status: 'Payée' },
                            { date: '14 jan 2026', amount: '49,00 €', status: 'Payée' },
                            { date: '14 déc 2025', amount: '49,00 €', status: 'Payée' }
                        ].map((invoice, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-slate-600">{invoice.date}</div>
                                    <div className="text-sm font-medium text-slate-900">{invoice.amount}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        {invoice.status}
                                    </span>
                                    <button className="text-sm text-blue-600 hover:text-blue-700">
                                        Télécharger
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}