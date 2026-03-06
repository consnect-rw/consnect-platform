import { Prisma } from "@prisma/client";

export const SOfferInterest = { 
     id: true,

} satisfies Prisma.OfferInterestSelect;
export type TOfferInterest = Prisma.OfferInterestGetPayload<{select:typeof SOfferInterest}>;

// Received interest card - for the offer owner (company reviewing who's interested)
export const SReceivedOfferInterest = {
     id: true,
     status: true,
     message: true,
     viewedByOwner: true,
     shortlistedAt: true,
     respondedAt: true,
     createdAt: true,
     updatedAt: true,
     company: {
          select: {
               id: true,
               name: true,
               handle: true,
               logoUrl: true,
               email: true,
               phone: true,
               foundedYear: true,
               companySize: true,
               slogan: true,
               location: {
                    select: { country: true, city: true, state: true }
               },
               verification: {
                    select: { status: true, isBronzeVerified: true, isSilverVerified: true, isGoldVerified: true }
               },
               specializations: {
                    select: { name: true, category: { select: { name: true } } }
               }
          }
     },
     offer: {
          select: {
               id: true,
               title: true,
               status: true,
               executionStatus: true,
               type: true,
               category: { select: { id: true, name: true } },
          }
     },
} satisfies Prisma.OfferInterestSelect;
export type TReceivedOfferInterest = Prisma.OfferInterestGetPayload<{select: typeof SReceivedOfferInterest}>;

// Sent interest card - for the interested company tracking their submissions
export const SSentOfferInterest = {
     id: true,
     status: true,
     message: true,
     viewedByOwner: true,
     respondedAt: true,
     createdAt: true,
     updatedAt: true,
     offer: {
          select: {
               id: true,
               title: true,
               type: true,
               priority: true,
               status: true,
               executionStatus: true,
               category: { select: { id: true, name: true } },
               company: {
                    select: {
                         id: true,
                         name: true,
                         handle: true,
                         logoUrl: true,
                         verification: {
                              select: { status: true, isBronzeVerified: true, isSilverVerified: true, isGoldVerified: true }
                         }
                    }
               },
               timeline: { select: { deadline: true } },
               pricing: { select: { budgetMin: true, budgetMax: true, currency: true } },
               siteLocation: { select: { country: true, city: true } },
          }
     },
} satisfies Prisma.OfferInterestSelect;
export type TSentOfferInterest = Prisma.OfferInterestGetPayload<{select: typeof SSentOfferInterest}>;

// Lightweight select for CompanyViewDrawer
export const SCompanyDrawerView = {
     id: true,
     name: true,
     handle: true,
     logoUrl: true,
     email: true,
     phone: true,
     website: true,
     foundedYear: true,
     companySize: true,
     slogan: true,
     partnerInterests: true,
     location: {
          select: { country: true, city: true, state: true, address: true }
     },
     verification: {
          select: { status: true, isBronzeVerified: true, isSilverVerified: true, isGoldVerified: true }
     },
     specializations: {
          select: { name: true, category: { select: { name: true } } }
     },
     descriptions: {
          select: { title: true, description: true },
          where: { title: "Overview" }
     },
     services: {
          select: { name: true, description: true },
          take: 6,
     },
     contactPersons: {
          select: { name: true, role: true, contactEmail: true, contactPhone: true },
          take: 3,
     },
} satisfies Prisma.CompanySelect;
export type TCompanyDrawerView = Prisma.CompanyGetPayload<{select: typeof SCompanyDrawerView}>;