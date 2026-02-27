import { Info, MousePointerClick, Eye, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function TrackingGuide() {
    return (
        <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Comment fonctionne le tracking ?</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="bg-blue-100 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                        <Eye className="h-4 w-4 text-blue-700" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-slate-900">Suivi des ouvertures</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Un "pixel invisible" est inséré dans votre email. Dès que le prospect ouvre le message, vous recevez une notification.
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="bg-amber-100 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                        <MousePointerClick className="h-4 w-4 text-amber-700" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-slate-900">Suivi des clics</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Le lien vers votre site est raccourci pour enregistrer le moment précis où votre prospect manifeste de l'intérêt.
                    </p>
                </div>
            </div>

            <Alert className="bg-white border-blue-100">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 text-xs font-bold uppercase tracking-wider">Pourquoi l'utiliser ?</AlertTitle>
                <AlertDescription className="text-slate-600 text-sm italic">
                    "80% des ventes se font après la 5ème relance. Le tracking vous indique exactement QUAND relancer pour être le plus pertinent."
                </AlertDescription>
            </Alert>
        </div>
    );
}