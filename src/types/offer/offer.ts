import { Prisma } from "@prisma/client";

// Public Offer Card - For public offers page and home page
export const SPublicOfferCard = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     visibility: true,
     contractType: true,
     createdAt: true,
     category: { select: { id: true, name: true } },
     company: { 
          select: { 
               id: true, 
               name: true, 
               handle: true, 
               logoUrl: true,
               verification: {
                    select: {
                         status: true,
                         isBronzeVerified: true,
                         isSilverVerified: true,
                         isGoldVerified: true,
                    }
               }
          } 
     },
     timeline: { 
          select: { 
               deadline: true, 
               startDate: true, 
               endDate: true, 
               duration: true, 
               durationUnit: true 
          } 
     },
     pricing: { 
          select: { 
               budgetMin: true, 
               budgetMax: true, 
               currency: true 
          } 
     },
     siteLocation: {
          select: {
               country: true,
               city: true,
               state: true,
          }
     },
     _count: { select: { interests: true } }
} satisfies Prisma.OfferSelect;
export type TPublicOfferCard = Prisma.OfferGetPayload<{select: typeof SPublicOfferCard}>;

// Company Offer Card - For company dashboard
export const SCompanyOfferCard = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     executionStatus: true,
     visibility: true,
     contractType: true,
     createdAt: true,
     updatedAt: true,
     category: { select: { id: true, name: true } },
     timeline: { 
          select: { 
               deadline: true, 
               startDate: true, 
               endDate: true 
          } 
     },
     pricing: { 
          select: { 
               budgetMin: true, 
               budgetMax: true, 
               currency: true 
          } 
     },
     _count: { select: { interests: true, invitations: true } }
} satisfies Prisma.OfferSelect;
export type TCompanyOfferCard = Prisma.OfferGetPayload<{select: typeof SCompanyOfferCard}>;

// Admin Offer Card - For admin dashboard
export const SAdminOfferCard = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     executionStatus: true,
     visibility: true,
     createdAt: true,
     updatedAt: true,
     category: { select: { id: true, name: true } },
     company: { 
          select: { 
               id: true, 
               name: true, 
               handle: true,
               logoUrl: true,
               verification: {
                    select: {
                         status: true
                    }
               }
          } 
     },
     timeline: { 
          select: { 
               deadline: true 
          } 
     },
     _count: { select: { interests: true, documents: true } }
} satisfies Prisma.OfferSelect;
export type TAdminOfferCard = Prisma.OfferGetPayload<{select: typeof SAdminOfferCard}>;

// Public Offer Detail Page - Full details for viewing
export const SPublicOfferDetail = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     visibility: true,
     contractType: true,
     scopeOfWork: true,
     specificTasks: true,
     requiredSkills: true,
     deliverables: true,
     technicalSpecifications: true,
     qualityStandards: true,
     safetyRequirements: true,
     requiredCertifications: true,
     createdAt: true,
     updatedAt: true,
     category: { select: { id: true, name: true } },
     company: { 
          select: { 
               id: true, 
               name: true, 
               handle: true, 
               logoUrl: true,
               email: true,
               phone: true,
               website: true,
               verification: {
                    select: {
                         status: true,
                         isBronzeVerified: true,
                         isSilverVerified: true,
                         isGoldVerified: true,
                    }
               }
          } 
     },
     user: {
          select: {
               id:true, name:true, email:true, phone:true, image:true
          }
     },
     project: {
          select: {
               id: true,
               title: true,
               description: true,
               phase: true,
               clientName: true,
               location: {
                    select: {
                         country: true,
                         city: true,
                         state: true,
                         address: true,
                    }
               }
          }
     },
     siteLocation: {
          select: {
               country: true,
               city: true,
               state: true,
               zipCode: true,
               address: true,
          }
     },
     timeline: { 
          select: { 
               id: true,
               deadline: true, 
               startDate: true, 
               endDate: true, 
               duration: true, 
               durationUnit: true 
          } 
     },
     pricing: { 
          select: { 
               id: true,
               budgetMin: true, 
               budgetMax: true, 
               currency: true,
               paymentTerms: true,
               paymentMethods: true,
          } 
     },
     submissionInfo: {
          select: {
               id: true,
               proposalFormat: true,
               submissionGuidelines: true,
               contactEmail: true,
               contactPhone: true,
               expiresAt: true,
               autoClose: true,
          }
     },
     documents: {
          select: {
               id: true,
               type: true,
               url: true,
               description: true,
               fileType: true,
               fileSize: true,
               accessLevel: true,
               uploadedAt: true,
          },
          where: {
               accessLevel: {
                    in: ["PUBLIC", "INTERESTED_ONLY"]
               }
          }
     },
     _count: { select: { interests: true } }
} satisfies Prisma.OfferSelect;
export type TPublicOfferDetail = Prisma.OfferGetPayload<{select: typeof SPublicOfferDetail}>;

