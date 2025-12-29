import { Prisma } from "@prisma/client"
import { IDefaultCategory } from "../common/category"
import { IBaseDocument, IDocumentCreate } from "../common/document"

export interface IDefaultService {
     id:string
     name:string
}

export interface IBaseService {
     id:string
     name:string
     description: string
     category: IDefaultCategory
     certifications: IBaseDocument[]
}

export interface IServiceCreate {
     name:string
     description: string
     certifications?:{createMany: {data: IDocumentCreate[]}}
     category: {connect:{id:string}}
     company?:{connect:{id:string}}
}

export interface IServiceUpdate {
     name?: string
     description?:string
     certifications?: {
          create?: IDocumentCreate[];
          update?: {
               where: { id: string };
               data: Partial<IDocumentCreate>;
          }[];
          deleteMany?: { id: string }[];
          delete?: { id: string }[];
          connect?: { id: string }[];
          disconnect?: { id: string }[];
     };
}

export const SService = {
     id:true, name:true, description:true, createdAt:true,
     category: {select:{id:true, name:true}},
     certifications:{select:{title:true, docUrl:true, type:true, }}
} satisfies Prisma.ServiceSelect;
export type TService = Prisma.ServiceGetPayload<{select: typeof SService}>