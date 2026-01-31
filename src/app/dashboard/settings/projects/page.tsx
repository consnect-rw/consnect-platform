"use client";

import ProjectCard from "@/components/cards/CompanyProjectCard";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/hooks/useAuth";
import { fetchProjects } from "@/server/company/project";
import { SProject } from "@/types/company/project";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ["company-projects", user?.company?.id, page],
    queryFn: () =>
      user?.company
        ? fetchProjects(
            SProject,
            { company: { id: user.company.id } },
            perPage,
            (page - 1) * perPage
          )
        : null,
    enabled: !!user?.company,
  });

  const projects = projectsData?.data ?? [];
  const totalProjects = projectsData?.pagination.total ?? 0;

  const handleEdit = (id: string | number) => {
    console.log("Edit project:", id);
    // Open edit modal or navigate
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      console.log("Delete project:", id);
      // Call delete API then refetch
      await refetch();
    }
  };

  const handleToggleComplete = async (id: string | number) => {
    console.log("Toggle complete for project:", id);
    // Call API to update isCompleted, then refetch
    await refetch();
  };

  if (!user?.company) {
    return (
      <CompanyRequiredNotice message="You need to add your company information before adding projects." />
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900 ">
            {totalProjects} Project{totalProjects !== 1 ? 's' : ''}
        </span>
        <Link href={"/dashboard/settings/projects/form"} className="font-medium py-2 px-4 text-white bg-linear-to-bl from-amber-600 to-yellow-600 rounded-lg flex items-center gap-2 " prefetch><Plus className="w-5 h-5" /> Project</Link>
      </div>
      <div className="w-full mx-auto">
        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No projects yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start adding your company projects to showcase your work.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalProjects > perPage && (
          <Pagination
            itemsPerPage={perPage}
            totalItems={totalProjects}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  );
}