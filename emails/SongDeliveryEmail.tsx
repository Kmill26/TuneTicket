import type { CSSProperties } from "react";
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components";

export type SongDeliveryEmailProps = {
  greetingName: string;
  downloadUrl: string;
  fileLabel: string;
};

const bg = "#0a0a0a";
const surface = "#111111";
const border = "rgba(255, 255, 255, 0.1)";
const cyan = "#00f5ff";
const muted = "#a1a1aa";

export function SongDeliveryEmail({ greetingName, downloadUrl, fileLabel }: SongDeliveryEmailProps) {
  const name = greetingName?.trim() || "there";

  return (
    <Html>
      <Head />
      <Preview>Your TuneTicket song is ready to download.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerBand}>
            <Text style={brand}>TuneTicket</Text>
          </Section>
          <Section style={content}>
            <Heading style={title}>Your song is ready</Heading>
            <Text style={body}>Hi {name},</Text>
            <Text style={body}>
              Thank you for choosing TuneTicket. Your custom song has been finished and is ready for you. We hope it
              captures everything you imagined for this moment.
            </Text>
            <Text style={bodyMuted}>
              File: <span style={{ color: "#e4e4e7" }}>{fileLabel}</span>
            </Text>
            <Section style={{ textAlign: "center" as const, marginTop: 28, marginBottom: 8 }}>
              <Button href={downloadUrl} style={btn}>
                Download your song
              </Button>
            </Section>
            <Text style={finePrint}>
              This link is private to you. If it stops working, reply to this email and we&apos;ll help you out.
            </Text>
            <Text style={bodyMuted}>
              With appreciation,
              <br />
              The TuneTicket team
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
  letterSpacing: "-0.02em",
  margin: "0 0 16px",
};

const body: CSSProperties = {
  color: "#e4e4e7",
  fontSize: 15,
  lineHeight: 1.65,
  margin: "0 0 16px",
};

const bodyMuted: CSSProperties = {
  ...body,
  color: muted,
  fontSize: 14,
};

const btn: CSSProperties = {
  backgroundColor: "#0a0a0a",
  border: `1px solid ${cyan}`,
  borderRadius: 12,
  color: cyan,
  display: "inline-block",
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: "0.08em",
  padding: "14px 28px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const finePrint: CSSProperties = {
  color: "#71717a",
  fontSize: 12,
  lineHeight: 1.55,
  margin: "24px 0 0",
};
