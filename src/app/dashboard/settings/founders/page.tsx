"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { FounderFormToggleBtn } from "@/components/forms/company/FounderForm";
import Image from "@/components/ui/Image";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { deleteFounder, fetchFounders } from "@/server/company/founder";
import { SFounder, TFounder } from "@/types/company/founder";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function CompanyFoundersForm () {
     const {user} = useAuth();
     const {data:foundersData, isLoading} = useQuery({
          queryKey: ["company-founders", user?.company?.id],
          queryFn: () => user?.company ? fetchFounders(SFounder, {company: {id: user.company.id}}) : null
     });

     const founders = foundersData?.data ?? [];

     if (!user?.company) {
          return (
               <CompanyRequiredNotice message="Please first create your company to continue writing about it"/>
          );
     }

     return (
          <div className="w-full flex flex-col gap-4">
               <div className="w-full flex items-center justify-end gap-4">
                    <FounderFormToggleBtn className={"px-4 py-2 bg-linear-to-bl from-yellow-700 to-amber-700 text-white font-medium flex items-center gap-2 rounded-lg cursor-pointer"} companyId={user.company.id} title="Add Company Founder" name="Founder" icon={<Plus className="w-5 h-5" />}  />
               </div>
               {
                    founders.length === 0 ? <p className="text-gray-600 font-medium">No founders added yet</p>: 
                    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                         {
                              founders.map(f => <FounderCard key={`company-founder-${f.id}`} founder={f} />)
                         }
                    </div>
               }
          </div>
     )
}

const FounderCard = ({founder}:{founder: TFounder}) => {
     const handleDelete = async() => {
          if(confirm("Are you sure you want to delete founder!")){
               const res = await deleteFounder(founder.id);
               if(!res) return toast.error("Error deleting founder");
               queryClient.invalidateQueries();
               return toast.success("Success deleting founder!");
          }
          return;
     }
     return (
          <div className={cn("w-full rounded-lg flex flex-col items-center shadow-sm p-2 gap-4")}>
               <Image src={founder.image ?? "/default/user.png"} alt="founder image" className="w-32 h-32 rounded-full"  />
               <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800">{founder.name}</h3>
                    <span className="text-sm font-medium text-gray-600">{founder.title}</span>
               </div>
               <div className="w-full grid grid-cols-2 gap-2">
                    <FounderFormToggleBtn className={"py-2 w-full rounded-lg border border-gray-300 text-gray-700 flex items-center gap-2 justify-center cursor-pointer"} icon={<Edit />} founder={founder} companyId="" title="Edit Founder Info" />
                    <button type="button" className="py-2 w-full rounded-lg bg-red-600 text-red-100 flex items-center gap-2 justify-center cursor-pointer" onClick={handleDelete}><Trash /></button>
               </div>
          </div>
     )
}