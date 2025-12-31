"use client";

import { ShieldUser, Users } from "lucide-react";
import AdminPageNavBar from "./PageNavBar";

const links = [
     {name:"Users", href:"/admin/users", icon: Users},
     {name:"Admins", href:"/admin/users/admins", icon: ShieldUser},
]

export const AdminUsersNavBar = () => {
     return <AdminPageNavBar links={links} />
}