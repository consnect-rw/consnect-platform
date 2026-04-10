import { Text, Heading, Button, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface PasswordResetTemplateProps {
  name: string;
  resetLink: string;
}

export const PasswordResetTemplate = ({ name, resetLink }: PasswordResetTemplateProps) => {
  return (
    <EmailLayout>
      <Heading style={headingStyle}>
        Password Reset Request
      </Heading>
      
      <Text style={greetingStyle}>
        Hello {name},
      </Text>

      <Text style={paragraphStyle}>
        We received a request to reset the password for your Consnect Rwanda account. 
        Click the button below to set a new password.
      </Text>

      <Text style={instructionStyle}>
        Click the button below to reset your password:
      </Text>

      <Section style={ctaSection}>
        <Button href={resetLink} style={buttonStyle}>
          Reset Your Password
        </Button>
      </Section>

      <Text style={alternativeStyle}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={linkTextStyle}>
        {resetLink}
      </Text>

      <Section style={warningBox}>
        <Text style={warningTitleStyle}>Important:</Text>
        <Text style={warningTextStyle}>
          This link will expire in <strong>1 hour</strong>. 
          If you didn&apos;t request a password reset, please ignore this email. 
          Your password will remain unchanged.
        </Text>
      </Section>

      <Text style={sectionTitleStyle}>Security Tips</Text>
      
      <Section style={listSection}>
        <Text style={listItemStyle}>
          ✓ <strong>Strong Password</strong> - Use at least 8 characters with a mix of uppercase, lowercase, numbers and symbols
        </Text>
        <Text style={listItemStyle}>
          ✓ <strong>Unique Password</strong> - Avoid reusing passwords from other accounts
        </Text>
        <Text style={listItemStyle}>
          ✓ <strong>Keep It Private</strong> - Never share your password with anyone, including Consnect staff
        </Text>
      </Section>

      <Text style={closingStyle}>
        If you&apos;re concerned about unauthorized access, please contact our support team immediately.
      </Text>

      <Text style={signatureStyle}>
        Stay secure,<br />
        <strong>The Consnect Team</strong>
      </Text>
    </EmailLayout>
  );
};

// Styles
const headingStyle = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#000000",
  margin: "0 0 24px 0",
  lineHeight: "1.2",
};

const greetingStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#000000",
  margin: "0 0 16px 0",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const instructionStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#000000",
  margin: "32px 0 24px 0",
  textAlign: "center" as const,
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#FACC15",
  color: "#000000",
  fontSize: "16px",
  fontWeight: "700",
  padding: "16px 48px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
  border: "none",
};

const alternativeStyle = {
  fontSize: "14px",
  color: "#666666",
  textAlign: "center" as const,
  margin: "24px 0 8px 0",
};

const linkTextStyle = {
  fontSize: "13px",
  color: "#FACC15",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
  wordBreak: "break-all" as const,
  fontFamily: "monospace",
};

const warningBox = {
  backgroundColor: "#FEF3C7",
  border: "2px solid #FCD34D",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const warningTitleStyle = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#92400E",
  margin: "0 0 8px 0",
};

const warningTextStyle = {
  fontSize: "14px",
  color: "#78350F",
  lineHeight: "1.6",
  margin: "0",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#000000",
  margin: "32px 0 16px 0",
};

const listSection = {
  margin: "0 0 32px 0",
  paddingLeft: "8px",
};

const listItemStyle = {
  fontSize: "15px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const closingStyle = {
  fontSize: "15px",
  color: "#666666",
  lineHeight: "1.6",
  margin: "24px 0",
  fontStyle: "italic",
};

const signatureStyle = {
  fontSize: "15px",
  color: "#666666",
  margin: "24px 0 0 0",
  lineHeight: "1.5",
};
