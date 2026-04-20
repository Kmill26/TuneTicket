import type { CSSProperties } from "react";
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export type CustomerThankYouEmailProps = {
  greetingName: string;
};

const bg = "#0a0a0a";
const surface = "#111111";
const border = "rgba(255, 255, 255, 0.1)";
const cyan = "#00f5ff";
const muted = "#a1a1aa";

export function CustomerThankYouEmail({ greetingName }: CustomerThankYouEmailProps) {
  const name = greetingName?.trim() || "there";

  return (
    <Html>
      <Head />
      <Preview>Thank you — your TuneTicket request is in production.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerBand}>
            <Text style={brand}>TuneTicket</Text>
          </Section>
          <Section style={content}>
            <Heading style={title}>Thank you!</Heading>
            <Text style={body}>
              Hi {name},
            </Text>
            <Text style={body}>
              Your custom song request has been received. You&apos;ll receive your personalized song within{" "}
              <strong style={{ color: "#fff" }}>24–48 hours</strong>.
            </Text>
            <Text style={bodyMuted}>
              We&apos;ll email you if we need anything else. Thank you for trusting TuneTicket with your story.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: CSSProperties = {
  backgroundColor: bg,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: "40px 16px",
};

const container: CSSProperties = {
  backgroundColor: surface,
  border: `1px solid ${border}`,
  borderRadius: 18,
  margin: "0 auto",
  maxWidth: 480,
};

const headerBand: CSSProperties = {
  borderBottom: `1px solid ${border}`,
  padding: "20px 24px",
};

const brand: CSSProperties = {
  color: cyan,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.35em",
  margin: 0,
  textTransform: "uppercase" as const,
};

const content: CSSProperties = {
  padding: "32px 28px 40px",
};

const title: CSSProperties = {
  color: "#ffffff",
  fontSize: 24,
  fontWeight: 600,
  margin: "0 0 20px",
};

const body: CSSProperties = {
  color: "#e4e4e7",
  fontSize: 16,
  lineHeight: 1.65,
  margin: "0 0 16px",
};

const bodyMuted: CSSProperties = {
  color: muted,
  fontSize: 14,
  lineHeight: 1.6,
  margin: "24px 0 0",
};

export default CustomerThankYouEmail;
