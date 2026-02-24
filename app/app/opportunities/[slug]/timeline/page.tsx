import { Calendar } from "lucide-react";

export default function TimelinePage() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
        <Calendar className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm font-medium">Bientôt disponible</p>
      </div>
    </div>
  );
}
