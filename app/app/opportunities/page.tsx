"use client";

import {
    deleteOpportunities,
    getOpportunities,
    updateOpportunityFavorite,
    updateOpportunityStatus,
} from "@/actions/opportunity.client";
import { OpportunityDrawer } from "@/components/opportunities/OpportunityDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
    mapOpportunityStatusLabel,
    OpportunityStatus,
    OpportunityWithCompany,
} from "@/lib/validators/oppotunities";
import { STATUS_COLORS } from "@/utils/general";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function OpportunitiesPage() {
    const { profile, loading } = useUserProfile();

    const [opportunities, setOpportunities] = useState<
        OpportunityWithCompany[]
    >([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState<OpportunityWithCompany | null>(null);

    // ⬇️ excluded statuses (negative filter)
    const [excludedStatuses, setExcludedStatuses] = useState<
        OpportunityStatus[]
    >([]);

    /* ---------------------------- data fetching ---------------------------- */

    const fetchOpportunities = useCallback(async () => {
        try {
            const data = await getOpportunities();
            setOpportunities(data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    /* ---------------------------- derived data ---------------------------- */

    const statusCounts = opportunities.reduce<Record<OpportunityStatus, number>>(
        (acc, o) => {
            acc[o.status] = (acc[o.status] ?? 0) + 1;
            return acc;
        },
        {
            to_do: 0,
            first_contact: 0,
            second_contact: 0,
            proposal_sent: 0,
            negotiation: 0,
            won: 0,
            lost: 0,
        }
    );

    const filteredOpportunities = opportunities.filter(
        (o) => !excludedStatuses.includes(o.status)
    );

    /* ---------------------------- update helpers ---------------------------- */

    const updateLocalOpportunity = useCallback(
        (id: string, updater: Partial<OpportunityWithCompany>) => {
            setOpportunities((prev) =>
                prev.map((o) => (o.id === id ? { ...o, ...updater } : o))
            );
        },
        []
    );

    /* ------------------------------ handlers -------------------------------- */

    const handleStatusChange = useCallback(
        async (id: string, status: OpportunityStatus) => {
            updateLocalOpportunity(id, { status });

            try {
                await updateOpportunityStatus(id, status);
            } catch (e) {
                console.error(e);
                fetchOpportunities(); // rollback
            }
        },
        [fetchOpportunities, updateLocalOpportunity]
    );

    const handleFavoriteChange = useCallback(
        async (id: string, is_favorite: boolean) => {
            updateLocalOpportunity(id, { is_favorite });

            try {
                await updateOpportunityFavorite(id, is_favorite);
            } catch (e) {
                console.error(e);
                fetchOpportunities(); // rollback
            }
        },
        [fetchOpportunities, updateLocalOpportunity]
    );

    const handleDelete = useCallback(async (ids: string[]) => {
        try {
            await deleteOpportunities(ids);
            setOpportunities((prev) => prev.filter((o) => !ids.includes(o.id)));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const handleSaved = useCallback(
        (saved: OpportunityWithCompany) => {
            setOpportunities((prev) => {
                const exists = prev.some((o) => o.id === saved.id);
                return exists
                    ? prev.map((o) => (o.id === saved.id ? saved : o))
                    : [saved, ...prev];
            });
        },
        []
    );

    /* -------------------------------- guards -------------------------------- */

    if (loading) return null;

    if (!profile?.agency_id) {
        return <div>Agency not found for this user</div>;
    }

    /* -------------------------------- columns ------------------------------- */

    const columns = getColumns({
        onStatusChange: handleStatusChange,
        onFavoriteChange: handleFavoriteChange,
        editOpportunity: (opportunity: OpportunityWithCompany) => {
            setEditing(opportunity);
            setDrawerOpen(true);
        },
        onDeleteOpportunities: handleDelete,
    });

    /* -------------------------------- render -------------------------------- */

    return (
        <div className="p-8 bg-white rounded-lg shadow-md h-full">
            <div className="flex items-center justify-between mb-6">
                {/* Status exclusion filters */}
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
                                className={`flex items-center gap-2 px-3 py-1 transition ${STATUS_COLORS[status]} `}>
                                <span className="font-medium">
                                    {mapOpportunityStatusLabel[status]}
                                </span>
                                <span className="text-md font-semibold">
                                    {count}
                                </span>
                            </Badge>
                        );
                    })}
                </div>
                <div className="gap-4 flex ">
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setDrawerOpen(true);
                        }}
                    >
                        Nouvelle opportunité
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={filteredOpportunities} />
            <OpportunityDrawer
                userProfile={profile}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                initialData={editing}
                onSaved={handleSaved}
            />
        </div>
    );
}
