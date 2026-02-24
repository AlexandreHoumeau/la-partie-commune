"use client";

import { updateAgencyInformation } from "@/actions/agency.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Agency } from "@/lib/validators/agency";
import {
  Building2,
  Check,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export function AgencyInfoCard({ agency }: { agency: Agency }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateAgencyInformation, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "Agence mise à jour");
      setIsEditing(false);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const fields = [
    { icon: Globe, label: "Site internet", value: agency.website, isLink: true },
    { icon: Mail, label: "Email contact", value: agency.email, isLink: false },
    { icon: Phone, label: "Téléphone", value: agency.phone, isLink: false },
    { icon: MapPin, label: "Adresse", value: agency.address, isLink: false },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-blue-50 p-1.5">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Identité & Coordonnées</h2>
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
            <Pencil className="h-3 w-3" /> Éditer
          </button>
        )}
      </div>

      {isEditing ? (
        <form action={formAction} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Nom commercial
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={agency.name}
                disabled={isPending}
                className="h-9 text-sm focus-visible:ring-blue-500"
              />
              {state?.errors?.name && (
                <p className="text-xs text-red-500">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Site internet
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://..."
                defaultValue={agency.website ?? ""}
                disabled={isPending}
                className="h-9 text-sm focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Email contact
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={agency.email ?? ""}
                disabled={isPending}
                className="h-9 text-sm focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={agency.phone ?? ""}
                disabled={isPending}
                className="h-9 text-sm focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                defaultValue={agency.address ?? ""}
                disabled={isPending}
                className="h-9 text-sm focus-visible:ring-blue-500"
              />
            </div>
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
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          {fields.map(({ icon: Icon, label, value, isLink }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="shrink-0 rounded-lg bg-slate-50 p-2">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                {value ? (
                  isLink ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 truncate text-sm font-medium text-blue-600 hover:underline"
                    >
                      {value} <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium text-slate-800">{value}</p>
                  )
                ) : (
                  <p className="text-sm italic text-slate-400">Non renseigné</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
