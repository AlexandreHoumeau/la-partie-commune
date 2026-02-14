export default function AIPage() {
    return (
        <div className="space-y-8">
            {/* Contexte de l'agence */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Contexte de l'agence</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Fournissez des informations pour aider l'IA à générer des emails pertinents
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Contexte général
                        </label>
                        <textarea
                            rows={6}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Décrivez votre agence, vos spécialités, votre zone géographique, vos points forts..."
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Plus vous donnez de contexte, plus les emails générés seront personnalisés
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Points clés à mentionner
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="- Expert du marché immobilier parisien&#10;- Spécialisé dans les biens de prestige&#10;- Service personnalisé et disponibilité 7j/7"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer le contexte
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* Ton général */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Ton général</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Définissez le style de communication de vos emails
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Style de communication
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Professionnel', value: 'professional' },
                                { label: 'Convivial', value: 'friendly' },
                                { label: 'Formel', value: 'formal' },
                                { label: 'Décontracté', value: 'casual' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className="px-4 py-3 border-2 border-slate-200 rounded-lg text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Instructions supplémentaires
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Ex: Toujours tutoyer, utiliser des emojis, être concis..."
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer les préférences
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}