"use client";

import { ILocationCreate } from "@/types/common/location";
import { useState } from "react";
import { TextInputGroup } from "../InputGroups";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ILocationFormProps {
     companyId?:string
     onSubmit: (loc: ILocationCreate) => void 
}

export default function LocationForm ({companyId, onSubmit}: ILocationFormProps) {
     const [location,setLocation] = useState<ILocationCreate> ({country:"", city:""});
     const submit = () => {
          if(!location.country || !location.city) return toast.warning("Please country and city are required");
          return onSubmit({
               ...location,
               ...(companyId ? {company: {connect: {id: companyId}}}: {})
          })
     }
     return (
          <div className="w-full grid lg:grid-cols-2 gap-4">
               <TextInputGroup action={res => setLocation(prev => ({...prev, country: res as string}))} name="country" label="Country:" required={false}  />
               <TextInputGroup action={res => setLocation(prev => ({...prev, city: res as string}))} name="city" label="City:" required={false}  />
               <TextInputGroup action={res => setLocation(prev => ({...prev, state: res as string}))} name="state" label="State/District:" required={false}  />
               <TextInputGroup action={res => setLocation(prev => ({...prev, address: res as string}))} name="address" label="Address:" required={false}  />
               <Button variant={"outline"} className="w-full lg:col-span-2" onClick={submit}>Save</Button>
          </div>
     )

}