import { Text, Heading, Button, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface EmailVerificationProps {
  name: string;
  verificationLink: string;
}

export const EmailVerificationTemplate = ({ name, verificationLink }: EmailVerificationProps) => {
  return (
    <EmailLayout>
      <Heading style={headingStyle}>
        Verify Your Email Address
      </Heading>
      
      <Text style={greetingStyle}>
        Hello {name},
      </Text>

      <Text style={paragraphStyle}>
        Thank you for creating an account with Consnect Rwanda. To ensure the security 
        of your account and unlock all platform features, please verify your email address.
      </Text>

      <Section style={highlightBox}>
        <Text style={highlightTextStyle}>
          Email verification helps us maintain a trusted community of construction 
          professionals and protects your account from unauthorized access.
        </Text>
      </Section>

      <Text style={instructionStyle}>
        Click the button below to verify your email address:
      </Text>

      <Section style={ctaSection}>
        <Button href={verificationLink} style={buttonStyle}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={alternativeStyle}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={linkTextStyle}>
        {verificationLink}
      </Text>

      <Section style={warningBox}>
        <Text style={warningTitleStyle}>Important:</Text>
        <Text style={warningTextStyle}>
          This verification link will expire in <strong>24 hours</strong>. 
          If you didn&apos;t create an account with Consnect, please ignore this email.
        </Text>
      </Section>

      <Text style={closingStyle}>
        Once verified, you'll have full access to connect with construction professionals, 
        explore opportunities, and grow your network.
      </Text>

      <Text style={signatureStyle}>
        Best regards,<br />
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

const highlightBox = {
  backgroundColor: "#F9FAFB",
  border: "2px solid #E5E7EB",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const highlightTextStyle = {
  fontSize: "15px",
  color: "#4B5563",
  lineHeight: "1.6",
  margin: "0",
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

const closingStyle = {
  fontSize: "16px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "24px 0",
};

const signatureStyle = {
  fontSize: "15px",
  color: "#666666",
  margin: "24px 0 0 0",
  lineHeight: "1.5",
};
