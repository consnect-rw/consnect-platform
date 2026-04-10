export interface INavLink {
     name: string
     href?: string
     target?: "_blank" | undefined
     subLinks?: {
          name: string
          href: string
     }[]
     /** Enables mega-menu dropdown with server-fetched categories */
     megaKey?: "offers" | "tenders" | "companies"
}