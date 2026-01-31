"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { revalidatePages } from "../revalidate";
import { getServerSession, Session } from "next-auth";
import { Prisma } from "@prisma/client";
import { encryptPassword } from "@/util/bcryptFuncs";
import { SSessionUser, TSessionUser } from "@/types/auth/user";
import { authOptions } from "@/lib/authOptions";
import { ESessionFetchMode } from "@/types/enums";

export async function createUser(data: Prisma.UserCreateInput) {
     try{
          const hash = await encryptPassword(data.password);
          data.password = hash;
          const res = await prisma.user.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating User: ",error);
          return null;
     }
}

export async function updateUser (id:string, data:Prisma.UserUpdateInput) {
     try {
          if(data.password) {
               const hash = await encryptPassword(data.password as string);
               data.password = hash;
          }
          const res = await prisma.user.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating User with id: ${id}`, error);
          return null;
     }
}

export async function deleteUser (id:string) {
     try {
          const res = await prisma.user.delete({where: {id}});
          
          const User = await prisma.user.findUnique({where:{id}});

          if (!User) throw new Error("User not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting User with id: ", id, error);
          return null;
     }
}

export const fetchUsers = cache(async <T extends Prisma.UserSelect>(
          selectType: T, search?: Prisma.UserWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.UserGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.user.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.user.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Users: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchUserById = cache(async <T extends Prisma.UserSelect>(id:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.user.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching User data for id: ${id}`, error);
          return null;
     }
})

export const fetchUserByEmail = cache(async <T extends Prisma.UserSelect>(email:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.user.findUnique({where:{email},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching User data for email: ${email}`, error);
          return null;
     }
})

export async function getSessionUser (mode: ESessionFetchMode=ESessionFetchMode.SESSION_AND_USER):Promise<{user:TSessionUser | null | undefined, session: Session | null}>{
    const session = await getServerSession(authOptions);
    if(!session) return {user:null, session: null};
    const sessionUser = session.user;
    if(mode === ESessionFetchMode.SESSION_ONLY) return {session, user:null};
    if(!sessionUser) return {user:null, session};
    if (!sessionUser.email) return {user:null, session: session};
    const user = await fetchUserByEmail(sessionUser.email, SSessionUser);

    return {user, session};
}