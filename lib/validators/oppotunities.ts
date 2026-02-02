import { z } from "zod";
import { Company } from "./companies";

export const opportunitySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),

  company_name: z.string().min(1, "Le nom de l’entreprise est requis"),
  company_email: z.string().email("Email invalide").optional().or(z.literal("")),
  company_phone: z.string().optional(),
  company_website: z.string().url("URL invalide").optional().or(z.literal("")),
  company_address: z.string().optional(),
  company_sector: z.string().optional(),

  status: z.enum([
    "to_do",
    "first_contact",
    "second_contact",
    "proposal_sent",
    "negotiation",
    "won",
    "lost",
  ]),

  contact_via: z.enum(["email", "phone", "IRL"]),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;


export type OpportunityStatus =
  | "to_do"
  | "first_contact"
  | "second_contact"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export const mapOpportunityStatusLabel: Record<OpportunityStatus, string> = {
  to_do: "À faire",
  first_contact: "Premier contact",
  second_contact: "Deuxième contact",
  proposal_sent: "Proposition envoyée",
  negotiation: "Négociation",
  won: "Gagné",
  lost: "Perdu",
};

export const mapContactViaLabel: Record<ContactVia, string> = {
  email: "Email",
  phone: "Téléphone",
  IRL: "En personne",
};

export type ContactVia = "email" | "phone" | "IRL";


export type Opportunity = {
  id: string;
  agency_id: string | null;
  company_id: string | null;

  name: string;
  description: string | null;

  status: OpportunityStatus;
  contact_via: ContactVia | null;

  created_at: string;
  updated_at: string;
  is_favorite: boolean;
};

export type OpportunityWithCompany = Opportunity & {
  company: Company | null;
};


export const mapOpportunityWithCompanyToFormValues = (opportunity: OpportunityWithCompany): OpportunityFormValues => ({
  name: opportunity.name,
  description: opportunity.description || "",
  company_name: opportunity?.company?.name!,
  company_email: opportunity?.company?.email || "",
  company_phone: opportunity?.company?.phone_number || "",
  company_website: opportunity?.company?.website || "",
  company_address: opportunity?.company?.address || "",
  company_sector: opportunity?.company?.business_sector || "",
  status: opportunity.status,
  contact_via: opportunity.contact_via!,
});
