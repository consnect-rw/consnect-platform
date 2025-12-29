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