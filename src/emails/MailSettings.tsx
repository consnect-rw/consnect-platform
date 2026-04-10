import { renderEmail } from "./render";
import { WelcomeEmail } from "./temps/WelcomeEmail";
import { EmailVerificationTemplate } from "./temps/EmailVerificationTemplate";
import { PasswordResetTemplate } from "./temps/PasswordResetTemplate";

export const MailSettings = {
  from: `Consnect Rwanda <no-reply@consnect.rw>`,

  templates: {
    welcome: {
      subject: "Welcome to Consnect Rwanda - Your Journey Begins Here",
      render: (props: { name: string; loginInfo?: { email: string; password: string } }) =>
        renderEmail(<WelcomeEmail {...props} />),
    },

    emailVerification: {
      subject: "Verify Your Email - Consnect Rwanda",
      render: (props: { name: string; verificationLink: string }) =>
        renderEmail(<EmailVerificationTemplate {...props} />),
    },

    passwordReset: {
      subject: "Password Reset Request - Consnect Rwanda",
      render: (props: { name: string; resetLink: string }) =>
        renderEmail(<PasswordResetTemplate {...props} />),
    },
  },
};