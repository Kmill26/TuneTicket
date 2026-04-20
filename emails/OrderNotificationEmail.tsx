import type { CSSProperties } from "react";
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

export type OrderNotificationEmailProps = {
  orderId: string;
  paidAtLabel: string;
  customerName: string;
  customerEmail: string;
  occasion: string;
  recipientName: string;
  relationship: string;
  personality: string;
  story: string;
  emotion: string;
  specificLines: string;
  genre: string;
  mood: string;
  vocals: string;
  instruments: string;
  tempo: string;
  production: string;
  duration: string;
  grokPrompt: string;
  sunoPrompt: string;
  ticketUrl: string;
};

const bg = "#0a0a0a";
const surface = "#111111";
const border = "rgba(255, 255, 255, 0.1)";
const cyan = "#00f5ff";
const muted = "#a1a1aa";
const bodyText = "#e4e4e7";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={cellLabel}>{label}</td>
      <td style={cellValue}>{value || "—"}</td>
    </tr>
  );
}

export function OrderNotificationEmail(props: OrderNotificationEmailProps) {
  const preview = `New TuneTicket order ${props.orderId.slice(0, 8)} — ${props.customerEmail || "no email"}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerBand}>
            <Text style={brand}>TuneTicket · Order desk</Text>
          </Section>

          <Section style={content}>
            <Heading style={title}>New paid order</Heading>
            <Text style={meta}>
              Order ID: <span style={mono}>{props.orderId}</span>
              <br />
              Payment recorded: {props.paidAtLabel}
            </Text>

            <Text style={sectionTitle}>Customer</Text>
            <Section style={tableWrap}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <Row label="Full name" value={props.customerName} />
                  <Row label="Email" value={props.customerEmail} />
                </tbody>
              </table>
            </Section>

            <Text style={sectionTitle}>Brief — recipient &amp; story</Text>
            <Section style={tableWrap}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <Row label="Occasion" value={props.occasion} />
                  <Row label="Recipient name" value={props.recipientName} />
                  <Row label="Relationship" value={props.relationship} />
                  <Row label="Personality &amp; quirks" value={props.personality} />
                </tbody>
              </table>
            </Section>

            <Text style={blockLabel}>Story &amp; memories</Text>
            <Section style={codeBlock}>
              <Text style={codeText}>{props.story}</Text>
            </Section>

            <Text style={sectionTitle}>Creative direction</Text>
            <Section style={tableWrap}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <Row label="Emotion" value={props.emotion} />
                  <Row label="Specific lines (optional)" value={props.specificLines} />
                  <Row label="Genre" value={props.genre} />
                  <Row label="Mood" value={props.mood} />
                </tbody>
              </table>
            </Section>

            <Text style={sectionTitle}>Sound &amp; production</Text>
            <Section style={tableWrap}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <Row label="Vocals" value={props.vocals} />
                  <Row label="Instruments" value={props.instruments} />
                  <Row label="Tempo" value={props.tempo} />
                  <Row label="Production" value={props.production} />
                  <Row label="Duration" value={props.duration} />
                </tbody>
              </table>
            </Section>

            <Text style={blockLabel}>Grok lyrics prompt (full)</Text>
            <Section style={codeBlock}>
              <Text style={codeText}>{props.grokPrompt}</Text>
            </Section>

            <Text style={blockLabel}>Suno style prompt (full)</Text>
            <Section style={codeBlock}>
              <Text style={codeText}>{props.sunoPrompt}</Text>
            </Section>

            <Section style={{ textAlign: "center" as const, margin: "28px 0" }}>
              <Button href={props.ticketUrl} style={cta}>
                Open ticket in browser
              </Button>
            </Section>

            <Text style={small}>
              Direct link (for reference):{" "}
              <a href={props.ticketUrl} style={link}>
                {props.ticketUrl}
              </a>
            </Text>

            <Hr style={hr} />
            <Text style={footer}>Internal order notification · TuneTicket</Text>
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
  maxWidth: 640,
  overflow: "hidden",
};

const headerBand: CSSProperties = {
  background: "linear-gradient(90deg, rgba(0,245,255,0.12) 0%, rgba(59,130,246,0.08) 100%)",
  borderBottom: `1px solid ${border}`,
  padding: "18px 24px",
};

const brand: CSSProperties = {
  color: cyan,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.25em",
  margin: 0,
  textTransform: "uppercase" as const,
};

const content: CSSProperties = {
  padding: "28px 24px 36px",
};

const title: CSSProperties = {
  color: "#fff",
  fontSize: 22,
  fontWeight: 600,
  margin: "0 0 8px",
};

const meta: CSSProperties = {
  color: muted,
  fontSize: 13,
  lineHeight: 1.6,
  margin: "0 0 24px",
};

const mono: CSSProperties = {
  color: bodyText,
  fontFamily: "Menlo, Monaco, monospace",
  fontSize: 12,
};

const sectionTitle: CSSProperties = {
  color: cyan,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.28em",
  margin: "24px 0 10px",
  textTransform: "uppercase" as const,
};

const blockLabel: CSSProperties = {
  ...sectionTitle,
  marginTop: 28,
};

const tableWrap: CSSProperties = {
  backgroundColor: "#0c0c0c",
  border: `1px solid ${border}`,
  borderRadius: 12,
  padding: "12px 14px",
};

const cellLabel: CSSProperties = {
  color: muted,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.06em",
  padding: "8px 12px 8px 0",
  verticalAlign: "top" as const,
  width: 150,
};

const cellValue: CSSProperties = {
  color: bodyText,
  fontSize: 14,
  lineHeight: 1.55,
  padding: "8px 0",
};

const codeBlock: CSSProperties = {
  backgroundColor: "#060606",
  border: `1px solid ${border}`,
  borderLeft: `3px solid ${cyan}`,
  borderRadius: 12,
  padding: "16px 18px",
};

const codeText: CSSProperties = {
  color: bodyText,
  fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  fontSize: 12,
  lineHeight: 1.65,
  margin: 0,
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
};

const cta: CSSProperties = {
  backgroundColor: "rgba(0, 245, 255, 0.12)",
  border: `1px solid ${cyan}`,
  borderRadius: 10,
  color: cyan,
  display: "inline-block",
  fontSize: 14,
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
};

const small: CSSProperties = {
  color: "#71717a",
  fontSize: 11,
  lineHeight: 1.5,
  margin: "16px 0 0",
  wordBreak: "break-all" as const,
};

const link: CSSProperties = {
  color: cyan,
};

const hr: CSSProperties = {
  borderColor: border,
  borderStyle: "solid",
  borderWidth: "0 0 1px 0",
  margin: "28px 0 16px",
};

const footer: CSSProperties = {
  color: "#52525b",
  fontSize: 11,
  margin: 0,
};

export default OrderNotificationEmail;
