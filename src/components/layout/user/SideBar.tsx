"use client";

import { AuthLogoutBtn } from "@/components/forms/AuthForms";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/hooks/useAuth";
import { UserNavLinks } from "@/lib/data/user/user-nav-links";
import { cn } from "@/lib/utils";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Cog, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons/lib";

export function UserSideBar () {
     const {user} = useAuth();
     return (
          <aside className="w-full h-full rounded-xl flex flex-col gap-8 bg-white p-2">
               <div className="w-full flex items-start gap-4 border border-gray-300/50 rounded-lg p-2">
                    <UserAvatar size="sm" className="rounded-full" email={user?.name ?? user?.email ?? "User"}  />
                    <div className="flex flex-col gap-1">
                         <h3 className="text-sm font-bold text-gray-800 ">{user?.name ?? user?.email}</h3>
                         <p className="text-xs text-gray-600">{user?.company?.name ?? "Unknown Company"}</p>
                    </div>
               </div>
               <div className="flex flex-col w-full h-full justify-between">
                    <nav className="flex flex-col gap-4 w-full items-start justify-start px-2">
                         {
                              UserNavLinks.map((link, index) => <NavLink link={link} key={`user-nav-link-${index}`} />)
                         }
                    </nav>
                    <div className="w-full flex flex-col gap-4 items-start ">
                         <AuthLogoutBtn name="Logout" icon={<LogOut className="w-4 h-4 text-gray-200" />} className="bg-linear-to-bl from-yellow-600 to-amber-600 hover:from-yellow-800 hover:to-amber-800 text-gray-50 cursor-pointer hover:bg-gray-200 w-full flex items-center gap-2 justify-start font-medium text-base py-3" />
                    </div>
               </div>
          </aside>
     )
}

interface INavLinkProps {
     link: {
          name:string 
          href: string
          icon: IconType
     }
     count?: number,
     onClick?:() => void
}

const NavLink = ({link, count, onClick}: INavLinkProps) => {
     const pathname = usePathname();
     const isActive = link.href === pathname;
     const Icon = link.icon;
     return (
          <Link 
               onClick={onClick}
               prefetch
               className={cn("w-full flex items-center gap-2 py-2 px-4 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-200", isActive ? "bg-linear-to-bl from-yellow-600 to-amber-600 hover:from-yellow-800 hover:to-amber-800 text-gray-50 " : "" )}
               href={link.href}
          >
               <Icon className={cn("w-5 h-5 text-gray-600", isActive ? "text-gray-200" :"")} />
               {link.name} 
               {count && count > 0 ?<span>{count}</span> :null}
          </Link>
     )
}

export const UserMobileTopBar = () => {
     const [showMenu, setShowMenu] = useState(false);
     const {user} = useAuth()
     return (
          <div className="w-full flex lg:hidden items-center justify-between">
               <div className="flex items-center gap-2">
                    <span onClick={() => setShowMenu(true)} className="rounded-lg p-2 bg-linear-to-bl from-yellow-600 to-amber-600" ><Menu className="w-5 h-5 text-gray-50" /></span>
                    <h3 className="text-gray-800 font-extrabold text-xl">Consnect</h3>
               </div>
               <div className="flex gap-2">
                    <UserAvatar email={user?.name ?? "User"} />
               </div>
               <Dialog onClose={() => setShowMenu(false)} open={showMenu}>
               <div className=" fixed inset-0 z-50 bg-black/50 bg-opacity-30 flex justify-start items-start ">
                    <DialogPanel className="bg-transparent w-64 h-dvh ">
                         <aside className="w-full h-full flex flex-col gap-8 bg-white p-2">
                              <div className="w-full flex items-start gap-4 border border-gray-300/50 rounded-lg p-2">
                                   <UserAvatar size="sm" className="rounded-full" email={user?.name ?? user?.email ?? "User"}  />
                                   <div className="flex flex-col gap-1">
                                        <h3 className="text-sm font-bold text-gray-800 ">{user?.name ?? user?.email}</h3>
                                        <p className="text-xs text-gray-600">{user?.company?.name ?? "Unknown Company"}</p>
                                   </div>
                              </div>
                              <div className="flex flex-col w-full h-full justify-between">
                                   <nav className="flex flex-col gap-4 w-full items-start justify-start px-2">
                                        {
                                             UserNavLinks.map((link, index) => <NavLink onClick={() => setShowMenu(false)} link={link} key={`user-nav-link-${index}`} />)
                                        }
                                   </nav>
                                   <div className="w-full flex flex-col gap-4 items-start ">
                                        <AuthLogoutBtn name="Logout" icon={<LogOut className="w-4 h-4 text-gray-200" />} className="bg-linear-to-br from-gray-600 to-gray-800 cursor-pointer hover:bg-gray-200 w-full flex items-center gap-2 justify-start text-white font-medium text-base py-3" />
                                   </div>
                              </div>
                         </aside>
                    </DialogPanel >
               </div>
          </Dialog>
          </div>
     )
}