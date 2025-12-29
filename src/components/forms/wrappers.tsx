"use client";

import { ReactNode } from "react";

export const Grid2InputWrapper = ({title, children }:{title:string, children: ReactNode}) => {
     return (
          <div className="flex flex-col gap-2 shadow-sm rounded-lg p-4">
               <h3 className="text-lg font-bold text-blue-800">{title}</h3>
               <div className="w-full grid lg:grid-cols-2 gap-4 items-end">{children}</div>
          </div>
     )
}

export const ColumnInputWrapper = ({title, children,actionBtn }:{title:string, children: ReactNode, actionBtn?:ReactNode }) => {
     return (
          <div className="flex flex-col gap-2 shadow-sm rounded-lg p-4">
               <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-800">{title}</h3>
                    {actionBtn ?? null}
               </div>
               {children}
          </div>
     )
}