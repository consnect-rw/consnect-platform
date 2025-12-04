"use client";

import { ChangeEvent, ReactNode, useState } from "react";
import { toast } from "sonner";
import { SubmitBtn } from "./InputGroups";

interface IMainFormProps {
     children: ReactNode
     submitData: (data: FormData) => Promise<void | undefined | string | number >
     btnTitle?: string 
     btnIcon?: ReactNode
}

export const MainForm = ({children, submitData, btnTitle, btnIcon}: IMainFormProps) => {
     const [loading,setLoading] = useState(false);
     const submitForm = async(event:ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               const data = new FormData(event.currentTarget);
               return await submitData(data);
          } catch (error) {
               console.log(error);
               return toast.error("Application Error", {description: "Some went wrong. Please contact support"});
          }finally {
               setLoading(false);
          }
     }
     return (
          <form onSubmit={submitForm} className="w-full flex flex-col gap-4">
               {children}
               <SubmitBtn disabled={loading} name={btnTitle ?? "Submit"} icon={btnIcon} />
          </form>
     )
}

export const MainFormLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-white">
      <div className="text-center space-y-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-900">
            Loading Data
          </h3>
          <p className="text-sm text-blue-600">
            Please wait while we fetch your information...
          </p>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};