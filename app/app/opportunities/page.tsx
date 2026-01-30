"use client";

import { getOpportunities, updateOpportunityStatus } from "@/actions/opportunity.actions";
import { OpportunityDrawer } from "@/components/opportunities/OpportunityDrawer";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { OpportunityStatus } from "@/lib/validators/oppotunities";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function OpportunitiesPage() {
    const { profile, loading } = useUserProfile();

    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getOpportunities();
            setOpportunities(data);
        }
        fetchData();
    }, []);

    const handleStatusChange = async (
        id: string,
        status: OpportunityStatus
    ) => {
        // optimistic UI
        setOpportunities((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, status } : o
            )
        );

        try {
            await updateOpportunityStatus(id, status);
        } catch (e) {
            console.error(e);
            // optional rollback
        }
    };



    const handleSaved = (saved: any) => {
        setOpportunities((prev) => {
            const exists = prev.find((o) => o.id === saved.id);
            return exists
                ? prev.map((o) => (o.id === saved.id ? saved : o))
                : [...prev, saved];
        });
    };

    if (loading) return null;
    if (!profile?.agency_id) {
        return <div>Agency not found for this user</div>;
    }

    const columns = getColumns({
        onStatusChange: handleStatusChange,
    });


    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button
                    onClick={() => {
                        setEditing(null);
                        setDrawerOpen(true);
                    }}
                >
                    New Opportunity
                </Button>
            </div>
            <DataTable columns={columns} data={opportunities} />
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