// Company Offer Detail - Full details with private documents
export const SCompanyOfferDetail = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     executionStatus: true,
     visibility: true,
     contractType: true,
     scopeOfWork: true,
     specificTasks: true,
     requiredSkills: true,
     deliverables: true,
     technicalSpecifications: true,
     qualityStandards: true,
     safetyRequirements: true,
     requiredCertifications: true,
     createdAt: true,
     updatedAt: true,
     category: { select: { id: true, name: true } },
     company: { 
          select: { 
               id: true, 
               name: true, 
               handle: true, 
          } 
     },
     project: {
          select: {
               id: true,
               title: true,
               description: true,
               phase: true,
               clientName: true,
               clientEmail: true,
               clientPhone: true,
               location: {
                    select: {
                         country: true,
                         city: true,
                         state: true,
                         address: true,
                         zipCode: true,
                    }
               }
          }
     },
     siteLocation: {
          select: {
               id: true,
               country: true,
               city: true,
               state: true,
               zipCode: true,
               address: true,
          }
     },
     timeline: { 
          select: { 
               id: true,
               deadline: true, 
               startDate: true, 
               endDate: true, 
               duration: true, 
               durationUnit: true 
          } 
     },
     pricing: { 
          select: { 
               id: true,
               budgetMin: true, 
               budgetMax: true, 
               currency: true,
               paymentTerms: true,
               paymentMethods: true,
          } 
     },
     submissionInfo: {
          select: {
               id: true,
               proposalFormat: true,
               submissionGuidelines: true,
               contactEmail: true,
               contactPhone: true,
               expiresAt: true,
               autoClose: true,
          }
     },
     documents: {
          select: {
               id: true,
               type: true,
               url: true,
               description: true,
               fileType: true,
               fileSize: true,
               accessLevel: true,
               uploadedAt: true,
               downloadCount: true,
          }
     },
     interests: {
          select: {
               id: true,
               status: true,
               message: true,
               viewedByOwner: true,
               createdAt: true,
               company: {
                    select: {
                         id: true,
                         name: true,
                         handle: true,
                         logoUrl: true,
                         email: true,
                         phone: true,
                    }
               }
          },
          orderBy: { createdAt: "desc" }
     },
     invitations: {
          select: {
               id: true,
               status: true,
               message: true,
               reply: true,
               viewed: true,
               sentAt: true,
               respondedAt: true,
               company: {
                    select: {
                         id: true,
                         name: true,
                         handle: true,
                    }
               }
          },
          orderBy: { sentAt: "desc" }
     },
     _count: { select: { interests: true, invitations: true } }
} satisfies Prisma.OfferSelect;
export type TCompanyOfferDetail = Prisma.OfferGetPayload<{select: typeof SCompanyOfferDetail}>;

