"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createInterestAttachment(data: Prisma.InterestAttachmentCreateInput) {
     try {
          const res = await prisma.interestAttachment.create({ data });
          if (res) revalidatePages();
          return res;
     } catch (error) {
          console.error("Error creating InterestAttachment:", error);
          return null;
     }
}

export async function deleteInterestAttachment(id: string) {
     try {
          const res = await prisma.interestAttachment.delete({ where: { id } });
          if (res) revalidatePages();
          return res;
     } catch (error) {
          console.error("Error deleting InterestAttachment id:", id, error);
          return null;
     }
}

export const fetchInterestAttachments = cache(
     async <T extends Prisma.InterestAttachmentSelect>(
          selectType: T,
          search?: Prisma.InterestAttachmentWhereInput,
          take = 50,
          skip = 0,
     ): Promise<{ data: Prisma.InterestAttachmentGetPayload<{ select: T }>[]; pagination: { total: number } }> => {
          try {
               const data = await prisma.interestAttachment.findMany({
                    where: search,
                    take,
                    skip,
                    select: selectType,
                    orderBy: { uploadedAt: "desc" },
               });
               const total = await prisma.interestAttachment.count({ where: search });
               return { data, pagination: { total } };
          } catch (error) {
               console.error("Error fetching InterestAttachments:", error);
               return { data: [], pagination: { total: 0 } };
          }
     },
);
