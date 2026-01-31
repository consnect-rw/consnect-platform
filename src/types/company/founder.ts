import { Prisma } from "@prisma/client"

export interface IDefaultFounder {
     id:string 
     name: string
}

export interface IBaseFounder {
     id:string 
     name: string
     title:string
     image?:string
}

export interface IFounderCreate {
     name: string
     title:string
     image?:string
     company?: {connect:{id:string}}
}

export interface IFounderUpdate {
     name?: string
     title?:string
     image?:string
}

export const SFounder = {
     id:true, name:true, title:true, image:true,
} satisfies Prisma.FounderSelect;
export type TFounder = Prisma.FounderGetPayload<{select: typeof SFounder}>

