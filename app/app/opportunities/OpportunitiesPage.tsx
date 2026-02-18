"use client";
import { deleteOpportunities, updateOpportunityFavorite, updateOpportunityStatus } from "@/actions/opportunity.client";
import { OpportunityDialog } from "@/components/opportunities/OpportunityDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLoadingBar } from "@/hooks/useLoadingBar";
import {
	mapOpportunityStatusLabel,
	OpportunityStatus,
	OpportunityWithCompany,
} from "@/lib/validators/oppotunities";
import { STATUS_COLORS } from "@/utils/general";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { Plus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OpportunitiesPage() {
	const { profile } = useUserProfile();
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<OpportunityWithCompany | null>(null);

	const {
		opportunities,
		total,
		page,
		pageSize,
		search,
		statuses,
		contactVia,
		isLoading,
		statusCounts,
		updateURL,
	} = useOpportunities({
		pageSize: 10,
		agencyId: profile?.agency_id || "",
		enabled: !!profile?.agency_id,
	});

	// Mutations (inchangées) ...
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: OpportunityStatus }) => updateOpportunityStatus(id, status),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
	});

	useLoadingBar(isLoading);

	const columns = getColumns({
		onStatusChange: (id, status) => updateStatusMutation.mutate({ id, status }),
		onDeleteOpportunities: (ids) => deleteOpportunities(ids).then(() => queryClient.invalidateQueries({ queryKey: ["opportunities"] })),
		editOpportunity: (opp) => { setEditing(opp); setDialogOpen(true); },
		onFavoriteChange: (id, isFavorite) => updateOpportunityFavorite(id, isFavorite).then(() => queryClient.invalidateQueries({ queryKey: ["opportunities"] })),
	});

	if (!profile?.agency_id) return <div className="p-8">Chargement...</div>;

	return (
		<div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 py-6">
			{/* HEADER & ACTIONS */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<div className="p-1.5 bg-blue-600 rounded-lg shadow-blue-100 shadow-lg">
							<Briefcase className="h-4 w-4 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-slate-900">Opportunités</h1>
					</div>
					<p className="text-slate-500 text-sm italic">Gérez votre pipeline commercial et suivez vos prospects.</p>
				</div>

				<Button
					onClick={() => { setEditing(null); setDialogOpen(true); }}
					className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
				>
					<Plus className="mr-2 h-4 w-4" />
					Nouvelle opportunité
				</Button>
			</div>

			{/* STATUS METRICS */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
				{(["to_do", "first_contact", "proposal_sent", "won", "lost"] as OpportunityStatus[]).map((status) => {
					const count = statusCounts[status] || 0;
					return (
						<div key={status} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:border-blue-200 transition-all group">
							<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">
								{mapOpportunityStatusLabel[status]}
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-xl font-bold text-slate-900">{count}</span>
								<Badge variant="outline" className={cn("text-[10px] h-4 px-1.5 border-none", STATUS_COLORS[status])}>
									Active
								</Badge>
							</div>
						</div>
					);
				})}
			</div>

			{/* TABLE CONTAINER */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-1">
				<DataTable
					columns={columns}
					data={opportunities}
					total={total}
					page={page}
					pageSize={pageSize}
					search={search}
					statuses={statuses}
					contactVia={contactVia}
					isLoading={isLoading}
					onSearch={(val) => updateURL({ search: val, page: "1" })}
					onFilterChange={(key, values) => updateURL({ [key]: values, page: "1" })}
					onPagination={(newPage) => updateURL({ page: newPage.toString() })}
				/>
			</div>

			<OpportunityDialog
				userProfile={profile}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				initialData={editing}
				onSaved={() => { queryClient.invalidateQueries({ queryKey: ["opportunities"] }); setDialogOpen(false); }}
			/>
		</div>
	);
}