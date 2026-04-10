import { describe, expect, it } from "vitest";

import {
  buildFallbackSubject,
  evaluateMessageQuality,
  extractMessageParts,
} from "@/lib/email_generator/message-quality";

describe("buildFallbackSubject", () => {
  it("builds a contextual subject from status and company name", () => {
    expect(buildFallbackSubject("proposal_sent", "Acme")).toBe("Suite a la proposition avec Acme");
  });
});

describe("extractMessageParts", () => {
  it("extracts and cleans email subject/body", () => {
    const result = extractMessageParts({
      rawText: "Objet : \"Suite a votre demande\"\n\nBonjour Acme,\n\nVoici un message.",
      channel: "email",
      status: "inbound",
      companyName: "Acme",
    });

    expect(result.subject).toBe("Suite a votre demande");
    expect(result.body).toBe("Bonjour Acme,\n\nVoici un message.");
  });

  it("generates a fallback subject when the model starts directly with a greeting", () => {
    const result = extractMessageParts({
      rawText: "Bonjour Acme,\n\nPouvons-nous en parler cette semaine ?",
      channel: "email",
      status: "first_contact",
      companyName: "Acme",
    });

    expect(result.subject).toBe("Suite a mon precedent message avec Acme");
    expect(result.body).toBe("Bonjour Acme,\n\nPouvons-nous en parler cette semaine ?");
  });

  it("returns subjectless text for non-email channels", () => {
    const result = extractMessageParts({
      rawText: "Bonjour Acme,\nOn peut se parler demain ?",
      channel: "linkedin",
      status: "first_contact",
      companyName: "Acme",
    });

    expect(result.subject).toBeNull();
    expect(result.body).toContain("Bonjour Acme");
  });
});

describe("evaluateMessageQuality", () => {
  it("flags a generic opening and missing CTA", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Bonjour",
      body: "J'espere que vous allez bien.\n\nNous aidons les entreprises a se developper.",
      companyName: "Acme",
      trackingLinkUrl: null,
    });

    expect(issues).toContain("L'accroche est trop generique. Elle doit commencer par une observation plus specifique.");
    expect(issues).toContain("Le message doit se terminer par un appel a l'action clair.");
    expect(issues).toContain("Le nom de l'entreprise doit apparaitre dans le message pour renforcer la personnalisation.");
  });

  it("flags an email that has too few concrete improvement bullets and no light close", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Acme : quelques pistes pour aller plus loin",
      body: "Bonjour,\n\nJ'espère que vous allez bien.\n\nEn découvrant Acme, on voit une offre claire, mais le site pourrait gagner en impact.\n\nIl y aurait un vrai potentiel pour :\n- moderniser l'interface\n- optimiser le mobile\n\nL'objectif est de rendre le site plus engageant.\n\nJe peux vous envoyer quelques pistes si cela vous intéresse.",
      companyName: "Acme",
      trackingLinkUrl: null,
    });

    expect(issues).toContain("L'email manque de matiere concrete. Il faut au moins 3 axes d'amelioration credibles.");
    expect(issues).toContain("La fin doit rester legere et peu engageante, idealement avec une formule du type « sans engagement ».");
  });

  it("flags a generic email subject", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Site web pour Acme",
      body: "Bonjour Acme,\n\nJ'ai repere un axe simple pour clarifier votre offre.\n\nSi cela vous parle, pouvons-nous en discuter ?",
      companyName: "Acme",
      trackingLinkUrl: null,
    });

    expect(issues).toContain("L'objet est trop generique. Il faut une formule plus concrete et plus engageante.");
  });

  it("flags a CTA that sounds too scripted", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Clarifier l'offre de Acme",
      body: "Bonjour Acme,\n\nJ'ai repere un axe simple pour clarifier votre offre.\n\nSi le sujet vous interesse, je vous propose d'en parler 10 minutes par telephone — quand seriez-vous disponible cette semaine ?",
      companyName: "Acme",
      trackingLinkUrl: null,
    });

    expect(issues).toContain("Le CTA est trop commercial ou trop scripté. Il faut une fin plus simple, plus naturelle et moins pressante.");
  });

  it("flags decorative agency language and speculative claims", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Site web pour Acme",
      body: "Votre boutique Acme a tout pour plaire avec des avis clients tres positifs. Imaginez une vitrine digitale avec des visuels percutants, un configurateur et un systeme de reservation en ligne.\n\nQuand seriez-vous disponible pour en discuter ?",
      companyName: "Acme",
      companyWebsite: null,
      trackingLinkUrl: null,
    });

    expect(issues).toContain("Le texte sonne trop marketing ou decoratif. Il faut un style plus simple, plus direct et plus sobre.");
    expect(issues).toContain("Le message contient des preuves ou resultats non verifies. Supprime toute affirmation non presente dans le contexte.");
    expect(issues).toContain("Le message propose des fonctionnalites trop speculatives. Reste sur une valeur generale sans imaginer des features precises.");
  });

  it("accepts a message with personalization, CTA, and tracking link", () => {
    const issues = evaluateMessageQuality({
      channel: "email",
      subject: "Acme : quelques pistes pour aller plus loin",
      body: "Bonjour,\n\nJ'espère que vous allez bien.\n\nNova Studio accompagne les entreprises qui veulent faire évoluer leur site pour mieux refléter leur expertise.\n\nEn découvrant Acme, on voit une offre claire dans le conseil RH, mais le site pourrait mieux hiérarchiser l'offre et fluidifier le parcours.\n\nIl y aurait un vrai potentiel pour :\n- clarifier les pages clés.\n- mieux hiérarchiser les contenus.\n- rendre la prise de contact plus visible.\n\nL'objectif est de faire de votre site une vitrine plus claire et plus crédible.\n\nSi vous le souhaitez, nous pouvons vous envoyer quelques pistes concrètes adaptées à Acme, sans engagement.\n\nVous pouvez consulter un exemple ou quelques pistes ici :\nhttps://wiply.app/t/abc123",
      companyName: "Acme",
      companyWebsite: "https://acme.fr",
      trackingLinkUrl: "https://wiply.app/t/abc123",
    });

    expect(issues).toEqual([]);
  });
});
