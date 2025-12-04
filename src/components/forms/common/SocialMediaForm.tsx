"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISocialMediaCreate } from "@/types/common/social-media";
import { ExternalLink, Facebook, Instagram, Linkedin, LinkIcon, Plus, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { IconType } from "react-icons/lib";

interface ISocialMediaFormProps {
     companyId?:string
     onSubmit: (res: ISocialMediaCreate) => void 
}

// export default function SocialMediaForm({companyId, onSubmit}:ISocialMediaFormProps) {
//      const [media, setMedia] = useState<ISocialMediaCreate>({});

//      const submit = () => {
//           return onSubmit(
//                {...media, ...(companyId ? {company:{connect:{id:companyId}}}: {})}
//           );
//      }

//      return (
//           <div className=""></div>
//      )
// }

interface IPlatform {
     label:string 
     icon: IconType
     placeholder: string
     color: string
}

const platforms = {
     facebook: {
          label: 'Facebook', 
          icon: Facebook, 
          placeholder: 'facebook.com/your-page',
          color: 'text-blue-600'
     },
     twitter: {
          label: 'Twitter', 
          icon: Twitter, 
          placeholder: 'twitter.com/your-handle',
          color: 'text-sky-500'
     },
     linkedIn: {
          label: 'LinkedIn', 
          icon: Linkedin, 
          placeholder: 'linkedin.com/company/your-company',
          color: 'text-blue-700'
     },
     instagram: {
          label: 'Instagram', 
          icon: Instagram, 
          placeholder: 'instagram.com/your-profile',
          color: 'text-pink-600'
     },
     youtube:{
          label: 'YouTube', 
          icon: Youtube, 
          placeholder: 'youtube.com/@your-channel',
          color: 'text-red-600'
     }
};

interface ISocialMediaLinkInputProps {
     key: string
     platform: IPlatform
     isFocused: boolean
     hasValue: boolean
     onUpdate: (res:string) => void
     onFocus: () => void
     onBlur: () => void

}

const SocialMediaLinkInput = ({key, isFocused,platform, hasValue,onUpdate, onFocus,onBlur}:ISocialMediaLinkInputProps) => {
     const Icon = platform.icon;
     return (
          <div  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${ isFocused  ? 'border-amber-500 bg-amber-50/50 shadow-sm'  : hasValue ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`} >
               <div className={`flex-shrink-0 ${platform.color}`}>
                    <Icon className="w-5 h-5" />
               </div>
               {/* Label */}
               <div className="hidden sm:block w-24 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">
                    {platform.label}
                    </span>
               </div>
               
               {/* Input Field */}
               <Input
                    placeholder={platform.placeholder}
                    value={key}
                    onChange={(e) => onUpdate(e.target.value)}
                    onFocus={() => onFocus()}
                    onBlur={() => onBlur()}
                    className="text-sm"
                    required={false}
               />
          </div>
     )
}


export default function SocialMediaForm({ companyId, onSubmit }:ISocialMediaFormProps) {
     const [media, setMedia] = useState<ISocialMediaCreate>({});
     const [focusedField, setFocusedField] = useState("");

     const submit = () => {
          return onSubmit(
               {...media, ...(companyId ? {company: {connect: {id: companyId}}} : {})}
          );
     };

     return (
          <div className="p-5 bg-gradient-to-br from-white to-amber-50/30 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
               {/* Header */}
               <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
               <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-sm">
               <ExternalLink className="w-5 h-5 text-white" />
               </div>
               <div>
               <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
               <p className="text-xs text-gray-500">Connect your social profiles</p>
               </div>
               </div>

               {/* Social Media Fields */}
          
               <div className="space-y-3 mb-5">
                    <SocialMediaLinkInput 
                         key="facebook" 
                         platform={platforms.facebook} 
                         isFocused={focusedField === "facebook"} 
                         hasValue={media.facebook !== undefined} 
                         onUpdate={res => setMedia(prev => ({...prev, facebook: res}))}
                         onFocus={() => setFocusedField("facebook")}
                         onBlur={() => setFocusedField("")}
                    />
                    <SocialMediaLinkInput 
                         key="twitter" 
                         platform={platforms.twitter} 
                         isFocused={focusedField === "twitter"} 
                         hasValue={media.twitter !== undefined} 
                         onUpdate={res => setMedia(prev => ({...prev, twitter: res}))}
                         onFocus={() => setFocusedField("twitter")}
                         onBlur={() => setFocusedField("")}
                    />
                    <SocialMediaLinkInput 
                         key="linkedIn" 
                         platform={platforms.linkedIn} 
                         isFocused={focusedField === "linkedIn"} 
                         hasValue={media.linkedIn !== undefined} 
                         onUpdate={res => setMedia(prev => ({...prev, linkedIn: res}))}
                         onFocus={() => setFocusedField("linkedIn")}
                         onBlur={() => setFocusedField("")}
                    />
                    <SocialMediaLinkInput 
                         key="instagram" 
                         platform={platforms.instagram} 
                         isFocused={focusedField === "instagram"} 
                         hasValue={media.instagram !== undefined} 
                         onUpdate={res => setMedia(prev => ({...prev, instagram: res}))}
                         onFocus={() => setFocusedField("instagram")}
                         onBlur={() => setFocusedField("")}
                    />
                    <SocialMediaLinkInput 
                         key="youtube" 
                         platform={platforms.youtube} 
                         isFocused={focusedField === "youtube"} 
                         hasValue={media.youtube !== undefined} 
                         onUpdate={res => setMedia(prev => ({...prev, youtube: res}))}
                         onFocus={() => setFocusedField("youtube")}
                         onBlur={() => setFocusedField("")}
                    />
               </div>

               {/* Submit Button */}
               <button type="button" onClick={submit}  className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all active:scale-95 w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Save Social Links</span>
               </button>
          </div>
     );
}