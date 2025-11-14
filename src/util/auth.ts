/* eslint-disable @typescript-eslint/no-unused-vars */
import { EUserRole } from "@/types/auth/user";
import { signIn, signOut } from "next-auth/react";



export function getRedirectPath(role: EUserRole): string {
     switch(role){
          case EUserRole.ADMIN:
               return "/admin";
          case EUserRole.USER:
               return "/dashboard";
          default: 
               return "/home";
     }
}

export async function CredentialsSignin(formData: FormData) {
     try {
          const credentials = Object.fromEntries(formData.entries());
          const result = await signIn("credentials", {redirect:false,...credentials});
          return result;
     } catch (error) {
          // console.log(error);
          return null;
     }
}

export async function logoutUser() {
     return await signOut();
}

export function generateStrongPassword(length: number = 16): string {
     const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     const lowercase = 'abcdefghijklmnopqrstuvwxyz';
     const numbers = '0123456789';
     const symbols = '!@#$%^&*-_=+';
     
     const allChars = uppercase + lowercase + numbers + symbols;
     
     // Ensure at least one of each type
     let password = [
     uppercase[Math.floor(Math.random() * uppercase.length)],
     lowercase[Math.floor(Math.random() * lowercase.length)],
     numbers[Math.floor(Math.random() * numbers.length)],
     symbols[Math.floor(Math.random() * symbols.length)],
     ].join('');
     
     // Fill the rest
     for (let i = password.length; i < length; i++) {
     password += allChars[Math.floor(Math.random() * allChars.length)];
     }
     
     // Shuffle
     return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function isValidEmail(email: string): boolean {
     if (!email || typeof email !== 'string') return false;
     
     // Trim and lowercase
     email = email.trim().toLowerCase();
     
     // Basic regex pattern for email validation
     const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
     
     return emailRegex.test(email);
}