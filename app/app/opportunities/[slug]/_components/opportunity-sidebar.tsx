'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { OpportunityWithCompany } from "@/lib/validators/oppotunities"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import OpportunityMetadata from "./opportunity-metadata"
import { OpportunityDialog } from "@/components/opportunities/OpportunityDialog"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function OpportunitySidebarInfo(opportunity: OpportunityWithCompany) {
    const [editOpen, setEditOpen] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const { profile } = useUserProfile()

    function handleSaved() {
        setEditOpen(false)
        queryClient.invalidateQueries({ queryKey: ["opportunities"] })
        router.refresh()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Détails
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-slate-900"
                    onClick={() => setEditOpen(true)}
                >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Modifier
                </Button>
            </div>

            <OpportunityMetadata {...opportunity} />

            {opportunity.description && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p className="text-sm leading-relaxed">{opportunity.description}</p>
                    </div>
                </>
            )}

            {profile && (
                <OpportunityDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    initialData={opportunity}
                    userProfile={profile}
                    onSaved={handleSaved}
                />
            )}
        </div>
    )
}
