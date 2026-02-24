"use client";

import { updateAIConfigAction } from "@/actions/ai.server";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AgencyAiConfig } from "@/lib/validators/ai";
import { cn } from "@/lib/utils";
import {
  Brain,
  Check,
  CheckCircle2,
  Coffee,
  Loader2,
  Pencil,
  Shield,
  Smile,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const TONE_OPTIONS = [
  { label: "Professionnel", value: "professional", icon: Shield, color: "text-blue-700 bg-blue-50 border-blue-200" },
  { label: "Convivial", value: "friendly", icon: Smile, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { label: "Formel", value: "formal", icon: UserCircle, color: "text-violet-700 bg-violet-50 border-violet-200" },
  { label: "Décontracté", value: "casual", icon: Coffee, color: "text-amber-700 bg-amber-50 border-amber-200" },
];

const TONE_DISPLAY: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  professional: { label: "Professionnel", icon: Shield, color: "text-blue-700 bg-blue-50 border-blue-100" },
  friendly: { label: "Convivial", icon: Smile, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  formal: { label: "Formel", icon: UserCircle, color: "text-violet-700 bg-violet-50 border-violet-100" },
  casual: { label: "Décontracté", icon: Coffee, color: "text-amber-700 bg-amber-50 border-amber-100" },
};

export function AgencyAICard({ ai }: { ai: AgencyAiConfig | null }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTone, setSelectedTone] = useState(ai?.tone ?? "professional");
  const [state, formAction, isPending] = useActionState(updateAIConfigAction, null);

  const isConfigured = !!(ai?.ai_context || ai?.key_points);
  const tone = TONE_DISPLAY[ai?.tone ?? "professional"];

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "Configuration IA mise à jour");
      setIsEditing(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-amber-50 p-1.5">
            <Brain className="h-4 w-4 text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Agent IA</h2>
          {isConfigured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Configuré
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              À configurer
            </span>
          )}
        </div>
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="h-3 w-3" /> Annuler
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <Pencil className="h-3 w-3" /> {isConfigured ? "Éditer" : "Configurer"}
          </button>
        )}
      </div>

      {isEditing ? (
        <form action={formAction} className="space-y-5 p-6">
          {/* Context */}
          <div className="space-y-1.5">
            <Label htmlFor="context" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Contexte de l'agence
            </Label>
            <Textarea
              id="context"
              name="context"
              defaultValue={ai?.ai_context ?? ""}
              placeholder="Ex: Agence spécialisée dans le résidentiel haut de gamme à Paris..."
              className="min-h-[100px] resize-none bg-slate-50/50 text-sm focus-visible:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Key points */}
          <div className="space-y-1.5">
            <Label htmlFor="keyPoints" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Arguments clés (un par ligne)
            </Label>
            <Textarea
              id="keyPoints"
              name="keyPoints"
              defaultValue={ai?.key_points ?? ""}
              placeholder={"- Disponibilité 7j/7\n- Visites virtuelles 3D\n- Honoraires réduits"}
              className="min-h-[80px] resize-none bg-slate-50/50 text-sm focus-visible:ring-blue-500"
              disabled={isPending}
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Style de communication
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = selectedTone === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedTone(option.value)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border-2 p-3 text-left text-xs font-semibold transition-all",
                      active
                        ? `border-current ${option.color}`
                        : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                    )}
                  >
                    <div className={cn("rounded-lg p-1.5", active ? "bg-current/10" : "bg-white")}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="tone" value={selectedTone} />
          </div>

          {/* Custom instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="instructions" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Instructions particulières
            </Label>
            <Textarea
              id="instructions"
              name="instructions"
              defaultValue={ai?.custom_instructions ?? ""}
              placeholder="Ex: Toujours terminer par une question ouverte..."
              className="min-h-[70px] resize-none bg-slate-50/50 text-sm focus-visible:ring-blue-500"
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="text-slate-500"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="mr-1.5 h-3.5 w-3.5" />
              )}
              Enregistrer
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5 p-6">
          {tone && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Style de communication
              </p>
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold",
                  tone.color
                )}
              >
                <tone.icon className="h-4 w-4" />
                {tone.label}
              </div>
            </div>
          )}

          {ai?.ai_context ? (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Contexte de l'agence
              </p>
              <p className="line-clamp-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                {ai.ai_context}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">L'IA n'a pas encore été configurée</p>
              <p className="mt-1 text-xs text-slate-400">
                Cliquez sur "Configurer" pour personnaliser votre agent.
              </p>
            </div>
          )}

          {ai?.key_points && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Arguments clés
              </p>
              <div className="flex flex-wrap gap-2">
                {ai.key_points
                  .split("\n")
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((point, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {point.replace(/^[-•*]\s*/, "")}
                    </span>
                  ))}
                {ai.key_points.split("\n").filter(Boolean).length > 5 && (
                  <span className="px-2.5 py-1 text-xs text-slate-400">
                    +{ai.key_points.split("\n").filter(Boolean).length - 5} autres
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
