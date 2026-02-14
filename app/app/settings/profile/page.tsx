export default function ProfilePage() {
    return (
        <div className="space-y-8">
            {/* Informations générales */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Informations générales</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez vos informations personnelles</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Prénom
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Jean"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Nom
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Poste
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Agent immobilier"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer les modifications
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* Email */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Adresse email</h2>
                    <p className="text-sm text-slate-500 mt-1">Modifiez votre adresse email</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email actuel
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                            value="jean.dupont@example.com"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Nouvel email
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="nouveau@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Mettre à jour l'email
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* Mot de passe */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Mot de passe</h2>
                    <p className="text-sm text-slate-500 mt-1">Changez votre mot de passe</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Mot de passe actuel
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Minimum 8 caractères, avec majuscules et chiffres
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Changer le mot de passe
                        </button>
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* Téléphone */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Numéro de téléphone</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez votre numéro de téléphone</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="+33 6 12 34 56 78"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}