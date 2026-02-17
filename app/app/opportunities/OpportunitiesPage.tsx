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

export default function OpportunitiesPage() {
	const { profile } = useUserProfile();
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<OpportunityWithCompany | null>(null);

	// Fetch opportunities with URL-driven state
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

	// Mutations
	const deleteMutation = useMutation({
		mutationFn: deleteOpportunities,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opportunities"] });
		},
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: OpportunityStatus }) =>
			updateOpportunityStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opportunities"] });
		},
	});

	const updateFavoriteMutation = useMutation({
		mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
			updateOpportunityFavorite(id, isFavorite),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["opportunities"] });
		},
	});

	// Show loading bar for any mutation or query loading
	const isAnyLoading =
		isLoading ||
		deleteMutation.isPending ||
		updateStatusMutation.isPending ||
		updateFavoriteMutation.isPending;

	useLoadingBar(isAnyLoading);

	// Handlers
	const handleStatusChange = (id: string, status: OpportunityStatus) => {
		updateStatusMutation.mutate({ id, status });
	};

	const handleDelete = (ids: string[]) => {
		deleteMutation.mutate(ids);
	};

	const handleFavorite = (id: string, isFavorite: boolean) => {
		updateFavoriteMutation.mutate({ id, isFavorite });
	};

	const handlePagination = (newPage: number) => {
		updateURL({ page: newPage.toString() });
	};

	const handleSearch = (searchValue: string) => {
		updateURL({ search: searchValue, page: "1" });
	};

	const handleFilterChange = (key: string, values: string[]) => {
		updateURL({ [key]: values, page: "1" });
	};

	const handleSaved = () => {
		queryClient.invalidateQueries({ queryKey: ["opportunities"] });
		setDialogOpen(false);
		setEditing(null);
	};

	// Columns
	const columns = getColumns({
		onStatusChange: handleStatusChange,
		onDeleteOpportunities: handleDelete,
		editOpportunity: (opp: OpportunityWithCompany) => {
			setEditing(opp);
			setDialogOpen(true);
		},
		onFavoriteChange: handleFavorite,
	});

	if (!profile?.agency_id) {
		return <div className="p-8">Loading profile...</div>;
	}

	return (
		<div className="p-8 bg-white m-6 rounded-lg shadow-md h-full">
			<div className="flex items-center justify-between mb-6">
				{/* Status badges */}
				<div className="flex flex-wrap gap-2">
					{([
						"to_do",
						"first_contact",
						"proposal_sent",
						"won",
						"lost",
					] as OpportunityStatus[]).map((status) => {
						const count = statusCounts[status];
						return (
							<Badge
								key={status}
								className={`flex items-center gap-2 px-3 py-1 transition ${STATUS_COLORS[status]}`}
							>
								<span className="font-medium">
									{mapOpportunityStatusLabel[status]}
								</span>
								<span className="text-md font-semibold">{count}</span>
							</Badge>
						);
					})}
				</div>
				{/* New opportunity button */}
				<div className="gap-4 flex">
					<Button
						onClick={() => {
							setEditing(null);
							setDialogOpen(true);
						}}
					>
						Nouvelle opportunité
					</Button>
				</div>
			</div>

			{/* DataTable */}
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
				onSearch={handleSearch}
				onFilterChange={handleFilterChange}
				onPagination={handlePagination}
			/>

			{/* OpportunityDialog */}
			<OpportunityDialog
				userProfile={profile}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				initialData={editing}
				onSaved={handleSaved}
			/>
		</div>
	);
}