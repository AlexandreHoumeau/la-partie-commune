"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OpportunityTable } from "@/components/opportunities/OpportunityTable";
import { OpportunityDrawer } from "@/components/opportunities/OpportunityDrawer";
import { getOpportunities } from "@/actions/opportunity.actions";
import { useUserProfile } from "@/hooks/useUserProfile";

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

            <OpportunityTable
                opportunities={opportunities}
                onEdit={(opportunity) => {
                    setEditing(opportunity);
                    setDrawerOpen(true);
                }}
            />

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
