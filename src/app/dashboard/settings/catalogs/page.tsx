"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { ProductCatalogFormToggleBtn } from "@/components/forms/company/ProductCatalogForm";
import Image from "@/components/ui/Image";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { deleteProductCatalog, fetchProductCatalogs } from "@/server/company/product-catalog";
import { SProductCatalog, TProductCatalog } from "@/types/company/product-catalog";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CompanyProductCatalogsPage () {
     const {user} = useAuth();

     const {data: catalogsData,isLoading} = useQuery({
          queryKey:["company-catalogs", user?.company?.id],
          queryFn: () => user?.company ? fetchProductCatalogs(SProductCatalog, {company:{id: user.company.id}}, 10) : null
     });
     const catalogs = catalogsData?.data ?? [];
     if (!user?.company) {
          return (
              <CompanyRequiredNotice message="Please first create your company to add product catalogs"/>
          );
     }
     return (
          <div className="w-full flex flex-col gap-4">
               <div className="w-full flex items-center justify-end">
                    <ProductCatalogFormToggleBtn title="New Product Catalog" icon={<Plus className="w-5 h-5" />} name="Catalog" className={"flex items-center cursor-pointer gap-2 py-2 px-4 font-medium text-white bg-linear-to-bl from-amber-600 to-yellow-600 rounded-lg"} companyId={user.company.id}  />
               </div>
               {
                    catalogs.length === 0 ? <p className="font-medium text-gray-600">No product catalogs added yet!</p> :
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                         {
                              catalogs.map(c => <ProductCatalogCard catalog={c} key={c.id} />)
                         }
                    </div>
               }
          </div>
     )
}

const ProductCatalogCard = ({ catalog }: { catalog: TProductCatalog }) => {
     const handleDelete = async () => {
          try {
               const res = await deleteProductCatalog(catalog.id);
               if(!res) return toast.error("Error deleting product catalog ");
               queryClient.invalidateQueries();
               return toast.success("Success deleting product catalog!");
          } catch (error) {
               console.log(error);
               return toast.error("Application error!");
          }
     }
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200">
      {/* Image container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={catalog.image}
          alt={catalog.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover overlay with View & Download */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-4 p-6">
          <Link href={catalog.fileUrl} target="_blank" type="button"
            className="flex items-center gap-2 px-5 py-3 bg-white/90 hover:bg-white text-gray-900 font-medium rounded-xl shadow-lg backdrop-blur-sm transition-all"
          >
            <Eye className="w-5 h-5" />
            View
          </Link>

          <Link
            href={catalog.fileUrl}
            download
            className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Download
          </Link>
        </div>

        {/* PDF Badge */}
        <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          PDF Catalog
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {catalog.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {catalog.description}
        </p>
      </div>

      {/* Dashboard Actions: Edit & Delete */}
      <div className="px-6 pb-6 flex gap-3">
          <ProductCatalogFormToggleBtn 
               title="Edit Product Catalog"
               companyId=""
               icon={<Pencil className="w-4 h-4" />}
               name="Edit"
               catalog={catalog}
               className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
          />
        <button
          type="button"
          onClick={() => {
            // Handle delete (recommend confirmation modal in production)
            console.log('Delete catalog:', catalog.id);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};