import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface InviteEmailProps {
    agencyName: string;
    inviterName: string;
    inviteLink: string;
}

export const InviteEmail = ({
    agencyName,
    inviterName,
    inviteLink,
}: InviteEmailProps) => (
    <Html>
        <Head />
        <Preview>Rejoignez {agencyName} sur Notre Plateforme</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Rejoignez l'équipe</Heading>
                <Text style={text}>
                    Bonjour,
                </Text>
                <Text style={text}>
                    <strong>{inviterName}</strong> vous a invité à rejoindre l'agence <strong>{agencyName}</strong>.
                </Text>
                <Section style={buttonContainer}>
                    <Button style={button} href={inviteLink}>
                        Accepter l'invitation
                    </Button>
                </Section>
                <Text style={text}>
                    Ce lien expirera dans 7 jours. Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
                </Text>
                <Hr style={hr} />
                <Text style={footer}>L'équipe de VotreSaaS</Text>
            </Container>
        </Body>
    </Html>
);

// Styles inline obligatoires pour les emails
const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px 0 48px", width: "580px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", margin: "40px 0" };
const text = { color: "#333", fontSize: "16px", lineHeight: "26px" };
const buttonContainer = { margin: "27px 0" };
const button = { padding: "12px 20px", backgroundColor: "#2563eb", borderRadius: "3px", color: "#fff", fontSize: "16px", textDecoration: "none", textAlign: "center" as const, display: "block" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px" };