// Admin Offer Detail - Full details for admin management
export const SAdminOfferDetail = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     executionStatus: true,
     visibility: true,
     contractType: true,
     scopeOfWork: true,
     specificTasks: true,
     requiredSkills: true,
     deliverables: true,
     technicalSpecifications: true,
     qualityStandards: true,
     safetyRequirements: true,
     requiredCertifications: true,
     createdAt: true,
     updatedAt: true,
     deletedAt: true,
     category: { select: { id: true, name: true } },
     company: { 
          select: { 
               id: true, 
               name: true, 
               handle: true, 
               email: true,
               phone: true,
               logoUrl: true,
               verification: {
                    select: {
                         status: true,
                         isBronzeVerified: true,
                         isSilverVerified: true,
                         isGoldVerified: true,
                    }
               }
          } 
     },
     project: {
          select: {
               id: true,
               title: true,
               description: true,
               phase: true,
               clientName: true,
          }
     },
     siteLocation: {
          select: {
               country: true,
               city: true,
               state: true,
               zipCode: true,
               address: true,
          }
     },
     timeline: { 
          select: { 
               deadline: true, 
               startDate: true, 
               endDate: true, 
               duration: true, 
               durationUnit: true 
          } 
     },
     pricing: { 
          select: { 
               budgetMin: true, 
               budgetMax: true, 
               currency: true,
               paymentTerms: true,
               paymentMethods: true,
          } 
     },
     submissionInfo: {
          select: {
               proposalFormat: true,
               submissionGuidelines: true,
               contactEmail: true,
               contactPhone: true,
               expiresAt: true,
               autoClose: true,
          }
     },
     documents: {
          select: {
               id: true,
               type: true,
               url: true,
               description: true,
               fileType: true,
               fileSize: true,
               accessLevel: true,
               uploadedAt: true,
               downloadCount: true,
          }
     },
     _count: { select: { interests: true, invitations: true, documents: true } }
} satisfies Prisma.OfferSelect;
export type TAdminOfferDetail = Prisma.OfferGetPayload<{select: typeof SAdminOfferDetail}>;

export const SOfferEdit = {
     id: true,
     title: true,
     description: true,
     type: true,
     priority: true,
     status: true,
     executionStatus: true,
     visibility: true,
     contractType: true,
     categoryId: true,
     scopeOfWork: true,
     specificTasks: true,
     requiredSkills: true,
     deliverables: true,
     technicalSpecifications: true,
     qualityStandards: true,
     safetyRequirements: true,
     requiredCertifications: true,
     category: { select: { id: true, name: true } },
     project: {
          select: {
               id: true,
               title: true,
               description: true,
               phase: true,
               clientName: true,
               clientEmail: true,
               clientPhone: true,
               initiatedOn: true,
               location: {
                    select: {
                         country: true,
                         city: true,
                         state: true,
                         zipCode: true,
                         address: true,
                    }
               }
          }
     },
     siteLocation: {
          select: {
               id: true,
               country: true,
               city: true,
               state: true,
               zipCode: true,
               address: true,
          }
     },
     timeline: {
          select: {
               id: true,
               startDate: true,
               endDate: true,
               deadline: true,
               duration: true,
               durationUnit: true,
          }
     },
     pricing: {
          select: {
               id: true,
               budgetMin: true,
               budgetMax: true,
               currency: true,
               paymentTerms: true,
               paymentMethods: true,
          }
     },
     submissionInfo: {
          select: {
               id: true,
               proposalFormat: true,
               submissionGuidelines: true,
               contactEmail: true,
               contactPhone: true,
               expiresAt: true,
               autoClose: true,
          }
     },
     documents: {
          select: {
               id: true,
               type: true,
               url: true,
               description: true,
               fileType: true,
               fileSize: true,
               accessLevel: true,
          }
     },
} satisfies Prisma.OfferSelect;
export type TOfferEdit = Prisma.OfferGetPayload<{select: typeof SOfferEdit}>;