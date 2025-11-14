"use server";

import { IAuthUser } from "@/types/auth/user";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./authOptions";
import { DataService } from "@/util/data-service";
import { apiUrl } from "./api";
import Endpoints from "./endpoints";

export async function getSessionUser ():Promise<{user:IAuthUser | null | undefined, session: Session | null}>{
     const session = await getServerSession(authOptions);
     if(!session) return {user:null, session: null};
     const sessionUser = session.user;
     if(!sessionUser) return {user:null, session};
     if (!sessionUser.email) return {user:null, session: session};
     const response = await DataService.fetch<{data:IAuthUser[]}>(apiUrl, `${Endpoints.AUTH.USER}?search=${sessionUser.email}&select=authUser`);
     if(!response || !response.success) return {user:null, session};
     const data = response.data?.data ?? [];
     if(!data || data.length === 0) return {user:undefined, session};
     const user = data[0];
     return {user, session};
}