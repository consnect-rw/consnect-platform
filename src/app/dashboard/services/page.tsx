"use client";

import ServiceCard from "@/components/cards/CompanyServiceCard";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { fetchServices } from "@/server/company/service";
import { SService } from "@/types/company/service";
import { useQuery } from "@tanstack/react-query";
import { Building2, Wrench } from "lucide-react";
import { useState } from "react";

export default function ServicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data: servicesData, isLoading, refetch } = useQuery({
    queryKey: ["company-services", user?.company?.id, page],
    queryFn: () =>
      user?.company
        ? fetchServices(
            SService,
            { company: { id: user.company.id } },
            perPage,
            (page - 1) * perPage
          )
        : null,
    enabled: !!user?.company,
  });

  const services = servicesData?.data ?? [];
  const totalServices = servicesData?.pagination.total ?? 0;

  const handleEdit = (id: string | number) => {
    console.log("Edit service:", id);
    // Open modal or navigate to edit page
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      console.log("Delete service:", id);
      // Call delete API, then refetch
      await refetch();
    }
  };

  if (!user?.company) {
    return (
      <CompanyRequiredNotice message="You need to add your company information before adding company services." />
    );
  }

  return (
    <div className="w-full min-h-full bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Wrench className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-1">
                Manage and showcase the professional services your company offers
              </p>
            </div>
          </div>

          <div className="text-2xl font-bold text-gray-900">
            {totalServices} Service{totalServices !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Wrench className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No services added yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start adding your company services to let clients know what you offer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => handleEdit(service.id)}
                onDelete={() => handleDelete(service.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalServices > perPage && (
          <Pagination
            itemsPerPage={perPage}
            totalItems={totalServices}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  );
}