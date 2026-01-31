export interface IDefaultDescription {
     id:string 
     description: string
}

export interface IBaseDescription {
     id:string 
     title:string
     description: string
     featuredImage?:string
     rank:number
}

export interface IDescriptionCreate {
     title:string
     description:string 
     featuredImage?:string
     rank:number
     company?: {connect: {id:string}}
}


export interface IDescriptionUpdate {
     title?:string
     description?:string 
     featuredImage?:string
     rank?:number
}