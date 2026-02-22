import { Text, Heading, Button, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface WelcomeEmailProps {
  name: string;
  loginInfo?: {
    email: string;
    password: string;
  };
}

export const WelcomeEmail = ({ name, loginInfo }: WelcomeEmailProps) => {
  return (
    <EmailLayout>
      <Heading style={headingStyle}>
        Welcome to Consnect Rwanda!
      </Heading>
      
      <Text style={greetingStyle}>
        Hello {name},
      </Text>

      <Text style={paragraphStyle}>
        We're thrilled to have you join Rwanda's premier construction industry network. 
        Consnect connects verified construction professionals, companies, and suppliers 
        across the country, creating opportunities for growth and collaboration.
      </Text>

      {loginInfo && (
        <Section style={credentialsBox}>
          <Text style={boxTitleStyle}>Your Login Credentials</Text>
          <Text style={credentialStyle}>
            <strong>Email:</strong> {loginInfo.email}
          </Text>
          <Text style={credentialStyle}>
            <strong>Login Password:</strong> {loginInfo.password}
          </Text>
          <Text style={noteStyle}>
            ⚠️ For security reasons, please keep this information secure!
          </Text>
        </Section>
      )}

      <Text style={sectionTitleStyle}>What's Next?</Text>
      
      <Section style={listSection}>
        <Text style={listItemStyle}>
          ✓ <strong>Complete Your Profile</strong> - Add your professional details and showcase your expertise
        </Text>
        <Text style={listItemStyle}>
          ✓ <strong>Verify Your Account</strong> - Get verified to unlock premium features
        </Text>
        <Text style={listItemStyle}>
          ✓ <strong>Explore Opportunities</strong> - Browse projects, tenders, and job listings
        </Text>
        <Text style={listItemStyle}>
          ✓ <strong>Connect & Network</strong> - Build relationships with industry professionals
        </Text>
      </Section>

      <Section style={ctaSection}>
        <Button href="https://consnect.rw/dashboard" style={buttonStyle}>
          Access Your Dashboard
        </Button>
      </Section>

      <Text style={closingStyle}>
        Welcome aboard! We're excited to support your journey in Rwanda's construction industry.
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

const credentialsBox = {
  backgroundColor: "#FFFBEB",
  border: "2px solid #FACC15",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const boxTitleStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#000000",
  margin: "0 0 12px 0",
};

const credentialStyle = {
  fontSize: "14px",
  color: "#333333",
  margin: "8px 0",
  fontFamily: "monospace",
};

const noteStyle = {
  fontSize: "13px",
  color: "#D97706",
  margin: "12px 0 0 0",
  fontStyle: "italic",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#000000",
  margin: "32px 0 16px 0",
};

const listSection = {
  margin: "0 0 32px 0",
};

const listItemStyle = {
  fontSize: "15px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
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
