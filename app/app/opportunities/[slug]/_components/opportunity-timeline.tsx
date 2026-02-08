// opportunity-timeline.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function OpportunityTimeline({ opportunityId }: { opportunityId: string }) {
  // plus tard : fetch events (notes, status change, emails)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique</CardTitle>
      </CardHeader>
      <div className="p-4 text-sm text-muted-foreground">
        Aucun événement pour l’instant
      </div>
    </Card>
  )
}
