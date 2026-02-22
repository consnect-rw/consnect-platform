import { Text, Heading, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface PasswordResetTemplateProps {
  name: string;
  otp: string;
}

export const PasswordResetTemplate = ({ name, otp }: PasswordResetTemplateProps) => {
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
        Use the verification code below to complete the password reset process.
      </Text>

      <Section style={otpSection}>
        <Text style={otpLabelStyle}>Your Verification Code:</Text>
        <Text style={otpCodeStyle}>
          {otp}
        </Text>
        <Text style={otpValidityStyle}>
          ⏱️ This code is valid for <strong>15 minutes</strong>
        </Text>
      </Section>

      <Text style={instructionTitleStyle}>How to reset your password:</Text>
      
      <Section style={stepSection}>
        <Text style={stepStyle}>
          <strong>1.</strong> Return to the password reset page on Consnect
        </Text>
        <Text style={stepStyle}>
          <strong>2.</strong> Enter the verification code shown above
        </Text>
        <Text style={stepStyle}>
          <strong>3.</strong> Create a new strong password
        </Text>
        <Text style={stepStyle}>
          <strong>4.</strong> Confirm your new password and save changes
        </Text>
      </Section>

      <Section style={securityBox}>
        <Text style={securityTitleStyle}>🔐 Security Reminder</Text>
        <Text style={securityTextStyle}>
          <strong>Create a strong password with:</strong>
        </Text>
        <Text style={securityListStyle}>
          • At least 8 characters<br />
          • A mix of uppercase and lowercase letters<br />
          • Numbers and special characters<br />
          • Avoid common words or personal information
        </Text>
      </Section>

      <Section style={warningBox}>
        <Text style={warningTitleStyle}>⚠️ Didn't request this?</Text>
        <Text style={warningTextStyle}>
          If you didn't request a password reset, please ignore this email and ensure 
          your account is secure. Your password will remain unchanged. If you're concerned 
          about unauthorized access, please contact our support team immediately.
        </Text>
      </Section>

      <Text style={closingStyle}>
        For security reasons, never share your verification code with anyone, including 
        Consnect staff. We will never ask for your password or verification code.
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

const otpSection = {
  backgroundColor: "#000000",
  borderRadius: "12px",
  padding: "32px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const otpLabelStyle = {
  fontSize: "14px",
  color: "#FACC15",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 16px 0",
};

const otpCodeStyle = {
  fontSize: "48px",
  fontWeight: "700",
  color: "#FFFFFF",
  letterSpacing: "8px",
  margin: "0 0 16px 0",
  fontFamily: "monospace",
};

const otpValidityStyle = {
  fontSize: "14px",
  color: "#FACC15",
  margin: "0",
};

const instructionTitleStyle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#000000",
  margin: "32px 0 16px 0",
};

const stepSection = {
  margin: "0 0 32px 0",
  paddingLeft: "8px",
};

const stepStyle = {
  fontSize: "15px",
  color: "#333333",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};

const securityBox = {
  backgroundColor: "#F0F9FF",
  border: "2px solid #BFDBFE",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const securityTitleStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#1E40AF",
  margin: "0 0 12px 0",
};

const securityTextStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1E3A8A",
  margin: "0 0 8px 0",
};

const securityListStyle = {
  fontSize: "14px",
  color: "#1E3A8A",
  lineHeight: "1.8",
  margin: "0",
};

const warningBox = {
  backgroundColor: "#FEE2E2",
  border: "2px solid #FCA5A5",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const warningTitleStyle = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#991B1B",
  margin: "0 0 8px 0",
};

const warningTextStyle = {
  fontSize: "14px",
  color: "#7F1D1D",
  lineHeight: "1.6",
  margin: "0",
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
