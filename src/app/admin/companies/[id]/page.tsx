import { AdminCompanyView } from "@/components/containers/AdminCompanyView";
import { fetchCompanyById } from "@/server/company/company";
import { SAdminCompanyPage } from "@/types/company/company";

export default async function AdminCompanyPage({params}:{params: Promise<{id:string}>}) {
     const {id} = await params;
     const companyData = await fetchCompanyById(id, SAdminCompanyPage);
     if(!companyData) return (
           <div className="p-6 bg-white rounded-lg shadow-md">
               <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
               <p className="text-gray-600">No company found with ID: {id}</p>
           </div>
     )
  return (
     <AdminCompanyView company={companyData}/> 
  )
}