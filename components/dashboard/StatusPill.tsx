import { cn } from "@/lib/utils";
import {
  mapOpportunityStatusLabel,
  OpportunityStatus,
} from "@/lib/validators/oppotunities";

const STATUS_PILL_STYLES: Record<OpportunityStatus, { bg: string; text: string }> = {
  to_do: { bg: "bg-slate-100", text: "text-slate-600" },
  first_contact: { bg: "bg-blue-50", text: "text-blue-700" },
  second_contact: { bg: "bg-indigo-50", text: "text-indigo-700" },
  proposal_sent: { bg: "bg-amber-50", text: "text-amber-700" },
  negotiation: { bg: "bg-violet-50", text: "text-violet-700" },
  won: { bg: "bg-emerald-50", text: "text-emerald-700" },
  lost: { bg: "bg-red-50", text: "text-red-600" },
};

export function StatusPill({ status }: { status: OpportunityStatus }) {
  const { bg, text } = STATUS_PILL_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
        bg,
        text
      )}
    >
      {mapOpportunityStatusLabel[status]}
    </span>
  );
}
