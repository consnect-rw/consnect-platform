import { Prisma } from "@prisma/client"
import { ECategoryType } from "./enums"


export interface IDefaultCategory {
     id:string
     name:string
}

export interface IBaseCategory {
     id:string
     name:string
     type: ECategoryType
     image?:string
}


export interface IDetailedCategory {
     id:string
     name:string
     type: ECategoryType
     image?:string
     description?:string
     _count: {
          services:number
          offers:number
     }
}

export interface ICategoryCreate {
     name:string
     type: ECategoryType
     description?:string
     image?:string
}

export interface ICategoryUpdate {
     name?:string
     type?: ECategoryType
     description?:string
     image?:string
}


export const SAdminCategoryCard = {
     id:true, name:true, image:true, description:true, type:true
} satisfies Prisma.CategorySelect;

export type TAdminCategoryCard = Prisma.CategoryGetPayload<{select: typeof SAdminCategoryCard}>