import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserAvatarProps = {
  email: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const UserAvatar = ({ 
     email, 
     imageUrl, 
     size = "md",
     className = "" 
}: UserAvatarProps) => {
  
  // Get first letter of email
  const fallbackLetter = email?.charAt(0).toUpperCase() || "?";
  
  // Generate a consistent color based on email
  const getColorFromEmail = (email: string): string => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      "bg-red-500",
      "bg-orange-500", 
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500"
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };
  
  const bgColor = getColorFromEmail(email);
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={imageUrl || undefined} alt={email} />
      <AvatarFallback className={`${bgColor} text-white font-semibold`}>
        {fallbackLetter}
      </AvatarFallback>
    </Avatar>
  );
};