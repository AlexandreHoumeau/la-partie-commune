export type PortalSectionBlock = {
  id: string;
  title: string;
  content: string;
  comment?: string;
};

export type StructuredPortalResponse = {
  version: 1;
  kind: "multi_section_text";
  sections: PortalSectionBlock[];
  generalComment?: string;
};

function isStructuredPortalResponse(value: unknown): value is StructuredPortalResponse {
  if (!value || typeof value !== "object") return false;

  const response = value as Partial<StructuredPortalResponse>;
  if (response.version !== 1 || response.kind !== "multi_section_text" || !Array.isArray(response.sections)) {
    return false;
  }

  return response.sections.every((section) => (
    section &&
    typeof section === "object" &&
    typeof section.id === "string" &&
    typeof section.title === "string" &&
    typeof section.content === "string" &&
    (section.comment === undefined || typeof section.comment === "string")
  ));
}

export function parsePortalClientResponse(raw: string | null | undefined): StructuredPortalResponse | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isStructuredPortalResponse(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildPortalResponsePreview(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const structured = parsePortalClientResponse(raw);
  if (!structured) return raw;

  const titles = structured.sections
    .map((section) => section.title.trim())
    .filter(Boolean);

  if (titles.length === 0) {
    return structured.generalComment?.trim() || "Contenu structuré envoyé";
  }

  const preview = titles.slice(0, 2).join(", ");
  const remaining = titles.length - 2;

  return remaining > 0
    ? `${titles.length} sections: ${preview} + ${remaining}`
    : `${titles.length} section${titles.length > 1 ? "s" : ""}: ${preview}`;
}

export function stringifyPortalResponse(response: StructuredPortalResponse): string {
  return JSON.stringify(response);
}

export function portalResponseToPlainText(raw: string | null | undefined): string {
  if (!raw) return "";

  const structured = parsePortalClientResponse(raw);
  if (!structured) return raw;

  const lines = structured.sections.flatMap((section, index) => {
    const output = [
      `${index + 1}. ${section.title.trim() || `Section ${index + 1}`}`,
      section.content.trim(),
    ];

    if (section.comment?.trim()) {
      output.push(`Commentaire: ${section.comment.trim()}`);
    }

    return output;
  });

  if (structured.generalComment?.trim()) {
    lines.push(`Note générale: ${structured.generalComment.trim()}`);
  }

  return lines.filter(Boolean).join("\n\n");
}
