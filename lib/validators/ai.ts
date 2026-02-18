export interface AgencyAiConfig {
    id: string; // UUID
    agency_id: string; // UUID, clé étrangère vers agencies.id
    ai_context?: string | null; // texte optionnel
    key_points?: string | null; // texte optionnel
    tone: 'professional' | string; // texte, par défaut 'professional'
    custom_instructions?: string | null; // texte optionnel
    updated_at?: Date | null; // timestamp avec timezone, par défaut now()
}
