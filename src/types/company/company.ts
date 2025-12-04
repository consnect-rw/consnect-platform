import { IBaseDescription } from "../common/description"
import { IBaseLocation, ILocationCreate } from "../common/location"
import { IBaseSocialMedia } from "../common/social-media"
import { IBaseContactPerson } from "./contact-person"
import { IBaseFounder } from "./founder"
import { IBaseReview } from "./review"
import { IBaseService } from "./service"

export interface IDefaultCompany {
     id:string
     name:string
     handle:string
     logoUrl?:string
     createdAt:Date
}

export interface IBaseCompany {
     id:string
     name:string
     handle:string
     phone:string
     email:string
     founderYear: number
     companySize: number
     website?: string
     logoUrl?:string
     slogan?:string
     partnerInterests: string[]
     createdAt:Date
}

export interface IDetailedCompany {
     id:string
     name:string
     handle:string
     phone:string
     email:string
     founderYear: number
     companySize: number
     website?: string
     logoUrl?:string
     slogan?:string
     partnerInterests: string[]
     createdAt:Date
     location: IBaseLocation
     descriptions: IBaseDescription[]
     socialMedia?: IBaseSocialMedia
     founders: IBaseFounder[]
     contactPersons: IBaseContactPerson[]
     reviews: IBaseReview[] 
}

export interface IPageCompany {
     id:string
     name:string
     handle:string
     phone:string
     email:string
     founderYear: number
     companySize: number
     website?: string
     logoUrl?:string
     slogan?:string
     partnerInterests: string[]
     createdAt:Date
     location: IBaseLocation
     descriptions: IBaseDescription[]
     socialMedia?: IBaseSocialMedia
     founders: IBaseFounder[]
     contactPersons: IBaseContactPerson[]
     reviews: IBaseReview[]
     services: IBaseService[]
}

export interface ICompanyCreate{
     name:string
     handle:string
     phone:string
     email:string
     foundedYear: number
     companySize: number
     website?: string
     logoUrl?:string
     slogan?:string
     partnerInterests?: string[]
     location: ILocationCreate
     user:{connect: {id:string}}
}


