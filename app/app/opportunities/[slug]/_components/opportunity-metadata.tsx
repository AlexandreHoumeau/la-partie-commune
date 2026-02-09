import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mapContactViaLabel, mapOpportunityStatusLabel, OpportunityWithCompany } from "@/lib/validators/oppotunities"
import { CONTACT_COLORS, STATUS_COLORS } from "@/utils/general"
import {
  Briefcase,
  Building2,
  Globe, LucideIcon, Mail,
  MapPin,
  Phone,
  Send,
  Tag
} from "lucide-react"

export default function OpportunityMetadata(opportunity: OpportunityWithCompany) {
  return (
    <div className="bg-background space-y-4">
      <div className="space-y-3 text-sm">
        <Row label="Company" icon={Building2}>
          <span className="font-medium">{opportunity.company?.name}</span>
        </Row>

        <Row label="Industry" icon={Briefcase}>
          <span>{opportunity.company?.business_sector}</span>
        </Row>

        <Separator className="my-4" />

        <Row label="Email" icon={Mail}>
          <a
            href={`mailto:${opportunity.company?.email}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            {opportunity.company?.email}
          </a>
        </Row>

        <Row label="Phone" icon={Phone}>
          <a
            href={`tel:${opportunity.company?.phone_number}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            {opportunity.company?.phone_number}
          </a>
        </Row>

        {opportunity.company?.website && (
          <Row label="Website" icon={Globe}>
            <a
              href={opportunity.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              {opportunity.company.website}
            </a>
          </Row>
        )}

        <Row label="Address" icon={MapPin}>
          <span>{opportunity.company?.address}</span>
        </Row>

        <Separator className="my-4" />

        <Row label="Contact via" icon={Send}>
          <Badge className={CONTACT_COLORS[opportunity.contact_via!]}>{mapContactViaLabel[opportunity.contact_via!]}</Badge>
        </Row>

        <Row label="Status" icon={Tag}>
          <Badge className={STATUS_COLORS[opportunity.status!]}>{mapOpportunityStatusLabel[opportunity.status!]}</Badge>
        </Row>
      </div>
    </div>
  )
}

function Row({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>

      <div className="text-right">{children}</div>
    </div>
  )
}
