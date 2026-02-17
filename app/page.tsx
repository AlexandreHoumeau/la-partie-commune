"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LayoutDashboard,
  Users2,
  Zap,
  ShieldCheck,
  MousePointerClick,
  Building2
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- NAVIGATION --- */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span>Partie Commune <span className="text-blue-600">CMS</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block" href="#features">
            Fonctionnalités
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/auth/login">
            Se connecter
          </Link>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/signup">Essai gratuit</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="py-20 lg:py-32 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Zap className="mr-2 h-4 w-4" />
              <span>Version 2.0 maintenant disponible</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              L'OS collaboratif pensé pour les <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                agences web modernes.
              </span>
            </h1>
            <p className="max-w-[700px] mx-auto text-slate-500 md:text-xl leading-relaxed">
              Gérez vos projets, collaborez en temps réel et offrez à vos clients
              une interface sur mesure. Ne perdez plus de temps sur l'organisation,
              concentrez-vous sur la création.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-base" asChild>
                <Link href="/app">
                  Accéder à ma plateforme <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="#features">Découvrir les outils</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-20 bg-slate-50 border-y border-slate-100 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Tout ce dont votre agence a besoin</h2>
              <p className="text-slate-500 max-w-[600px] mx-auto text-lg">
                Une suite d'outils intégrés pour centraliser vos opérations et automatiser votre workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />}
                title="Dashboard Unifié"
                description="Visualisez l'état de santé de tous vos projets en un coup d'œil avec des indicateurs clés."
              />
              <FeatureCard
                icon={<Users2 className="w-6 h-6 text-blue-600" />}
                title="Espaces Collaboratifs"
                description="Invitez vos clients et votre équipe dans des espaces sécurisés et compartimentés."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                title="Gestion des Rôles"
                description="Contrôlez précisément qui peut voir et modifier chaque ressource de votre CMS."
              />
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-white relative z-10">
              Prêt à transformer votre productivité ?
            </h2>
            <p className="text-slate-400 text-lg relative z-10">
              Rejoignez les dizaines d'agences qui font confiance à Partie Commune CMS
              pour propulser leurs projets.
            </p>
            <div className="relative z-10">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10" asChild>
                <Link href="/auth/signup">Démarrer maintenant</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© 2026 Partie Commune CMS. Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-blue-600">Confidentialité</Link>
            <Link href="#" className="hover:text-blue-600">Support</Link>
            <Link href="#" className="hover:text-blue-600">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 group">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}