export interface IDefaultSocialMedia {
     id:string
}

export interface IBaseSocialMedia {
     id:string
     facebook?:string
     twitter?: string 
     linkedIn?: string
     instagram?:string
     youtube?:string
}

export interface ISocialMediaCreate {
     facebook?:string
     twitter?: string 
     linkedIn?: string
     instagram?:string
     youtube?:string
     company?: {connect: {id:string}}
}