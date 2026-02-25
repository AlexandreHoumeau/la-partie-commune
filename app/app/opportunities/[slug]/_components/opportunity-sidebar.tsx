import { OpportunityWithCompany } from "@/lib/validators/oppotunities";
import { Separator } from "@/components/ui/separator";
import OpportunityMetadata from "./opportunity-metadata";
import { Building2 } from "lucide-react";

export default function OpportunitySidebarInfo(opportunity: OpportunityWithCompany) {
    return (
        <div className="space-y-6">
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
        </div>
    );
}