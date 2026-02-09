"use client"

import { generateOpportunityMessage } from "@/actions/ai-messages"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy } from "lucide-react"
import { useActionState } from "react"
import { OpportunityWithCompany } from "@/lib/validators/oppotunities"
import { OpportunityAIContext } from "@/lib/email_generator/utils"

export function AIMessageGenerator({
    opportunity,
}: {
    opportunity: OpportunityWithCompany
}) {
    const aiContext: OpportunityAIContext = {
        id: opportunity.id,
        status: opportunity.status,
        contact_via: opportunity.contact_via!,
        description: opportunity.description,
        company: {
            name: opportunity.company?.name!,
            business_sector: opportunity.company?.business_sector!,
            website: opportunity.company?.website!,
        },
    }

    const [state, formAction, isPending] = useActionState(
        generateOpportunityMessage,
        { subject: null, body: null }
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Assistant IA
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <form action={formAction} className="space-y-4">
                    {/* ✅ FULL OPPORTUNITY CONTEXT */}
                    <input
                        type="hidden"
                        name="opportunity"
                        value={JSON.stringify(aiContext)}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select name="tone" defaultValue="friendly">
                            <SelectTrigger>
                                <SelectValue placeholder="Ton" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="formal">Formel</SelectItem>
                                <SelectItem value="friendly">Amiable</SelectItem>
                                <SelectItem value="casual">Décontracté</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select name="length" defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Longueur" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short">Court</SelectItem>
                                <SelectItem value="medium">Moyen</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Génération..." : "Générer le message"}
                    </Button>
                </form>

                {state.body && (
                    <div className="space-y-3">
                        <Textarea value={state.body} rows={10} readOnly />
                        <Button
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(state.body!)}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copier
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
