type StructuredEmailDraft = {
  subject: string;
  intro: string;
  observation: string;
  improvements: string[];
  outcome: string;
  cta: string;
};

function cleanSentence(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ensureSentenceEnding(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/[.!?…]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function stripBulletPrefix(value: string): string {
  return value.replace(/^[-*•]\s*/, "").trim();
}

function fallbackSubject(companyName: string): string {
  return `${companyName} : rendre votre site plus clair`;
}

function fallbackOutcome(companyName: string): string {
  return `L'objectif est d'avoir une presence en ligne plus claire et plus credible, a la hauteur de ${companyName}.`;
}

function fallbackCta(): string {
  return "Si vous le souhaitez, je peux vous envoyer 2 ou 3 pistes concretes adaptees a votre activite, sans engagement.";
}

function fallbackIntro(agencyName?: string | null): string {
  if (agencyName?.trim()) {
    return `${agencyName.trim()} accompagne les entreprises qui veulent creer ou faire evoluer leur site pour le rendre plus clair, plus visible et plus efficace commercialement.`;
  }

  return "Nous accompagnons les entreprises qui veulent creer ou faire evoluer leur site pour le rendre plus clair, plus visible et plus efficace commercialement.";
}

function ensureOutcomePrefix(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^l['’]objectif est/i.test(trimmed)) return trimmed;
  const normalized = `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  if (/^(une|un|des|la|le|les)\b/i.test(normalized)) {
    return `L'objectif est d'avoir ${normalized}`;
  }
  return `L'objectif est de ${normalized}`;
}

function normalizeIntro(value: string, companyName: string, agencyName?: string | null): string {
  const cleaned = ensureSentenceEnding(cleanSentence(value));
  if (!cleaned) return fallbackIntro(agencyName);

  const companyRegex = new RegExp(`^${escapeRegex(companyName)}\\b`, "i");
  const mentionsCompanyAsSender = companyRegex.test(cleaned) && /\baccompagne\b/i.test(cleaned);

  if (!agencyName?.trim()) {
    return mentionsCompanyAsSender ? fallbackIntro(null) : cleaned;
  }

  const agencyRegex = new RegExp(`\\b${escapeRegex(agencyName.trim())}\\b`, "i");
  const mentionsAgency = agencyRegex.test(cleaned);

  if (!mentionsAgency || mentionsCompanyAsSender) {
    return fallbackIntro(agencyName);
  }

  return cleaned;
}

export function parseStructuredEmailDraft(raw: string, companyName: string, agencyName?: string | null): StructuredEmailDraft {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let currentKey: keyof StructuredEmailDraft | null = null;
  const buckets: Record<keyof StructuredEmailDraft, string[]> = {
    subject: [],
    intro: [],
    observation: [],
    improvements: [],
    outcome: [],
    cta: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^(subject|intro|observation|improvements|outcome|cta)\s*:\s*(.*)$/i);
    if (match) {
      currentKey = match[1].toLowerCase() as keyof StructuredEmailDraft;
      const remainder = match[2]?.trim();
      if (remainder) {
        buckets[currentKey].push(remainder);
      }
      continue;
    }

    if (currentKey) {
      buckets[currentKey].push(trimmed);
    }
  }

  const improvements = buckets.improvements
    .flatMap((line) => line.split("|"))
    .map(stripBulletPrefix)
    .map(cleanSentence)
    .map(ensureSentenceEnding)
    .filter(Boolean)
    .slice(0, 4);

  return {
    subject: cleanSentence(buckets.subject.join(" ")) || fallbackSubject(companyName),
    intro: normalizeIntro(cleanSentence(buckets.intro.join(" ")), companyName, agencyName),
    observation: ensureSentenceEnding(cleanSentence(buckets.observation.join(" "))) || `En decouvrant ${companyName}, on comprend bien l'activite, mais le site pourrait mieux structurer l'offre et rassurer des le premier coup d'oeil.`,
    improvements,
    outcome: ensureSentenceEnding(ensureOutcomePrefix(cleanSentence(buckets.outcome.join(" ")))) || fallbackOutcome(companyName),
    cta: ensureSentenceEnding(cleanSentence(buckets.cta.join(" "))) || fallbackCta(),
  };
}

export function buildStructuredEmailBody(
  draft: StructuredEmailDraft,
  trackingLinkUrl?: string | null,
  agencyName?: string | null
): string {
  const paragraphs: string[] = [
    "Bonjour,",
    "J'espère que vous allez bien.",
    draft.intro,
    draft.observation,
  ];

  if (draft.improvements.length > 0) {
    paragraphs.push(
      "Il y aurait un vrai potentiel pour :",
      draft.improvements.map((item) => `- ${item}`).join("\n")
    );
  }

  paragraphs.push(draft.outcome);
  paragraphs.push(draft.cta);

  if (trackingLinkUrl) {
    paragraphs.push(`Vous pouvez consulter un exemple ou quelques pistes ici :\n${trackingLinkUrl}`);
  }

  if (agencyName?.trim()) {
    paragraphs.push(`À bientôt,\n\n${agencyName.trim()}`);
  }

  return paragraphs.join("\n\n").trim();
}
