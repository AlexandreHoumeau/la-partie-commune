// opportunity-header.tsx
import { Badge } from "@/components/ui/badge"

export default function OpportunityHeader({ opportunity }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{opportunity.company_name}</h1>
        <p className="text-sm text-muted-foreground">
          {opportunity.contact_name} · {opportunity.email}
        </p>
      </div>

      <Badge variant="outline">{opportunity.status}</Badge>
    </div>
  )
}
