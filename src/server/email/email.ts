"use server";

import { emailTransporter } from "@/config/email";



export async function sendEmail({
     to,
     subject,
     html,
     text,
}: {
     to: string;
     subject: string;
     html: string;
     text?: string;
}) {
     try {
          
          await  emailTransporter.sendMail({
               from: `"Consnect Rwanda" <noreply@consnect.rw>`,
               to,
               subject,
               text,
               html,
          });
     } catch (error) {
          console.log(error);
     }
     
}