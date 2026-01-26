import { Prisma } from "@prisma/client"
import { SDocument } from "../common/document"

export interface IDefaultProject {
     id:string
     title:string 
}

export interface IBaseProject {
     id:string
     title:string
     description: string
     images: string[]
     phase: EProjectPhase
     clientName: string
     clientEmail:string
     clientPhone:string
     createdAt: Date
     initiatedOn: Date
     completedOn?:Date
}

export interface IProjectCreate {
     title:string
     description: string
     images: string[]
     phase: EProjectPhase
     clientName: string
     clientEmail: string
     clientPhone: string
     initiatedOn: Date
     completedOn?: Date
     company?:  {connect: {id:string}}
}

export interface IProjectUpdate {
     title?:string
     description?: string
     images?: string[]
     phase?: EProjectPhase
     clientName?: string
     clientEmail?: string
     clientPhone?: string
     initiatedOn?: Date
     completedOn?: Date
}

export const SProject  = {
     id:true, title:true, description:true, images:true, phase:true, 
     clientEmail:true, clientName:true, clientPhone:true, createdAt:true,
     initiatedOn:true, completedOn:true, 
     documents: {select: SDocument}
} satisfies Prisma.ProjectSelect;
export type TProject = Prisma.ProjectGetPayload<{select: typeof SProject}>