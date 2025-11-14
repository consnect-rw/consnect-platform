export interface INavLink {
     name: string
     href?: string
     target?: "_blank" | undefined
     subLinks?: {
          name: string
          href: string
     }[]
}