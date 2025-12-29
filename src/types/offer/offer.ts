import { Prisma } from "@prisma/client";

export const SUserOffer = {
     id:true, title:true, description:true,
     _count: {select: {interests: true}}
} satisfies Prisma.OfferSelect;
export type TUserOffer = Prisma.OfferGetPayload<{select: typeof SUserOffer}>