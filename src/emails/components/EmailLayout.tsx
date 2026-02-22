import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Img,
  Hr,
  Section,
  Link,
} from "@react-email/components";

export function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        {/* Header with Logo */}
        <Container style={headerContainer}>
          <Img
            src="https://consnect.rw/logo/consnect.png"
            alt="Consnect Rwanda"
            width="200"
            height="auto"
            style={logoStyle}
          />
        </Container>

        {/* Main Content */}
        <Container style={mainContainer}>
          {children}
        </Container>

        {/* Footer */}
        <Container style={footerContainer}>
          <Hr style={dividerStyle} />
          <Section style={footerSection}>
            <Text style={footerTitle}>Consnect Rwanda Ltd.</Text>
            <Text style={footerText}>
              Connecting Construction Professionals Across Rwanda
            </Text>
            <Text style={footerText}>
              <Link href="https://consnect.rw" style={linkStyle}>
                www.consnect.rw
              </Link>
              {" | "}
              <Link href="mailto:info@consnect.rw" style={linkStyle}>
                info@consnect.rw
              </Link>
            </Text>
            <Text style={footerText}>
              Kigali, Rwanda
            </Text>
            <Text style={copyrightStyle}>
              © {new Date().getFullYear()} Consnect Rwanda. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: "#f5f5f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const headerContainer = {
  backgroundColor: "#000000",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const logoStyle = {
  margin: "0 auto",
  display: "block",
};

const mainContainer = {
  backgroundColor: "#ffffff",
  padding: "48px 32px",
  margin: "0 auto",
  maxWidth: "600px",
};

const footerContainer = {
  backgroundColor: "#ffffff",
  padding: "32px 32px 24px",
  margin: "0 auto",
  maxWidth: "600px",
};

const dividerStyle = {
  borderColor: "#e5e5e5",
  margin: "0 0 24px 0",
};

const footerSection = {
  textAlign: "center" as const,
};

const footerTitle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#000000",
  margin: "0 0 8px 0",
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  margin: "4px 0",
  lineHeight: "1.5",
};

const linkStyle = {
  color: "#FACC15",
  textDecoration: "none",
};

const copyrightStyle = {
  fontSize: "12px",
  color: "#999999",
  margin: "16px 0 0 0",
};
