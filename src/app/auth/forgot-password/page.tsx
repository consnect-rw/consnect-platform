"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPasswordResetToken, validatePasswordResetToken, deletePasswordResetToken } from "@/server/auth/password-reset.token";
import { updateUser } from "@/server/auth/user";
import { PasswordInputGroup, TextInputGroup } from "@/components/forms/InputGroups";
import { MainForm } from "@/components/forms/MainForm";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, Send, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { CurrentYear } from "@/components/layout/CurrentYear";

export default function ForgotPasswordPage() {
     const searchParams = useSearchParams();
     const router = useRouter();
     const token = searchParams.get("token");

     const [step, setStep] = useState<"request" | "validating" | "reset" | "invalid" | "success">(
          token ? "validating" : "request"
     );
     const [userId, setUserId] = useState<string | null>(null);
     const [errorMessage, setErrorMessage] = useState("");
     const [emailSent, setEmailSent] = useState(false);

     // Validate token on mount if present
     useEffect(() => {
          if (!token) return;
          (async () => {
               const res = await validatePasswordResetToken(token);
               if (res.status && res.userId) {
                    setUserId(res.userId);
                    setStep("reset");
               } else {
                    setErrorMessage(res.message);
                    setStep("invalid");
               }
          })();
     }, [token]);

     // Step 1: Request reset link
     const handleRequestReset = async (data: FormData) => {
          const email = data.get("email") as string;
          if (!email) return toast.warning("Please enter your email address");

          const res = await createPasswordResetToken(email);
          if (res.status) {
               setEmailSent(true);
               toast.success(res.message);
          } else {
               toast.error(res.message);
          }
     };

     // Step 3: Reset password
     const handleResetPassword = async (data: FormData) => {
          const password = data.get("password") as string;
          const confirmPassword = data.get("confirm-password") as string;

          if (!password || !confirmPassword) return toast.warning("Please fill in all fields");
          if (password.length < 8) return toast.warning("Password must be at least 8 characters");
          if (password !== confirmPassword) return toast.warning("Passwords do not match");
          if (!userId || !token) return toast.error("Invalid session. Please request a new reset link.");

          const res = await updateUser(userId, { password });
          if (!res) return toast.error("Failed to reset password. Please try again.");

          // Delete the used token
          await deletePasswordResetToken(token);
          setStep("success");
          toast.success("Password reset successfully!");
          setTimeout(() => router.push("/auth/login"), 2500);
     };

     return (
          <div className="min-h-screen w-full bg-linear-to-br from-gray-100 via-slate-100 to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
               {/* Background blobs */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
               </div>

               <div className="relative w-full max-w-6xl">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
                         <div className="grid lg:grid-cols-2 gap-0">

                              {/* Left Section - Form */}
                              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                                   {/* Brand Badge */}
                                   <div className="mb-6 lg:mb-8 flex flex-col gap-2 items-start">
                                        <Link href="/auth/login" prefetch className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-gray-700 hover:text-yellow-600 text-sm">
                                             <ArrowLeft className="w-4 h-4" /> Back To Login
                                        </Link>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-amber-100 to-orange-100 rounded-full">
                                             <Sparkles className="w-4 h-4 text-amber-600" />
                                             <span className="text-sm font-semibold text-amber-700">CONSNECT</span>
                                        </div>
                                   </div>

                                   {/* Request Step */}
                                   {step === "request" && !emailSent && (
                                        <>
                                             <div className="mb-8">
                                                  <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                                                       <span className="bg-linear-to-r from-gray-600 to-yellow-600 bg-clip-text text-transparent">
                                                            Forgot Password?
                                                       </span>
                                                  </h1>
                                                  <p className="text-gray-600 text-base sm:text-lg">
                                                       Enter your email address and we&apos;ll send you a link to reset your password.
                                                  </p>
                                             </div>
                                             <MainForm submitData={handleRequestReset} btnTitle="Send Reset Link" btnIcon={<Send className="w-4 h-4" />}>
                                                  <TextInputGroup name="email" label="Email Address" type="email" required placeholder="ex: david@gmail.com" />
                                             </MainForm>
                                        </>
                                   )}

                                   {/* Email Sent Confirmation */}
                                   {step === "request" && emailSent && (
                                        <div className="text-center py-6">
                                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                                  <Mail className="w-8 h-8 text-green-600" />
                                             </div>
                                             <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
                                             <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                                  We&apos;ve sent a password reset link to your email. Click the link to set a new password.
                                             </p>
                                             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                                                  <p className="text-sm text-amber-800 font-medium mb-1">Didn&apos;t receive the email?</p>
                                                  <p className="text-sm text-amber-700">Check your spam folder or <button onClick={() => setEmailSent(false)} className="font-semibold text-amber-600 underline underline-offset-2 cursor-pointer">try again</button>.</p>
                                             </div>
                                        </div>
                                   )}

                                   {/* Validating Token */}
                                   {step === "validating" && (
                                        <div className="text-center py-12">
                                             <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                                             <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your link...</h2>
                                             <p className="text-gray-500">Please wait while we validate your reset token.</p>
                                        </div>
                                   )}

                                   {/* Invalid Token */}
                                   {step === "invalid" && (
                                        <div className="text-center py-6">
                                             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                                  <ShieldCheck className="w-8 h-8 text-red-500" />
                                             </div>
                                             <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid or Expired Link</h2>
                                             <p className="text-gray-600 mb-2">{errorMessage}</p>
                                             <p className="text-gray-500 text-sm mb-6">Please request a new password reset link.</p>
                                             <button
                                                  onClick={() => { setStep("request"); setEmailSent(false); router.replace("/auth/forgot-password"); }}
                                                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                                             >
                                                  <Mail className="w-4 h-4" />
                                                  Request New Link
                                             </button>
                                        </div>
                                   )}

                                   {/* Reset Password Form */}
                                   {step === "reset" && (
                                        <>
                                             <div className="mb-8">
                                                  <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                                                       <span className="bg-linear-to-r from-gray-600 to-yellow-600 bg-clip-text text-transparent">
                                                            Set New Password
                                                       </span>
                                                  </h1>
                                                  <p className="text-gray-600 text-base sm:text-lg">
                                                       Create a strong password for your account.
                                                  </p>
                                             </div>
                                             <MainForm submitData={handleResetPassword} btnTitle="Reset Password" btnIcon={<KeyRound className="w-4 h-4" />}>
                                                  <PasswordInputGroup type="password" name="password" label="New Password" placeholder="Enter new password" required />
                                                  <PasswordInputGroup type="password" name="confirm-password" label="Confirm Password" placeholder="Confirm new password" required />
                                             </MainForm>
                                             <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                  <p className="text-xs text-gray-500 font-medium mb-2">Password requirements:</p>
                                                  <ul className="text-xs text-gray-500 space-y-1">
                                                       <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-500" />At least 8 characters</li>
                                                       <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-500" />Mix of uppercase &amp; lowercase</li>
                                                       <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-500" />Include numbers &amp; symbols</li>
                                                  </ul>
                                             </div>
                                        </>
                                   )}

                                   {/* Success */}
                                   {step === "success" && (
                                        <div className="text-center py-6">
                                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                                             </div>
                                             <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Reset Successful</h2>
                                             <p className="text-gray-600 mb-6">
                                                  Your password has been updated. Redirecting you to the login page...
                                             </p>
                                             <Loader2 className="w-5 h-5 text-amber-500 animate-spin mx-auto" />
                                        </div>
                                   )}

                                   {/* Mobile trust indicators */}
                                   <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
                                        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                             <div className="flex items-center gap-1">
                                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                  <span>Secure</span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                  <span>Trusted</span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                  <span>Fast</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Right Section - Branding */}
                              <div className="hidden lg:flex relative bg-linear-to-br from-black via-yellow-950 to-black p-12 flex-col justify-between overflow-hidden">
                                   <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                   </div>

                                   <div className="relative z-10">
                                        <h2 className="text-white text-4xl font-bold mb-4">
                                             Secure Your Account
                                        </h2>
                                        <p className="text-white/90 text-lg leading-relaxed">
                                             Your security is our priority. Reset your password quickly and get back to building connections in the construction industry.
                                        </p>
                                   </div>

                                   <div className="relative z-10 mt-8">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                             <img
                                                  src="/logo/consnect.jpeg"
                                                  alt="Consnect"
                                                  className="w-full h-auto rounded-xl shadow-2xl"
                                             />
                                        </div>
                                   </div>

                                   <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
                                        <div className="text-center">
                                             <div className="text-3xl font-bold text-white">10K+</div>
                                             <div className="text-white/80 text-sm">Users</div>
                                        </div>
                                        <div className="text-center">
                                             <div className="text-3xl font-bold text-white">50K+</div>
                                             <div className="text-white/80 text-sm">Connections</div>
                                        </div>
                                        <div className="text-center">
                                             <div className="text-3xl font-bold text-white">99%</div>
                                             <div className="text-white/80 text-sm">Uptime</div>
                                        </div>
                                   </div>
                              </div>

                         </div>
                    </div>

                    <p className="text-center mt-6 text-sm text-gray-600">
                         &copy; <CurrentYear /> Consnect. All rights reserved.
                    </p>
               </div>

               <style jsx>{`
                    @keyframes blob {
                         0% { transform: translate(0px, 0px) scale(1); }
                         33% { transform: translate(30px, -50px) scale(1.1); }
                         66% { transform: translate(-20px, 20px) scale(0.9); }
                         100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob { animation: blob 7s infinite; }
                    .animation-delay-2000 { animation-delay: 2s; }
                    .animation-delay-4000 { animation-delay: 4s; }
               `}</style>
          </div>
     );
}