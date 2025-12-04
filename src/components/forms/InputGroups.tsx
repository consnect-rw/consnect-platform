/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, ComponentProps, ReactNode, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CustomButton } from "../ui/custom-buttons";

export const TextInputGroup = ({label, action, ...inputProps}:{label: string, action?:(e:string | number) => unknown} & ComponentProps<typeof Input>) => {
     return (
          <div className="w-full  flex flex-col items-start gap-1">
               <label className="w-full rounded-md text-base font-medium text-gray-800 text-start" htmlFor={inputProps.name}>{label}</label>
               <Input className="w-full placeholder:text-sm" onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} {...inputProps}/>
          </div>
     )
}

export const PasswordInputGroup = ({label, placeholder,name, required=true, action}:{label: string, placeholder:string, name:string, required?: boolean, type:string, action?:(e:string | number) => unknown}) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full  flex flex-col items-start gap-1">
               <label className="w-full rounded-md text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <Input type={showPassword ? 'text' :"password"} className="w-full placeholder:text-sm" name={name} id={name} placeholder={placeholder} required={required} onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} />
                    <i onClick={()=> setShowPassword(prev => !prev)} className="absolute top-[50%] -translate-y-[50%] right-[10px] text-gray-700 cursor-pointer " >{showPassword ? <FaEye /> : <FaEyeSlash />}</i>
               </div>
          </div>
     )
}

export const SelectInputGroup = ({label, name, required=true,values, action}:{label: string, name:string, required?: boolean, values: Array<{label:string, value:string}>, action?: (res:string) => unknown}) => {
     return (
          <div className="w-full flex flex-col items-start gap-1">
               <label className="text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
               <Select onValueChange={v => action ? action(v) : () => {} } required={required} name={name}>
                    <SelectTrigger className="w-full">
                         <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                         <SelectGroup>
                              <SelectLabel>{name}</SelectLabel>
                              {values.map((v, index) => <SelectItem key={`${name}-value-${index}`} value={v.value}>{v.label}</SelectItem>)}
                              
                         </SelectGroup>
                    </SelectContent>
               </Select>
          </div>
     )
}

export const ObjSelectInputGroup = ({label, name, required=true,values, action}:{label: string, name:string, required?: boolean, values: Array<{label:string, value:string}>, action?: (res:string) => unknown}) => {
     return (
          <div className="w-full flex flex-col items-start gap-1">
               <label className="text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
               <select onChange={(e:ChangeEvent<HTMLSelectElement>) => action ? action(e.target.value) : () => {}}  className=" w-full rounded-md text-[0.8rem] text-gray-900 border border-gray-400 bg-gray-200 outline-none py-[9.5px] px-[10px]" name={name} id={name} required={required}>
                    <option value="">Select {name}</option>
                    {
                         values.map((value, index) => <option key={`${name}-${index}`} value={value.value} >{value.label}</option>)
                    }
               </select>
          </div>
     )
}

export const CheckInputGroup = ({label, placeholder,name, required=true}:{label: string, placeholder:string, name:string, required?: boolean}) => {
     return (
          <div className="w-full flex  items-center gap-1">
               <label className="text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
               <input type="checkbox" className="text-[0.8rem] text-gray-900 border border-gray-400 bg-gray-200 outline-none" name={name} id={name} placeholder={placeholder} required={required} />
          </div>
     )
}

export const RadioInputGroup = ({label, name, required=true, defaultChecked=false}:{label: string,  name:string, required?: boolean, defaultChecked?:boolean}) => {
     return (
          <div className="w-full flex  items-center gap-1">
               <label className="text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
               <input type="checkbox" defaultChecked={defaultChecked} className="text-base text-gray-900 border border-gray-400 bg-gray-200 outline-none" name={name} id={name} required={required} />
          </div>
     )
}

export const TextAreaInputGroup = ({label, placeholder,name, required=true, action, maxWords,defaultValue}:{label: string, placeholder:string, name:string, required?: boolean, action?:(e:string) => unknown, maxWords:number,defaultValue?:string}) => {
     
     const [wordCount, setWordCount] = useState(0);
     const [text, setText] = useState("");

     const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          const inputText = e.target.value;
          const words = inputText.trim().split(/\s+/).filter(Boolean);
          
          if (words.length <= maxWords) {
               setText(inputText);
               setWordCount(words.length);
               if (action) action(inputText);
          }
     };
     return (
          <div className="w-full  flex flex-col items-start gap-1">
               <div className="w-full flex items-center justify-start gap-[10px]">
                    <label className="w-full rounded-md text-base font-medium text-gray-800" htmlFor={name}>{label}</label>
                    <span className="text-gray-600 text-xs mt-1 whitespace-nowrap">
                    {wordCount} / {maxWords} words
                    </span>
               </div>
               <Textarea className="w-full placeholder:text-sm" name={name} id={name} required={required} defaultValue={defaultValue} onChange={handleChange} placeholder={placeholder} />
          </div>
     )
}

export const SubmitBtn = ({...btnProps}:ComponentProps<typeof CustomButton>) => {

     return (
          <CustomButton {...btnProps} type="submit" className={btnProps.className ?? "w-full flex items-center justify-center gap-2 rounded-lg cursor-pointer py-2 px-4 disabled:cursor-not-allowed bg-gradient-to-bl from-amber-600 to-amber-700 text-white"} />
     )
     
}