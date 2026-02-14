export default function TrackingPage() {
    return (
        <div className="space-y-8">
            {/* Paramètres de suivi */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Paramètres de suivi</h2>
                    <p className="text-sm text-slate-500 mt-1">Activez ou désactivez le suivi des emails</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-slate-900">Activer le suivi</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                Suivez l'ouverture et les clics dans vos emails
                            </div>
                        </div>
                        <button className="relative w-11 h-6 bg-blue-500 rounded-full transition-colors">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5"></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-slate-900">Suivi des ouvertures</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                Sachez quand vos emails sont ouverts
                            </div>
                        </div>
                        <button className="relative w-11 h-6 bg-blue-500 rounded-full transition-colors">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5"></span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-slate-900">Suivi des clics</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                Suivez les liens cliqués dans vos emails
                            </div>
                        </div>
                        <button className="relative w-11 h-6 bg-blue-500 rounded-full transition-colors">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5"></span>
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* URLs de suivi */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">URLs de suivi</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez vos paramètres UTM par défaut</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Source (utm_source)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Medium (utm_medium)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="agence"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Campagne (utm_campaign)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="prospection"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer les paramètres
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}