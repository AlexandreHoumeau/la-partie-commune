"use client";

import { inviteTeamMember } from "@/actions/agency.server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from "@/lib/validators/profile";
import { cn, getInitials } from "@/lib/utils";
import { Clock, Loader2, Mail, Send, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

type TeamMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export function AgencyTeamCard({
  team,
  invites,
  profile,
}: {
  team: TeamMember[];
  invites: any[];
  profile: Profile;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(inviteTeamMember, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message ?? "Invitation envoyée");
      setDialogOpen(false);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-50 p-1.5">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Équipe</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
            {team.length}
          </span>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700">
              <UserPlus className="h-3 w-3" /> Inviter
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Inviter un collaborateur</DialogTitle>
              <DialogDescription>
                Un email d'invitation sera envoyé pour activer l'accès.
              </DialogDescription>
            </DialogHeader>

            <form action={formAction} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Adresse email</Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  placeholder="nom@agence.fr"
                  disabled={isPending}
                  required
                  className="focus-visible:ring-blue-500"
                />
                {state?.errors?.email && (
                  <p className="text-xs text-red-500">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Rôle</Label>
                <Select name="role" defaultValue="agency_member">
                  <SelectTrigger className="focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agency_admin">Administrateur</SelectItem>
                    <SelectItem value="agency_member">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Envoyer l'invitation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team list */}
      <div className="divide-y divide-slate-50">
        {team.map((member) => {
          const isMe = member.email === profile.email;
          const initials = getInitials(member.first_name, member.last_name, member.email);

          return (
            <div key={member.id} className="flex items-center gap-3 px-6 py-3.5">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                    isMe
                      ? "border-blue-200 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  )}
                >
                  {initials}
                </div>
                {isMe && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-blue-600">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {member.first_name} {member.last_name}
                  </p>
                  {isMe && (
                    <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                      Vous
                    </span>
                  )}
                </div>
                <p className="truncate text-[11px] text-slate-400">{member.email}</p>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                  member.role === "agency_admin"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {member.role === "agency_admin" ? "Admin" : "Membre"}
              </span>
            </div>
          );
        })}

        {team.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center">
            <Users className="mb-2 h-8 w-8 text-slate-200" />
            <p className="text-sm text-slate-400">Aucun membre</p>
          </div>
        )}
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {invites.length} invitation{invites.length > 1 ? "s" : ""} en attente
            </p>
          </div>
          <div className="space-y-2">
            {invites.slice(0, 3).map((invite: any) => (
              <div
                key={invite.id}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <Mail className="h-3 w-3 text-slate-400" />
                </div>
                <p className="flex-1 truncate text-xs text-slate-600">{invite.email}</p>
                <span className="shrink-0 rounded-md border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                  Invité
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
