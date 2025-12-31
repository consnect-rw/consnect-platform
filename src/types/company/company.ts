import { Prisma } from "@prisma/client"
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

export const SCompanyUpdate = {
     id:true, name:true, handle:true, phone:true, email:true,
     foundedYear:true, companySize:true, website:true, logoUrl:true, slogan:true, 
     partnerInterests:true, 
     location: {select: {id:true, country: true, city:true, state:true, zipCode:true, address:true}},
     verification: {select: {status: true, message:true}}

} satisfies Prisma.CompanySelect;
export type TCompanyUpdate = Prisma.CompanyGetPayload<{select: typeof SCompanyUpdate}>

export const SAdminCompanyCard = {
     id:true, name:true, handle:true, phone:true, email:true, foundedYear:true,  companySize:true,
     logoUrl:true, slogan:true, createdAt:true, partnerInterests:true,
     verification: {select: {status:true, message:true, id:true}},
     location: {select:{country:true, state:true,}},
     _count:{select:{offers: true, catalogs:true, }}
} satisfies Prisma.CompanySelect;

export type TAdminCompanyCard = Prisma.CompanyGetPayload<{select: typeof SAdminCompanyCard}>

export const SCompanyCard = {
     id:true, handle:true, name:true, website:true, logoUrl:true, slogan:true, 
     descriptions:{select:{description:true}, where:{title: "Overview"}},
} satisfies Prisma.CompanySelect;
export type TCompanyCard = Prisma.CompanyGetPayload<{select: typeof SCompanyCard}>

export const SCompanyPage = {
     id:true, handle:true, name:true, website:true, logoUrl:true, slogan:true,
     phone:true, email:true, foundedYear:true, companySize:true, createdAt:true, 
     location: {select:{country:true, city:true, address:true, state:true}},
     socialMedia:{select:{facebook:true, twitter:true, linkedin:true, instagram:true, youtube:true}},
     descriptions: {select:{title:true, description:true}},
     founders: {select:{image:true, name:true, title:true}},
     contactPersons:{select:{name:true, contactPhone:true, contactEmail:true, role:true, }},
     projects:{select:{title:true, clientName:true, phase:true, images:true,  description:true}},
     catalogs:{select:{name:true, description:true, image:true, fileUrl:true}}
} satisfies Prisma.CompanySelect;
export type TCompanyPage = Prisma.CompanyGetPayload<{select: typeof SCompanyPage}>

