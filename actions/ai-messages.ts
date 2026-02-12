"use server";
import { MessageSchema } from "@/lib/email_generator/utils";
import { createClient } from "@/lib/supabase/server";
import { Mistral } from '@mistralai/mistralai';
import { ContentChunk } from "@mistralai/mistralai/models/components";
import { revalidatePath } from "next/cache";

export type SaveAIMessageInput = {
	opportunityId: string;
	channel: string;
	tone: string;
	length: string;
	customContext?: string;
	subject?: string;
	body: string;
};

export async function saveAIGeneratedMessage(input: SaveAIMessageInput) {
	const supabase = await createClient();

	try {
		const { data, error } = await supabase
			.from("ai_generated_messages")
			.insert({
				opportunity_id: input.opportunityId,
				channel: input.channel,
				tone: input.tone,
				length: input.length,
				custom_context: input.customContext || null,
				subject: input.subject || null,
				body: input.body,
			})
			.select()
			.single();

		if (error) {
			console.error("Error saving AI message:", error);
			return { success: false, error: error.message };
		}

		// Revalidate the opportunity page to show the new message
		revalidatePath(`/opportunities/${input.opportunityId}`);

		return { success: true, data };
	} catch (error) {
		console.error("Error saving AI message:", error);
		return { success: false, error: "Une erreur est survenue" };
	}
}

export async function getAIGeneratedMessages(opportunityId: string) {
	const supabase = await createClient();

	try {
		const { data, error } = await supabase
			.from("ai_generated_messages")
			.select("*")
			.eq("opportunity_id", opportunityId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching AI messages:", error);
			return { success: false, error: error.message, data: [] };
		}

		return { success: true, data: data || [] };
	} catch (error) {
		console.error("Error fetching AI messages:", error);
		return { success: false, error: "Une erreur est survenue", data: [] };
	}
}

export async function updateAIGeneratedMessage(
	messageId: string,
	updates: { subject?: string; body?: string }
) {
	const supabase = await createClient();
	try {
		const { data, error } = await supabase
			.from("ai_generated_messages")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", messageId)
			.select()
			.single();

		if (error) {
			console.error("Error updating AI message:", error);
			return { success: false, error: error.message };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Error updating AI message:", error);
		return { success: false, error: "Une erreur est survenue" };
	}
}


export async function generateOpportunityMessage(
	prevState: any,
	formData: FormData,
	agencyId?: string
): Promise<{ subject: string | null; body: string; error?: string; id: string | null }> {
	try {
		const apiKey = process.env.MISTRAL_API_KEY;
		if (!apiKey) {
			return { subject: null, body: "", error: "Clé API Mistral manquante", id: null };
		}

		const rawOpportunity = formData.get("opportunity") as string;
		const customContext = formData.get("customContext") as string;
		const channel = formData.get("channel") as string;

		const { opportunity, tone, length } = MessageSchema.parse({
			opportunity: JSON.parse(rawOpportunity),
			tone: formData.get("tone"),
			length: formData.get("length"),
			channel,
			customContext,
		});

		const supabase = await createClient();

		// Build context-aware prompt
		const statusContext = {
			"to_do": "premier contact, introduction de votre agence",
			"first_contact": "suivi après premier contact",
			"second_contact": "relance après discussion initiale",
			"proposal_sent": "suivi de proposition envoyée",
			"negotiation": "négociation en cours",
			"won": "confirmation de collaboration",
			"lost": "message de clôture professionnel",
		}[opportunity.status as string] || "contact professionnel";

		const channelGuidelines = {
			email: "Email professionnel avec sujet accrocheur et structure claire",
			instagram: "Message direct Instagram, concis et engageant (max 2-3 phrases)",
			linkedin: "Message LinkedIn professionnel mais accessible",
			phone: "Script d'appel téléphonique avec points clés",
			IRL: "Points de discussion pour rencontre en personne",
		}[channel] || "Message professionnel";

		const prompt = `
            <s>[INST]
            Tu es Alexandre de l'Atelier Voisin, une agence créative spécialisée en design et communication.

            CONTEXTE DE L'OPPORTUNITÉ :
            - Phase : ${statusContext}
            - Entreprise : ${opportunity.company.name}
            - Secteur : ${opportunity.company.business_sector || "non spécifié"}
            - Site web : ${opportunity.company.website || "non fourni"}
            - Description : ${opportunity.description || "Pas de description"}
            ${customContext ? `- Contexte additionnel : ${customContext}` : ""}

            CONSIGNES :
            - Canal : ${channelGuidelines}
            - Ton : ${tone === "formal" ? "formel et professionnel" : tone === "friendly" ? "amiable et chaleureux" : "décontracté et accessible"}
            - Longueur : ${length === "short" ? "court et percutant (2-3 phrases)" : "moyen et détaillé (1-2 paragraphes)"}
            ${channel === "email" ? "- Structure : Sujet attractif + Corps avec introduction, proposition de valeur, et call-to-action" : ""}
            ${channel !== "instagram" ? "- Signature : Alexandre – Atelier Voisin" : "- Pas de signature formelle"}

            RÈGLES :
            1. Message naturel et personnalisé (pas de template)
            2. Adapté au contexte et à la phase de l'opportunité
            3. Orienté vers une action concrète
            4. Mentionner des éléments spécifiques à l'entreprise quand possible
			5. Ne pas inclure de commentaires ou d'explications, uniquement le message à envoyer au prospect
            ${channel === "email" ? "5. Commence par le SUJET sur une ligne séparée, puis le corps du message" : ""}

            Rédige le message maintenant.
            [/INST]</s>`;

		const mistral = new Mistral({ apiKey });
		const response = await mistral.chat.complete({
			model: "mistral-small-latest",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
			maxTokens: 500,
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

		// Extract subject for emails
		let subject: string | null = null;
		let body = messageText;

		if (channel === "email" && messageText.includes("\n")) {
			const lines = messageText.split("\n").filter(l => l.trim());
			const firstLine = lines[0].trim();

			// Check if first line looks like a subject
			if (firstLine.length < 100 && !firstLine.includes(".") && lines.length > 1) {
				subject = firstLine.replace(/^(Sujet|Subject)\s*:\s*/i, "");
				body = lines.slice(1).join("\n").trim();
			}
		}

		// Save to database
		const { data: savedMessage, error: dbError } = await supabase
			.from("ai_generated_messages")
			.insert({
				opportunity_id: opportunity.id,
				agency_id: agencyId,
				channel,
				tone,
				length,
				custom_context: customContext || null,
				subject,
				body,
			})
			.select()
			.single();

		if (dbError) {
			console.error("Error saving message:", dbError);
		}

		return {
			subject,
			body,
			id: savedMessage?.id,
		};
	} catch (error) {
		console.error("Erreur génération message:", error);
		return {
			subject: null,
			body: "",
			error: "Erreur lors de la génération. Veuillez réessayer.",
			id: null,
		};
	}
}

export async function deleteGeneratedMessage(messageId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.from("ai_generated_messages")
		.delete()
		.eq("id", messageId);

	if (error) {
		console.error("Error deleting message:", error);
		throw error;
	}
}