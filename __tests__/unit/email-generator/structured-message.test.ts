import { describe, expect, it } from "vitest";

import {
  buildStructuredEmailBody,
  parseStructuredEmailDraft,
} from "@/lib/email_generator/structured-message";

describe("parseStructuredEmailDraft", () => {
  it("parses the tagged response into structured fields", () => {
    const draft = parseStructuredEmailDraft(
      [
        "subject: Acme : quelques pistes pour aller plus loin",
        "intro: Nova Studio accompagne les entreprises qui veulent faire evoluer leur site pour mieux refleter leur expertise.",
        "observation: En decouvrant Acme, on voit une offre solide, mais le site actuel pourrait mieux mettre en valeur la presentation de l'offre.",
        "improvements: clarifier les pages cles | mieux hierarchiser les contenus | rendre la navigation plus directe",
        "outcome: L'objectif est de rendre le site plus clair et plus convaincant.",
        "cta: Si vous le souhaitez, nous pouvons vous partager quelques pistes concretes, sans engagement.",
      ].join("\n"),
      "Acme"
    );

    expect(draft.subject).toBe("Acme : quelques pistes pour aller plus loin");
    expect(draft.improvements).toHaveLength(3);
    expect(draft.observation).toContain("presentation de l'offre");
  });

  it("falls back when some fields are missing", () => {
    const draft = parseStructuredEmailDraft("subject: Bonjour", "Acme", "Nova Studio");

    expect(draft.subject).toBe("Bonjour");
    expect(draft.intro).toContain("Nova Studio accompagne");
    expect(draft.cta).toContain("sans engagement");
  });

  it("uses a less generic fallback subject when none is provided", () => {
    const draft = parseStructuredEmailDraft("intro: Bonjour", "Acme");

    expect(draft.subject).toBe("Acme : rendre votre site plus clair");
  });

  it("replaces an intro that mistakenly describes the prospect instead of the agency", () => {
    const draft = parseStructuredEmailDraft(
      [
        "subject: Acme : rendre votre site plus clair",
        "intro: Acme accompagne des artisans pour mettre en valeur leur expertise.",
        "observation: En decouvrant Acme, on voit une activite serieuse, mais le site pourrait mieux refleter ce professionnalisme.",
        "improvements: clarifier les services | mieux valoriser les realisations | rendre la prise de contact plus visible",
        "outcome: une presence en ligne plus claire et plus credible.",
        "cta: Si vous le souhaitez, je peux vous envoyer quelques pistes concretes, sans engagement.",
      ].join("\n"),
      "Acme",
      "Atelier Voisin"
    );

    expect(draft.intro).toBe("Atelier Voisin accompagne les entreprises qui veulent créer ou faire évoluer leur site pour mieux refléter leur image, leur expertise et la qualité de leur travail.");
  });
});

describe("buildStructuredEmailBody", () => {
  it("builds a deterministic email body from structured parts", () => {
    const body = buildStructuredEmailBody(
      {
        subject: "Acme : quelques pistes pour aller plus loin",
        intro: "Nova Studio accompagne les entreprises qui veulent faire evoluer leur site avec plus de clarte et de credibilite.",
        observation: "En decouvrant Acme, on voit un vrai potentiel, mais l'offre pourrait etre presentee plus clairement.",
        improvements: ["clarifier les pages cles.", "mieux hierarchiser les contenus.", "renforcer la lisibilite mobile."],
        outcome: "L'objectif est de rendre le site plus clair et plus convaincant.",
        cta: "Si vous le souhaitez, nous pouvons vous partager quelques pistes concretes, sans engagement.",
      },
      "https://wiply.app/t/abc123",
      "Nova Studio"
    );

    expect(body).toContain("Bonjour,");
    expect(body).toContain("J'espère que vous allez bien.");
    expect(body).toContain("Il y aurait un vrai potentiel pour :");
    expect(body).toContain("- clarifier les pages cles.");
    expect(body).toContain("Vous pouvez consulter un exemple ou quelques pistes ici :");
    expect(body).toContain("À bientôt,\n\nNova Studio");
    expect(body).toContain("https://wiply.app/t/abc123");
  });

  it("normalizes the outcome so it starts with the expected prefix", () => {
    const draft = parseStructuredEmailDraft(
      [
        "subject: Acme : quelques pistes pour aller plus loin",
        "intro: Nova Studio accompagne les entreprises qui veulent faire evoluer leur site.",
        "observation: En decouvrant Acme, on voit un vrai potentiel, mais le site pourrait mieux structurer l'offre.",
        "improvements: clarifier les pages cles | mieux hierarchiser les contenus",
        "outcome: une vitrine plus claire et plus engageante, a la hauteur de votre expertise.",
        "cta: Si vous le souhaitez, nous pouvons vous envoyer quelques pistes concretes, sans engagement.",
      ].join("\n"),
      "Acme"
    );

    expect(draft.outcome).toBe("L'objectif est d'avoir une vitrine plus claire et plus engageante, a la hauteur de votre expertise.");
  });
});
