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