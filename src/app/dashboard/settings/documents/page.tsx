"use client";

import { CompanyDocumentCard } from "@/components/cards/CompanyDocumentCard";
import { DocumentCard } from "@/components/cards/DocumentCard";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { DocumentFormToggleBtn } from "@/components/forms/common/DocumentForm";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { deleteDocument, fetchDocuments } from "@/server/common/document";
import { SDocument, TDocument } from "@/types/common/document";
import { deleteSingleImage } from "@/util/s3Helpers";
import { EDocumentType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Edit2, ExternalLink, Eye, FileText, MoreVertical, Plus, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyDocumentsForm () {
     const {user} = useAuth();
     const perPage = 20;
     const [page,setPage] = useState(1);
     const {data: documentsData, isLoading} = useQuery({
          queryKey: ["company-documents", user?.company?.id ],
          queryFn: () => user?.company ? fetchDocuments(SDocument, {company:{id: user.company.id}}, perPage, (page-1)*perPage) :null
     });
     const documents = documentsData?.data ?? [];
     const totalDocuments = documentsData?.pagination.total ?? 0;

     if (!user?.company) {
               return (
                    <CompanyRequiredNotice message="Please first create your company to add company documents"/>
               );
          }
     return (
          <div className="w-full flex flex-col gap-4 bg-gray-50 rounded-xl p-4">
               <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">{totalDocuments} Documents</span>
                    <div className="w-auto flex items-center gap-2">
                      <DocumentFormToggleBtn title="New License" 
                        className="py-2 px-4 text-lg font-medium text-white bg-linear-to-br from-yellow-600 to-amber-800 rounded-lg flex items-center gap-2"
                        companyId={user.company.id}
                        icon={<Plus className="w-4 h-4" />}
                        name="License"
                        documentType={EDocumentType.LICENSE}
                        modelType="COMPANY"
                      />
                      <DocumentFormToggleBtn title="New Certification" 
                        className="py-2 px-4 text-lg font-medium text-white bg-linear-to-br from-yellow-600 to-amber-800 rounded-lg flex items-center gap-2"
                        companyId={user.company.id}
                        icon={<Plus className="w-4 h-4" />}
                        name="Certificate"
                        documentType={EDocumentType.CERTIFICATION}
                        modelType="COMPANY"
                      />
                    </div>
                    
               </div>
                {documents.length === 0 ? <p className="text-lg font-medium text-gray-600">Documents found!</p> :

                <div className="w-full grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
                  {
                    documents.map(doc => <CompanyDocumentCard key={doc.id} document={doc} />)
                  }
                </div>
              }
          </div>
     )
}

