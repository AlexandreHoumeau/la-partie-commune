"use server";
import { MessageSchema } from "@/lib/email_generator/utils";
import { createClient } from "@/lib/supabase/server";
import { Mistral } from '@mistralai/mistralai';
import { ContentChunk } from "@mistralai/mistralai/models/components";

export async function generateOpportunityMessage(prevState: any, formData: FormData): Promise<{ subject: string | null; body: string | null }> {
    const apiKey = process.env.MISTRAL_API_KEY;
    const { opportunity, tone, length } = MessageSchema.parse({
        opportunity: JSON.parse(formData.get("opportunity") as string),
        tone: formData.get("tone"),
        length: formData.get("length"),
    })

    const supabase = await createClient();
    const prompt = `
    <s>[INST]
        Rédige un message de ${opportunity.contact_via}
        pour une opportunité au statut "${opportunity.status}".

        Entreprise : ${opportunity.company.name}
        Secteur : ${opportunity.company.business_sector ?? "non précisé"}
        Site : ${opportunity.company.website ?? "—"}
        Contexte : ${opportunity.description ?? "—"}

        Ton : ${tone}
        Longueur : ${length}

        Règles :
            - Message naturel
            - Adapté au canal
            - Orienté action
            - Signature "Alexandre – Atelier Voisin" sauf Instagram
    [/INST]</s>`;

    const mistral = new Mistral({ apiKey: apiKey });
    const response = await mistral.chat.complete({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    let messageText: string;
    if (Array.isArray(response.choices[0].message.content)) {
        messageText = response.choices[0].message.content
            .map((chunk: ContentChunk) => {
                if (typeof chunk === "string") return chunk;
                if ("text" in chunk) return chunk.text;
                return "";
            })
            .join("");
    } else {
        messageText = response.choices[0].message.content || "";
    }

    await supabase.from("ai_cache").insert({
        opportunity_id: opportunity.id,
        channel: opportunity.contact_via,
        tone,
        length,
        message_text: messageText,
    });

    return {
        subject: opportunity.contact_via === "email" ? "Sujet généré" : null,
        body: messageText,
    };
}
