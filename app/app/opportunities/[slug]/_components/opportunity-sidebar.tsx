import { OpportunityWithCompany } from "@/lib/validators/oppotunities";
import OpportunityMetadata from "./opportunity-metadata";


export default function OpportunitySidebarInfo(opportunity : OpportunityWithCompany) {
    return (
        <div className="flex flex-1 flex-col gap-6 bg-white">
            <h1 className="text-lg font-semibold">Détails de l'entreprise</h1>
            <OpportunityMetadata {...opportunity} />
        </div>
    );
}