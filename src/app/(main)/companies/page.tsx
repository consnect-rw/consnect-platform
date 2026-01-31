"use client";

import { CompanyCard } from "@/components/cards/CompanyCard";
import Pagination from "@/components/ui/Pagination";
import { fetchCompanys } from "@/server/company/company";
import { SCompanyCard } from "@/types/company/company";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CompaniesPage () {
     const perPage = 20;
     const [page,setPage] = useState(1);
     const {data:companiesData} = useQuery({
          queryKey: ["companies"],
          queryFn: () => fetchCompanys(SCompanyCard, {verification: {status: "VERIFIED"}}, perPage, (page-1)*perPage)
     });
     const companies = companiesData?.data ?? [];
     const total = companiesData?.pagination.total ?? 0;

     return (
          <div className="w-full max-w-7xl mx-auto my-8 flex flex-col gap-8">
               <div className="flex flex-col  gap-4 items rounded-xl bg-linear-to-br from-gray-800 to-slate-800 p-8">
                    <h1 className="text-3xl font-extrabold text-gray-50">Trusted and verified construction companies</h1>
                    <p className="text-gray-200 font-medium text-lg">Partner with {total} companies registered on the platform!</p>
               </div>
               {
                    companies.length === 0 ? <p>No Companies matching to you search criteria!</p>: 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                         {companies.map((company) => (
                              <CompanyCard key={company.id} company={company} />
                         ))}
                    </div>
               }
               <Pagination itemsPerPage={perPage} currentPage={page} onPageChange={p => setPage(p)} totalItems={total} />
          </div>
     )
}