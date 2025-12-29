"use client";

import { Pencil, Trash2, CheckCircle2, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { TProject } from '@/types/company/project';
import Link from 'next/link';
import { deleteProject, updateProject } from '@/server/company/project';
import { toast } from 'sonner';
import queryClient from '@/lib/queryClient';



const ProjectCard = ({
  project,
}: {
  project: TProject;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const isCompleted = project.phase === 'COMPLETED';

  const handledDelete = async() => {
    if(confirm("Are you sure you want to delete the project")){
      const res = await deleteProject(project.id);
      if(!res) return toast.error("Error deleting the project");
      queryClient.invalidateQueries();
      return toast.success("Project deleted successfully!");
    }
  }

  const changePhase = async() => {
    if(confirm("The project will be marked completed!")){
      const res = await updateProject(project.id, {
        phase: EProjectPhase.COMPLETED
      });
      if(!res) return toast.error("Error updating project status!");
      queryClient.invalidateQueries();
      return toast.success("Project phase updated to completed!");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative aspect-video bg-gray-100">
        {project.images.length > 0 ? (
          <>
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {project.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {project.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Building2 className="w-16 h-16" />
          </div>
        )}

        {/* Phase Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${
              isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isCompleted ? 'Completed' : 'In Execution'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>

        {/* Client Info */}
        <div className="space-y-2 text-sm mb-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Client:</span>
            <span className="font-medium text-gray-900">{project.clientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="font-medium text-gray-700 truncate max-w-[180px]">
              {project.clientEmail}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Phone:</span>
            <span className="font-medium text-gray-700">{project.clientPhone}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-500 space-y-1 border-t pt-4">
          <div>Initiated: {format(new Date(project.initiatedOn), 'MMM d, yyyy')}</div>
          {project.completedOn && (
            <div>Completed: {format(new Date(project.completedOn), 'MMM d, yyyy')}</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex gap-3">
        <Link
         href={`/dashboard/projects/form?id=${project.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Link>

        {isCompleted ? null :<button
          onClick={changePhase}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-xl transition-colors shadow-sm ${
            isCompleted
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {'Mark Complete'}
        </button>}

        <button
          onClick={handledDelete}
          className="flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;