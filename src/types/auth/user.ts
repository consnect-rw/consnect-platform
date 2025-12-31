import { Prisma } from "@prisma/client";

export enum EUserRole {
     ADMIN = 'ADMIN' ,
     USER = 'USER',
     
}

export interface IAuthUser {
     id:string;
     email: string;
     role: EUserRole;
     active: boolean;
     name:string
     phone:string
     company: {id:string, name:string, handle:string, logoUrl: string}
}

export interface IDefaultUser {
     id:string
     email:string
     role:EUserRole
}

export interface IUserCreate {
     name:string
     phone: string
     email:string
     password: string
}


export const SSessionUser = {
     id:true,
     name:true,
     email:true, 
     phone:true,
     role:true, 
     active:true,
     image:true,
     company:{select:{
          name:true, id:true, location: {select:{country:true, city:true}},
          verification: {select: {status:true, message:true, createdAt:true, updatedAt:true}}
     }}
} satisfies Prisma.UserSelect;

export type TSessionUser = Prisma.UserGetPayload<{select: typeof SSessionUser}>;

export const SAdminUserRow = {
     id:true, email:true, name:true, isEmailVerified:true, isTwoFactorEnabled:true, active:true, 
     createdAt:true, 
     company: {select:{name:true, verification:{select:{status:true}}}}
} satisfies Prisma.UserSelect;
export type TAdminUserRow = Prisma.UserGetPayload<{select: typeof SAdminUserRow}>

export const SAdminRow = {
     id:true, email:true, name:true, isEmailVerified:true, isTwoFactorEnabled:true, active:true, 
     createdAt:true
} satisfies Prisma.UserSelect;
export type TAdminRow = Prisma.UserGetPayload<{select: typeof SAdminRow}>
