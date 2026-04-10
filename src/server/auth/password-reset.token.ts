"use server";

import prisma from "@/config/prisma";
import { generateToken } from "@/util/token-fns";
import { MailSettings } from "@/emails/MailSettings";
import { sendEmail } from "@/server/email/email";
import { AppSettings } from "@/lib/settings/app-settings";

export async function createPasswordResetToken(email: string): Promise<{status: boolean, message:string}>
{
     try {
          const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } });
          if (!user) {
               return { status: false, message: "No account found with that email address" };
          }

          // Check if user already has a valid (non-expired) token
          const existingToken = await prisma.passwordResetToken.findFirst({
               where: {
                    userId: user.id,
                    expiresAt: { gt: new Date() },
               },
          });

          const resetLink = existingToken
               ? `${AppSettings.baseURL}/auth/forgot-password?token=${existingToken.token}`
               : null;

          if (existingToken && resetLink) {
               // Resend email with existing valid token
               const temp = MailSettings.templates.passwordReset;
               await sendEmail({
                    to: user.email,
                    subject: temp.subject,
                    html: await temp.render({
                         name: user.name ?? user.email,
                         resetLink,
                    }),
               });
               return { status: true, message: "A password reset link has been sent to your email" };
          }

          // Create new token
          const expiresAt = new Date(Date.now() + 3600000); // 1 hour
          const token = generateToken();
          const resetToken = await prisma.passwordResetToken.create({
               data: {
                    token,
                    expiresAt,
                    userId: user.id,
               },
          });
          if (!resetToken) {
               return { status: false, message: "Failed to create password reset token" };
          }

          // Send email
          const newResetLink = `${AppSettings.baseURL}/auth/forgot-password?token=${resetToken.token}`;
          const temp = MailSettings.templates.passwordReset;
          await sendEmail({
               to: user.email,
               subject: temp.subject,
               html: await temp.render({
                    name: user.name ?? user.email,
                    resetLink: newResetLink,
               }),
          });

          return { status: true, message: "A password reset link has been sent to your email" };
     } catch (error:any) {
          console.error("Error creating password reset token:", error);
          return { status: false, message: error.message || "Error creating password reset token" };
     }
     
}

export async function validatePasswordResetToken(token: string): Promise<{status: boolean, userId?: string, message:string}> {
     try {
          const resetToken = await prisma.passwordResetToken.findUnique({
               where: {token},
               include: {user: {select: {id:true}}}
          });
          if (!resetToken) {
               return { status: false, message: "Invalid password reset token" };
          }
          if (resetToken.expiresAt < new Date()) {
               return { status: false, message: "Password reset token has expired" };
          }
          return { status: true, userId: resetToken.userId, message: "Password reset token is valid" };    
     } catch (error:any) {
          console.error("Error validating password reset token:", error);
          return { status: false, message: error.message || "Error validating password reset token" };
     }
}

export async function deletePasswordResetToken(token: string): Promise<{status: boolean, message:string}> {
     try {
          await prisma.passwordResetToken.delete({ where: { token } });
          return { status: true, message: "Token deleted successfully" };
     } catch (error:any) {
          console.error("Error deleting password reset token:", error);
          return { status: false, message: error.message || "Error deleting password reset token" };
     }
}