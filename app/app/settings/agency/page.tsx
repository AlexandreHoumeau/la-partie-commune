export default function AgencyPage() {
    return (
        <div className="space-y-8">
            {/* Équipe */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Équipe</h2>
                    <p className="text-sm text-slate-500 mt-1">Invitez et gérez les membres de votre agence</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-6">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Inviter un membre</h3>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            placeholder="email@example.com"
                        />
                        <select className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option>Admin</option>
                            <option>Agent</option>
                            <option>Collaborateur</option>
                            <option>Lecteur</option>
                        </select>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
                            Envoyer l'invitation
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Membres actifs</h3>
                    <div className="space-y-2">
                        {[
                            { name: 'Jean Dupont', email: 'jean@agence.fr', role: 'Admin' },
                            { name: 'Marie Martin', email: 'marie@agence.fr', role: 'Agent' },
                            { name: 'Pierre Durant', email: 'pierre@agence.fr', role: 'Collaborateur' }
                        ].map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">{member.name}</div>
                                        <div className="text-xs text-slate-500">{member.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                        {member.role}
                                    </span>
                                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-slate-200" />

            {/* Informations */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Informations de l'agence</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez les informations de votre agence</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Nom de l'agence
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Partie Commune"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Site web
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="https://www.agence.fr"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="+33 1 23 45 67 89"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="contact@agence.fr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Adresse
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="123 rue de la République, 75001 Paris"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Décrivez votre agence..."
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

            {/* Identité visuelle */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Identité visuelle</h2>
                    <p className="text-sm text-slate-500 mt-1">Personnalisez l'apparence de votre agence</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Logo
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-sm text-slate-600">
                                Cliquez pour télécharger ou glissez-déposez
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                PNG, JPG ou SVG (max. 2MB)
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Couleur principale
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                className="h-10 w-16 border border-slate-300 rounded-lg cursor-pointer"
                                defaultValue="#3b82f6"
                            />
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value="#3b82f6"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                            Enregistrer les modifications
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}