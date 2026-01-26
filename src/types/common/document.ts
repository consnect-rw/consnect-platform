import { Prisma } from "@prisma/client"
import { EDocumentModelType, EDocumentType } from "./enums"

export interface IDefaultDocument {
     id:string
     title:string
}

export interface IBaseDocument {
     id:string
     title:string
     docUrl:string
     type: EDocumentType
     modelType: EDocumentModelType
}

export interface IDetailedDocument {
     id:string
     title:string
     docUrl: string
     type:EDocumentType
     modelType: EDocumentModelType
     description?:string
}

export interface IDocumentCreate {
     title:string
     type: EDocumentType
     modelType: EDocumentModelType
     docUrl:string
     description?:string
     company?:{connect:{id:string}}
     service?: {connect:{id:string}}
}

export interface IDocumentUpdate {
     title?:string
     type?: EDocumentType
     modelType?: EDocumentModelType
     docUrl?:string
     description?:string
}

export const SDocument = {
     id:true, title:true, description:true, docUrl:true, type:true, isVerified:true, message:true, 
} satisfies Prisma.DocumentSelect;

export type TDocument = Prisma.DocumentGetPayload<{select: typeof SDocument}>