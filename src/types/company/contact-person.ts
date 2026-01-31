import { Prisma } from "@prisma/client"

export interface IDefaultContactPerson {
     id:string
     name:string
}

export interface IBaseContactPerson {
     id:string
     name:string
     level: EContactPersonLevel
     contactEmail:string
     contactPhone: string 
     role: string
}

export interface IContactPersonCreate {
     level:EContactPersonLevel
     contactPhone:string 
     contactEmail:string 
     name:string 
     role:string
     company?:{connect:{id:string}}
}

export interface IContactPersonUpdate {
     level?:EContactPersonLevel
     contactPhone?:string 
     contactEmail?:string 
     name?:string 
     role?:string
}

export const SContactPerson = {
     id:true, level:true, contactEmail:true, contactPhone:true, name:true, role:true
} satisfies Prisma.ContactPersonSelect;

export type TContactPerson = Prisma.ContactPersonGetPayload<{select: typeof SContactPerson}>
