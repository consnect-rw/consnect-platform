import Image from "next/image"
import Link from "next/link";
import { CgMenuRightAlt } from "react-icons/cg";
import { Button } from "../ui/button";
import { NavLinks } from "@/lib/data/nav-links";

export default function Header () {
     return (
          <>
               <MobileView />
               <DesktopView />
          </>
     )
}

export const MobileView = () => {
     return (
          <header className="w-full bg-gradient-to-br from-gray-300 to-white flex items-center justify-between lg:hidden p-2 ">
               <LogoLink />
               <button aria-label="menu-button" type="button" className="bg-yellow-800 text-white shadow-none rounded-lg p-2 py-1"><CgMenuRightAlt size={28} className="" /></button>
          </header>
     )
}

export const DesktopView = () => {
     return (
          <header className="hidden lg:flex w-full bg-white px-2 py-2 ">
               <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                    <LogoLink />
                    <nav className="w-auto flex items-center gap-8">
                         {
                              NavLinks.map((link,index) => <Link prefetch className="text-black text-sm font-medium hover:text-yellow-800" href={link.href ?? "/"} key={`desktop-header-nav-link-${index}`}>{link.name}</Link>)
                         }
                    </nav>
                    <div className="w-auto flex items-ce gap-2">
                         <Link href={"/auth/login"} prefetch>
                              <Button type="button" variant={"ghost"} className="cursor-pointer rounded-full hover:bg-gray-200 font-medium">Sign In</Button>
                         </Link>
                         <Link href={"/auth/login"}>
                              <Button type="button" className="rounded-full text-white cursor-pointer bg-yellow-600 py-2 hover:bg-yellow-800">Get Started</Button>
                         </Link>
                    </div>
               </div>
          </header>
     )
}

const LogoLink = () => {
     return (
          <Link href="/" prefetch>
               <Image src={"/logo/consnect-rb.png"} width={200} height={200} alt="consnect logo" className="object-cover w-28 lg:w-32 aspect-[5/2] rounded-xl"  />
          </Link>
     )
} 

