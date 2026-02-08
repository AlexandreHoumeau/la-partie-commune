// opportunity-actions.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OpportunityActions({ opportunity }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>

      <div className="p-4 flex flex-col gap-2">
        <Button variant="default">Passer en “Contacté”</Button>
        <Button variant="outline">Ajouter une note</Button>
        <Button variant="destructive">Archiver</Button>
      </div>
    </Card>
  )
}
