export type PortalChecklistDescription = {
  version: 1;
  kind: "content_request";
  description?: string;
  suggestedSections?: string[];
};

function isPortalChecklistDescription(value: unknown): value is PortalChecklistDescription {
  if (!value || typeof value !== "object") return false;

  const parsed = value as Partial<PortalChecklistDescription>;
  return parsed.version === 1 &&
    parsed.kind === "content_request" &&
    (parsed.description === undefined || typeof parsed.description === "string") &&
    (parsed.suggestedSections === undefined ||
      (Array.isArray(parsed.suggestedSections) && parsed.suggestedSections.every((item) => typeof item === "string")));
}

export function parseChecklistDescription(raw: string | null | undefined): PortalChecklistDescription | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isPortalChecklistDescription(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildChecklistDescription(input: {
  description?: string | null;
  suggestedSections?: string[];
}): string | null {
  const description = input.description?.trim() || "";
  const suggestedSections = (input.suggestedSections ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (suggestedSections.length === 0) {
    return description || null;
  }

  return JSON.stringify({
    version: 1,
    kind: "content_request",
    description: description || undefined,
    suggestedSections,
  } satisfies PortalChecklistDescription);
}

export function getChecklistDisplayDescription(raw: string | null | undefined): string | null {
  const parsed = parseChecklistDescription(raw);
  if (!parsed) return raw ?? null;
  return parsed.description ?? null;
}

export function getChecklistSuggestedSections(raw: string | null | undefined): string[] {
  const parsed = parseChecklistDescription(raw);
  if (!parsed?.suggestedSections?.length) return [];
  return parsed.suggestedSections.map((item) => item.trim()).filter(Boolean);
}
