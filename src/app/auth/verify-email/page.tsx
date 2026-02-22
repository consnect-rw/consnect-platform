"use client";

import { useAuth } from "@/hooks/useAuth";
import { handleEmailVerification, verifyEmailToken } from "@/server/auth/email-verification-token";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
     const {user,refresh} = useAuth();
     const searchParams = useSearchParams();
     const token = searchParams.get("token");
     const [loading, setLoading] = useState(false);
     const router = useRouter();

     const handleVerification = async () => {
          try {
               if(!user) return; 
               setLoading(true)
               if(!token) {
                    const res = await handleEmailVerification(user.id);
                    if(res.success) {
                         return toast.success(res.message);
                    }else {
                         return toast.error(res.message);
                    }
               }
               const res = await verifyEmailToken(token);
               if(res.success) {
                    toast.success(res.message);
                    await refresh?.();
                    return router.push("/dashboard");
               }else {
                    toast.error(res.message);
               }

          } catch (error) {
               console.error("Email verification failed:", error);
               toast.error("Email verification failed. Please try again.");
          } finally {
               setLoading(false);
          }
          

     }

     useEffect(() => {
          (async() => await handleVerification())();
     }, [token])

     if(!user) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                         <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                         <p className="text-gray-600 mb-6">You need to be logged in to verify your email. Please log in and try again.</p>
                         <Link prefetch href="/auth/login" className="text-white bg-yellow-700 rounded-lg py-2 w-full flex items-center justify-center px-4  hover:underline">Log in</Link>
                    </div>
               </div>
          )
     }

     if(loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                         <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                         <p className="text-gray-600 mb-6">Processing your email verification...</p>
                    </div>
               </div>
          )
     }

     if(token) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
                         <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                         <p className="text-gray-600 mb-6">Verifying your email...</p>
                    </div>
               </div>
          )
     }

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="bg-white p-8 rounded flex flex-col gap-2 shadow-md w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                    <p className="text-gray-600 mb-6">Thank you for registering! Please check your email address {user.email} for a verification link.</p>
                    <p className="text-gray-600 text-xs">If you haven't received the email, please check your spam folder or request a new verification email.</p>
               </div>
          </div>
     )
}