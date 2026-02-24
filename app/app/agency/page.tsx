import { fetchSettingsData } from "@/actions/settings.server";
import { AgencyAICard } from "./_components/AgencyAICard";
import { AgencyInfoCard } from "./_components/AgencyInfoCard";
import { AgencyTeamCard } from "./_components/AgencyTeamCard";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Settings,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default async function AgencyOverviewPage() {
  const { agency, team, invites = [], ai, profile } = await fetchSettingsData();

  const companyInitial = agency?.name?.charAt(0).toUpperCase() ?? "A";
  const isAiConfigured = !!(ai?.ai_context || ai?.key_points);
  const agencyCreatedAt = agency?.created_at
    ? dayjs(agency.created_at).locale("fr").format("MMMM YYYY")
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─────────────────── HERO ─────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl ring-1 ring-white/5">
                <span className="text-3xl font-black text-white">{companyInitial}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {agency?.is_active && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  )}
                  {profile.role === "agency_admin" && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-200 bg-blue-500/20 border border-blue-400/30 px-2.5 py-1 rounded-full">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  {agency?.name ?? "Mon Agence"}
                </h1>

                {agency?.address && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-blue-200/70">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {agency.address}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                    <Users className="h-3.5 w-3.5" />
                    {team.length} membre{team.length > 1 ? "s" : ""}
                  </div>
                  {agencyCreatedAt && (
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                      <Activity className="h-3.5 w-3.5" />
                      Depuis {agencyCreatedAt}
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                      isAiConfigured
                        ? "border-amber-500/30 bg-amber-500/20 text-amber-200"
                        : "border-white/10 bg-white/5 text-white/40"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isAiConfigured ? "IA configurée" : "IA non configurée"}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/app/settings"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────── CONTENT ─────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* ── Left column (3/5) ── */}
          <div className="space-y-6 lg:col-span-3">
            <AgencyInfoCard agency={agency} />
            <AgencyAICard ai={ai} />

            {/* Facturation */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-violet-50 p-1.5">
                    <CreditCard className="h-4 w-4 text-violet-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Facturation</h2>
                </div>
                <Link
                  href="/app/settings/billing"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Gérer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-lg shadow-blue-100">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-200">Plan actuel</p>
                    <p className="text-xl font-black">Professional</p>
                    <p className="mt-0.5 text-sm text-blue-100">€49 / mois</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Actif
                    </span>
                    <p className="mt-2 text-right text-xs text-blue-200">
                      Prochain paiement
                      <br />
                      <span className="font-semibold text-white">14 mars 2026</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column (2/5) ── */}
          <div className="space-y-6 lg:col-span-2">
            <AgencyTeamCard team={team} invites={invites as any[]} profile={profile} />

            {/* Suivi & Tracking */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-50 p-1.5">
                    <BarChart3 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Suivi & Tracking</h2>
                </div>
                <Link
                  href="/app/settings/tracking"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Configurer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-3 p-6">
                {(
                  [
                    { label: "Suivi des emails", icon: Zap, active: true },
                    { label: "Ouvertures", icon: Mail, active: true },
                    { label: "Clics sur liens", icon: ExternalLink, active: true },
                  ] as const
                ).map(({ label, icon: Icon, active }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{label}</span>
                    </div>
                    <div
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors",
                        active ? "bg-emerald-500" : "bg-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                          active ? "translate-x-4" : "translate-x-0.5"
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-2 border-t border-slate-100 pt-4">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Paramètres UTM
                  </p>
                  <div className="space-y-1.5">
                    {(
                      [
                        { key: "source", value: "email" },
                        { key: "medium", value: "agence" },
                        { key: "campaign", value: "prospection" },
                      ] as const
                    ).map(({ key, value }) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400">utm_{key}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-semibold text-slate-600">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
