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
          <aside className="w-full h-full rounded-2xl flex flex-col gap-2 bg-white border border-gray-200/70 shadow-sm p-3 overflow-hidden">
               {/* Brand */}
               <div className="flex items-center gap-2 px-2 pt-1 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm shrink-0">
                         <span className="text-gray-900 font-black text-sm leading-none">C</span>
                    </div>
                    <span className="font-black text-gray-900 text-lg tracking-tight leading-none">Consnect</span>
               </div>

               {/* User card */}
               <div className="w-full flex items-center gap-3 bg-gray-50/80 border border-gray-200/70 rounded-xl p-2.5">
                    <UserAvatar size="sm" className="rounded-full ring-2 ring-white shadow-sm" email={user?.name ?? user?.email ?? "User"}  />
                    <div className="flex flex-col gap-0.5 min-w-0">
                         <h3 className="text-sm font-bold text-gray-900 truncate">{user?.name ?? user?.email}</h3>
                         <p className="text-xs text-gray-500 truncate">{user?.company?.name ?? "Unknown Company"}</p>
                    </div>
               </div>

               {/* Nav */}
               <div className="flex flex-col gap-1 mt-2 mb-1 px-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menu</span>
               </div>
                <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto w-full items-start justify-start">
                         {
                              UserNavLinks.map((link, index) => <NavLink link={link} key={`user-nav-link-${index}`} />)
                         }
                    </nav>
               <div className="flex flex-col w-full justify-between pt-2 border-t border-gray-100">
                    <div className="w-full flex flex-col gap-4 items-start ">
                         <AuthLogoutBtn name="Logout" icon={<LogOut className="w-4 h-4 text-gray-200" />} className="bg-linear-to-bl from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-gray-50 cursor-pointer shadow-sm w-full flex items-center gap-2 justify-start font-semibold text-sm py-2.5 rounded-xl transition-colors" />
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
               className={cn(
                    "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                         ? "bg-linear-to-r from-amber-500 to-yellow-500 text-white shadow-sm shadow-amber-200"
                         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
               )}
               href={link.href}
          >
               <span className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors", isActive ? "bg-white/20" : "bg-gray-100")}>
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500")} />
               </span>
               <span className="truncate">{link.name}</span>
               {count && count > 0 ? <span className="ml-auto text-xs bg-white/25 rounded-full px-2 py-0.5">{count}</span> : null}
          </Link>
     )
}

export const UserMobileTopBar = () => {
     const [showMenu, setShowMenu] = useState(false);
     const {user} = useAuth()
     return (
          <div className="w-full flex lg:hidden items-center justify-between bg-white border border-gray-200/70 rounded-xl shadow-sm px-3 py-2.5">
               <div className="flex items-center gap-2.5">
                    <span onClick={() => setShowMenu(true)} className="rounded-lg p-2 bg-linear-to-bl from-yellow-500 to-amber-600 shadow-sm cursor-pointer" ><Menu className="w-5 h-5 text-white" /></span>
                    <h3 className="text-gray-900 font-black text-lg tracking-tight">Consnect</h3>
               </div>
               <div className="flex gap-2">
                    <UserAvatar email={user?.name ?? "User"} />
               </div>
               <Dialog onClose={() => setShowMenu(false)} open={showMenu}>
               <div className=" fixed inset-0 z-50 bg-black/50 bg-opacity-30 flex justify-start items-start ">
                    <DialogPanel className="bg-transparent w-72 h-dvh ">
                         <aside className="w-full h-full flex flex-col gap-4 bg-white p-3">
                              <div className="flex items-center gap-2 px-1 pt-1 pb-1">
                                   <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm shrink-0">
                                        <span className="text-gray-900 font-black text-sm leading-none">C</span>
                                   </div>
                                   <span className="font-black text-gray-900 text-lg tracking-tight leading-none">Consnect</span>
                              </div>
                              <div className="w-full flex items-center gap-3 bg-gray-50/80 border border-gray-200/70 rounded-xl p-2.5">
                                   <UserAvatar size="sm" className="rounded-full ring-2 ring-white shadow-sm" email={user?.name ?? user?.email ?? "User"}  />
                                   <div className="flex flex-col gap-0.5 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{user?.name ?? user?.email}</h3>
                                        <p className="text-xs text-gray-500 truncate">{user?.company?.name ?? "Unknown Company"}</p>
                                   </div>
                              </div>
                              <div className="flex flex-col w-full h-full justify-between min-h-0">
                                   <nav className="flex flex-col gap-1 w-full items-start justify-start overflow-y-auto">
                                        {
                                             UserNavLinks.map((link, index) => <NavLink onClick={() => setShowMenu(false)} link={link} key={`user-nav-link-${index}`} />)
                                        }
                                   </nav>
                                   <div className="w-full flex flex-col gap-4 items-start pt-2 border-t border-gray-100">
                                        <AuthLogoutBtn name="Logout" icon={<LogOut className="w-4 h-4 text-gray-200" />} className="bg-linear-to-br from-gray-700 to-gray-900 cursor-pointer w-full flex items-center gap-2 justify-start text-white font-semibold text-sm py-2.5 rounded-xl" />
                                   </div>
                              </div>
                         </aside>
                    </DialogPanel >
               </div>
          </Dialog>
          </div>
     )
}