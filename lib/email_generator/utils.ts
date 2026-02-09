import z from "zod";
import { ContactVia, OpportunityStatus } from "../validators/oppotunities";
import { id } from "zod/v4/locales";

export const STATUS_TO_INTENT: Record<OpportunityStatus, EmailIntent> = {
    to_do: "first_contact",
    first_contact: "first_contact",
    second_contact: "follow_up",
    proposal_sent: "proposal_follow_up",
    negotiation: "negotiation",
    won: "thank_you",
    lost: "reconnect",
}

export type EmailIntent =
    | "first_contact"
    | "follow_up"
    | "no_response"
    | "proposal_sent"
    | "reconnect"
    | "proposal_follow_up"
    | "negotiation"
    | "thank_you";

export type EmailTone =
    | "very_short"
    | "professional"
    | "friendly"
    | "confident"
    | "warm"
    | "direct"


export const CONTACT_RULES = {
    email: {
        hasSubject: true,
        maxParagraphs: 3,
        greeting: "formal",
    },
    linkedin: {
        hasSubject: false,
        maxParagraphs: 2,
        greeting: "casual",
    },
    instagram: {
        hasSubject: false,
        maxParagraphs: 1,
        greeting: "very_casual",
    },
}

export const MessageSchema = z.object({
    opportunity: z.object({
        id: z.string(),
        status: z.enum([
            "to_do",
            "first_contact",
            "second_contact",
            "proposal_sent",
            "negotiation",
            "won",
            "lost",
        ]),
        contact_via: z.enum(["email", "linkedin", "instagram"]),
        description: z.string().nullable(),
        company: z.object({
            name: z.string(), // ✅ correct location
            business_sector: z.string().nullable(),
            website: z.string().nullable(),
        }),
    }),
    tone: z.enum(["formal", "friendly", "casual"]),
    length: z.enum(["short", "medium"]),
})


export type OpportunityAIContext = {
    id: string
    status: OpportunityStatus
    contact_via: ContactVia
    description: string | null
    company: {
        name: string
        business_sector: string | null
        website: string | null
    }
}
