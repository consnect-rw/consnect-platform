import { SocialMediaLinks } from "@/lib/data/social-media";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

export default function Footer () {
     return (
          <footer className="w-full py-8 bg-yellow-900 text-white flex flex-col gap-8">
               <div className="w-full max-w-7xl mx-auto flex items-center justify-between flex-wrap">
                    <Image src={"/logo/consnect-rb.png"} width={200} height={100} className="w-24 rounded-lg object-cover bg-gray-200" alt="consnect"  />
                    <div className="flex items-center gap-4">
                         <Link target="_blank" className="text-gray-200" title="Consnect Facebook"  href={SocialMediaLinks.facebook}><FaFacebook size={22} /></Link>
                         <Link target="_blank" className="text-gray-200" title="Consnect Twitter" href={SocialMediaLinks.twitter}><FaXTwitter size={22} /></Link>
                         <Link target="_blank" className="text-gray-200" title="Consnect Instagram" href={SocialMediaLinks.instagram}><FaInstagram size={22} /></Link>
                         <Link target="_blank" className="text-gray-200" title="whatsapp channel" href={SocialMediaLinks.whatsappChannel}><FaWhatsapp size={22} /></Link>
                    </div>
               </div>
               <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="w-full flex flex-col gap-4">
                         <h4 className="text-xl font-bold text-white">Company</h4>
                         <div className="flex flex-col gap-2 w-19/20 mx-auto">
                              <FooterLink name="About" href="/about" />
                              <FooterLink name="FAQS" href="/faqs" />
                              <FooterLink name="How To" href="/get-started" />
                         </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                         <h4 className="text-xl font-bold text-white">Resources</h4>
                         <div className="flex flex-col gap-2 w-19/20 mx-auto">
                              <FooterLink name="Tenders" href="/tender" />
                              <FooterLink name="Offers" href="/offer" />
                              <FooterLink name="Companies" href="/company" />
                              <FooterLink name="Register " href="/auth/register" />
                         </div>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                         <h4 className="text-xl font-bold text-white">Address</h4>
                         <div className="flex flex-col gap-2 w-19/20 mx-auto">
                              <FooterLink name="Contact Us" href="/contact" />
                              <span className="text-gray-200 font-medium text-sm">Location: Rwanda, Kigali - Kimironko</span>
                              <span className="text-gray-200 font-medium text-sm">Phone: +250 789 407 079</span>
                              <span className="text-gray-200 font-medium text-sm">Email: info@consnect.com</span>
                         </div>
                    </div>
               </div>
               <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-center lg:justify-between">
                    <p className="text-gray-200 font-medium text-sm">All rights reserved &copy; {new Date().getFullYear()}</p>
                    <div className="flex items-center justify-center gap-4">
                         <FooterLink name="Terms & Conditions"  href="/terms"/>
                         <FooterLink name="Privacy Policy"  href="/privacy"/>
                    </div>
               </div>
          </footer>
     )
}

const FooterLink = ({name, href} : {name:string, href: string}) => (
     <Link href={href} className="text-gray-200 font-medium text-sm hover:text-white transition-all duration-200">{name}</Link>
)