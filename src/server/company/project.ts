"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createProject(data: Prisma.ProjectCreateInput) {
     try{
          const res = await prisma.project.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Project: ",error);
          return null;
     }
}

export async function updateProject (id:string, data:Prisma.ProjectUpdateInput) {
     try {
          const res = await prisma.project.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Project with id: ${id}`, error);
          return null;
     }
}

export async function deleteProject (id:string) {
     try {
          const res = await prisma.project.delete({where: {id}});
          
          const Project = await prisma.project.findUnique({where:{id}});

          if (!Project) throw new Error("Project not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Project with id: ", id, error);
          return null;
     }
}

export const fetchProjects = cache(async <T extends Prisma.ProjectSelect>(
          selectType: T, search?: Prisma.ProjectWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[]  = { createdAt: 'asc' }
     ):Promise<{data: Prisma.ProjectGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.project.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.project.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Projects: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchProjectById = cache(async <T extends Prisma.ProjectSelect>(id:string, selectType: T): Promise<Prisma.ProjectGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.project.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Project data for id: ${id}`, error);
          return null;
     }
})