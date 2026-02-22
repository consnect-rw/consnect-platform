"use server";

import { MailSettings } from "@/emails/MailSettings";
import { fetchUserById } from "./user";
import { sendEmail } from "../email/email";
import { AppSettings } from "@/lib/settings/app-settings";
import { generateToken } from "@/util/token-fns";
import prisma from "@/config/prisma";

export async function handleEmailVerification(userId: string): Promise<{success: boolean, message:string}> {
     try {
          const user = await fetchUserById(userId, {
               email:true, name:true, isEmailVerified:true, 
               verificationToken:true
          });
          if(!user) return {success:false, message:"User not found"};
          if(user.isEmailVerified) return {success:true, message:"Email already verified"};
          const temp = MailSettings.templates.emailVerification;
     
          if(user.verificationToken) {
               if(user.verificationToken.isEmailSent) return {success:true, message:"Verification email already sent"};
               await sendEmail({
                    to: user.email,
                    subject: temp.subject,
                    html: await temp.render({
                         name: user.name ?? user.email,
                         verificationLink: `${AppSettings.baseURL}/auth/verify-email?token=${user.verificationToken.token}`
                    })
               });
               await prisma.emailVerificationToken.update({
                    where: {id: user.verificationToken.id},
                    data: {isEmailSent: true}
               })
               return {success:true, message:"Verification email sent"};
          }else {
               const newToken = generateToken();
               const userToken = await prisma.emailVerificationToken.create({
                    data: {
                         token: newToken,
                         user:{connect:{id: userId}},
                         expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 48) // 2 days
                    }
               })
               if(!userToken) return {success:false, message:"Error generating verification token"};
               await sendEmail({
                    to: user.email,
                    subject: temp.subject,
                    html: await temp.render({
                         name: user.name ?? user.email,
                         verificationLink: `${AppSettings.baseURL}/auth/verify-email?token=${userToken.token}`
                    })
               });
               await prisma.emailVerificationToken.update({
                    where: {id: userToken.id},
                    data: {isEmailSent: true}
               });
               return {success:true, message:"Verification email sent"};
          }
     } catch (error) {
          console.log(error);
          return {success:false, message:"Error verifying email"};
     };
}

export async function verifyEmailToken(token: string): Promise<{success: boolean, message:string}> {
     try {
          const record = await prisma.emailVerificationToken.findUnique({
               where: {token},
               include: {user:true}
          });
          if(!record) return {success:false, message:"Invalid or expired token"};
          if(record.expiresAt < new Date()) {
               await prisma.emailVerificationToken.delete({where:{id: record.id}});
               return {success:false, message:"Token has expired"};
          }
          await prisma.user.update({
               where: {id: record.userId},
               data: {isEmailVerified: true}
          });
          await prisma.emailVerificationToken.delete({where:{id: record.id}});
          return {success:true, message:"Email verified successfully"};
     } catch (error) {
          console.log(error);
          return {success:false, message:"Error verifying email"};
     }
}