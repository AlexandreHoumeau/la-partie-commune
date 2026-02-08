// opportunity-metadata.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OpportunityMetadata({ opportunity }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div><strong>Source</strong> : {opportunity.source}</div>
        <div><strong>Budget</strong> : {opportunity.budget ?? "—"}</div>
        <div><strong>Localisation</strong> : {opportunity.city}</div>
        <div><strong>Créé le</strong> : {new Date(opportunity.created_at).toLocaleDateString()}</div>
      </CardContent>
    </Card>
  )
}
