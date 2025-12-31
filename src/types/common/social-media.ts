import { Prisma } from "@prisma/client"

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
     linkedin?: string
     instagram?:string
     youtube?:string
}

export const SSocialMedia = {
     id:true, facebook:true, twitter:true, linkedin:true, instagram:true, youtube:true
} satisfies Prisma.SocialMediaSelect;

export type TSocialMedia = Prisma.SocialMediaGetPayload<{select: typeof SSocialMedia}>