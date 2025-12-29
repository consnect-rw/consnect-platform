"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { ContactPersonFormToggleBtn } from "@/components/forms/company/ContactPersonForm";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { deleteContactPerson, fetchContactPersons } from "@/server/company/contact-person";
import { SContactPerson, TContactPerson } from "@/types/company/contact-person";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CompanyContactPersonForm () {
     const {user} = useAuth();
     const {data:contactPersonsData, isLoading} = useQuery({
          queryKey: ["company-contact-persons", user?.company?.id],
          queryFn: () => user?.company ? fetchContactPersons(SContactPerson, {company:{id: user.company.id}}) : null
     });
     const contactPersons = contactPersonsData?.data ?? [];
     if (!user?.company) {
          return (
               <CompanyRequiredNotice message="Please first create your company to add contact persons!"/>
          );
     }
     
     return (
          <div className="w-full flex flex-col">
               <div className="w-full flex items-center justify-end">
                    <ContactPersonFormToggleBtn className={"flex items-center gap-4 py-2 px-4 bg-linear-to-bl from-yellow-600 to-amber-600 text-white cursor-pointer rounded-lg"} title="Add New contact Person" name="Contact Person" icon={<Plus className="w-5 h-5" />} companyId={user.company.id} />
               </div>
               {
                    contactPersons.length === 0 ? <p className="text-gray-600 font-medium">No contact persons added yet</p>: 
                    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                         {
                              contactPersons.map(p => <ContactPersonCard key={`company-founder-${p.id}`} person={p} />)
                         }
                    </div>
               }
          </div>
     )
}

const ContactPersonCard = ({ person }: { person: TContactPerson }) => {
  const handleDelete = async() => {
    if(confirm("Are you sure you want to delete the contact person")){
      const res = await deleteContactPerson(person.id);
      if(!res) return toast.error("Error deleting contact person");
      queryClient.invalidateQueries();
      return toast.success("Deleted contact person successfully!")
    }else {
      return;
    }
  }
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header with avatar and name/role */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-8 relative">
        <div className="flex items-center gap-5">
          {/* Avatar with initial */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/40">
            {person.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{person.name}</h3>
            <p className="text-white/90 text-sm mt-1">{person.role}</p>
            {person.level && (
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white">
                {person.level}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body with contact info */}
      <div className="p-6 bg-gray-50/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{person.contactEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{person.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <ContactPersonFormToggleBtn 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
              title="Edit contact person"
              name="Update"
              companyId=""
              person={person}
              icon={<Pencil className="w-4 h-4" />}
          />

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};