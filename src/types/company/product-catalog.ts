import { Prisma } from "@prisma/client"

export interface IDefaultProductCatalog {
     id:string
     name:string
     image:string
}

export interface IBaseProductCatalog {
     id:string
     name:string
     description:string
     image:string
     fileUrl:string
     createdAt: Date
     updatedAt: Date
}

export interface IProductCatalogCreate {
     name:string
     description:string
     image:string
     fileUrl:string
     company?: {connect:{id:string}}
}

export interface IProductCatalogUpdate {
     name?:string
     description?:string
     image?:string
     fileUrl?:string
}

export const SProductCatalog = {
     id:true, name:true, description:true, image:true, fileUrl:true
} satisfies Prisma.ProductCatalogSelect;
export type TProductCatalog = Prisma.ProductCatalogGetPayload<{select: typeof SProductCatalog}>

export const SProductCatalogCard = {
     id: true,
     name: true,
     description: true,
     image: true,
     fileUrl: true,
     createdAt: true,
     company: {
          select: {
               id: true,
               name: true,
               handle: true,
               logoUrl: true,
               verification: {
                    select: { status: true, isGoldVerified: true, isSilverVerified: true, isBronzeVerified: true }
               },
               location: { select: { country: true, city: true } },
          }
     },
} satisfies Prisma.ProductCatalogSelect;
export type TProductCatalogCard = Prisma.ProductCatalogGetPayload<{select: typeof SProductCatalogCard}>