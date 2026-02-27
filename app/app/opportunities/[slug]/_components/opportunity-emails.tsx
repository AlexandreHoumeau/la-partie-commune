// opportunity-emails.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MousePointerClick } from "lucide-react"

export default function OpportunityEmails({ opportunityId: _opportunityId }: { opportunityId: string }) {
  // emails envoyés + tracking
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emails</CardTitle>
      </CardHeader>

      <div className="p-4 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <p>Email de présentation</p>
            <p className="text-muted-foreground">Envoyé le 12/01/2026</p>
          </div>

          <div className="flex gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> Ouvert
            </div>
            <div className="flex items-center gap-1">
              <MousePointerClick className="h-4 w-4" /> Cliqué
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
