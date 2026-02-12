import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mapContactViaLabel, mapOpportunityStatusLabel, OpportunityWithCompany } from "@/lib/validators/oppotunities";
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general";
import {
  Briefcase,
  Building2,
  Globe,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Tag,
} from "lucide-react";

export default function OpportunityMetadata(opportunity: OpportunityWithCompany) {
  return (
    <div className="space-y-4">
      {/* Company Name */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          <span>Entreprise</span>
        </div>
        <p className="text-sm font-semibold">{opportunity.company?.name}</p>
      </div>

      {/* Industry */}
      {opportunity.company?.business_sector && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Secteur</span>
          </div>
          <p className="text-sm">{opportunity.company.business_sector}</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-3">
        {opportunity.company?.email && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </div>
            <a
              href={`mailto:${opportunity.company.email}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {opportunity.company.email}
            </a>
          </div>
        )}

        {opportunity.company?.phone_number && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>Téléphone</span>
            </div>
            <a
              href={`tel:${opportunity.company.phone_number}`}
              className="text-sm text-primary hover:underline"
            >
              {opportunity.company.phone_number}
            </a>
          </div>
        )
        }

        {
          opportunity.company?.website && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span>Site web</span>
              </div>
              <a
                href={opportunity.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Visiter
                <ExternalLink className="h-3 w-3" />
              </a>
            </div >
          )
        }

        {
          opportunity.company?.address && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>Adresse</span>
              </div>
              <p className="text-sm">{opportunity.company.address}</p>
            </div>
          )
        }
      </div >

      {/* Status & Contact Method */}
      < div className="space-y-3 pt-2" >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span>Statut</span>
          </div>
          <Badge className={STATUS_COLORS[opportunity.status]}>
            {mapOpportunityStatusLabel[opportunity.status]}
          </Badge>
        </div>

        {
          opportunity.contact_via && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>Contact via</span>
              </div>
              <Badge variant="outline" className={CONTACT_COLORS[opportunity.contact_via]}>
                {mapContactViaLabel[opportunity.contact_via]}
              </Badge>
            </div>
          )
        }
      </div >
    </div >
  );
}