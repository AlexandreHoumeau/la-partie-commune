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
  return `${companyName} : quelques pistes pour aller plus loin`;
}

function fallbackOutcome(companyName: string): string {
  return `L'objectif est de faire de votre site une présence en ligne plus claire et plus crédible, à la hauteur de ${companyName}.`;
}

function fallbackCta(): string {
  return "Si vous le souhaitez, nous pouvons vous envoyer quelques pistes concrètes adaptées à votre activité, sans engagement.";
}

function fallbackIntro(agencyName?: string | null): string {
  if (agencyName?.trim()) {
    return `${agencyName.trim()} accompagne les entreprises qui veulent créer ou faire évoluer leur site pour mieux refléter leur image, leur expertise et la qualité de leur travail.`;
  }

  return "Nous accompagnons les entreprises qui veulent créer ou faire évoluer leur site pour mieux refléter leur image, leur expertise et la qualité de leur travail.";
}

function ensureOutcomePrefix(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^l['’]objectif est/i.test(trimmed)) return trimmed;
  const normalized = `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  if (/^(a|à|e|é|è|ê|i|î|o|ô|u|û|une|un)\b/i.test(normalized)) {
    return `L'objectif est d'${normalized}`;
  }
  return `L'objectif est de ${normalized}`;
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
    intro: ensureSentenceEnding(cleanSentence(buckets.intro.join(" "))) || fallbackIntro(agencyName),
    observation: ensureSentenceEnding(cleanSentence(buckets.observation.join(" "))) || `En découvrant ${companyName}, on voit un vrai potentiel, mais le site actuel pourrait mieux mettre en valeur l'activité et structurer l'offre.`,
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
