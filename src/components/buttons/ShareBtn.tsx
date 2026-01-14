// "use client";

// import { Dialog, DialogDescription, DialogPanel } from "@headlessui/react";
// import { ReactNode, useState } from "react";

// export const ShareBtn = ({name, icon, shareTitle, className}: {name?:string, icon?:ReactNode, shareTitle: string, className?: string}) => {
//      const [open,setOpen] = useState(false);
//      const shareUrl = typeof window !== "undefined" ? window.location.href : "";
     
//      return (
//           <>
//                <button className={className}>{icon ?? null}{name ?? ""}</button>
//                {open ?
//                <Dialog open={open} onClose={() => setOpen(false)}>
//                     <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center ">
//                          <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[80vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
//                               <div className="w-full">

//                               </div>
//                          </DialogPanel >
//                     </div>
//                </Dialog>
//                : null}
//           </>
//      )
// }

"use client";

import { Dialog, DialogDescription, DialogPanel, DialogTitle } from "@headlessui/react";
import { ReactNode, useState } from "react";
import { 
  Share2, 
  X, 
  Facebook, 
  Linkedin, 
  Mail, 
  Copy, 
  Check,
  MessageCircle,
  Send,
  Instagram,
  Youtube
} from "lucide-react";

interface ShareOption {
  name: string;
  icon: ReactNode;
  color: string;
  getUrl: (url: string, title: string) => string;
  action?: (url: string, title: string) => void;
}

export const ShareBtn = ({
  name, 
  icon, 
  shareTitle, 
  className = ""
}: {
  name?: string;
  icon?: ReactNode;
  shareTitle: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "#25D366",
      getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "#0A66C2",
      getUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: "X (Twitter)",
      icon: <X className="w-5 h-5" />,
      color: "#000000",
      getUrl: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "#1877F2",
      getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5" />,
      color: "#26A5E4",
      getUrl: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5" />,
      color: "#EA4335",
      getUrl: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    },
    {
      name: copied ? "Copied!" : "Copy Link",
      icon: copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
      color: "#FCD34D",
      getUrl: () => "",
      action: handleCopy
    }
  ];

  const handleShare = (option: ShareOption) => {
    if (option.action) {
      option.action(shareUrl, shareTitle);
    } else {
      const url = option.getUrl(shareUrl, shareTitle);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className ? className :`inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95`}
        aria-label="Share"
      >
        {icon ?? <Share2 className="w-4 h-4" />}
        {name ?? "Share"}
      </button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 border-b border-gray-200">
              <DialogTitle className="text-xl font-bold text-black flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share this {shareTitle.toLowerCase()}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-800 mt-1">
                Choose a platform to share
              </DialogDescription>
            </div>

            {/* Share Options Grid */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleShare(option)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 group active:scale-95"
                    style={{
                      borderColor: option.name === "Copy Link" || option.name === "Copied!" ? "#FCD34D" : undefined
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* URL Preview */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Link to share:</p>
                <p className="text-sm text-gray-800 break-all font-mono">{shareUrl}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="w-full mt-4 px-4 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};