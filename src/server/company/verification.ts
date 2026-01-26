"use server";

import { prisma } from "@/config/prisma";
import { revalidatePages } from "../revalidate";

export interface CompletionPart {
  id: string;
  name: string;
  percentage: number;
  isComplete: boolean;
  missing: string[];
  description: string;
}

export interface BadgeInfo {
  name: string;
  earned: boolean;
  description: string;
}

export interface CompanyCompletionStatus {
  overallPercentage: number;
  parts: CompletionPart[];
  badges: {
    bronze: BadgeInfo;
    silver: BadgeInfo;
    gold: BadgeInfo;
  };
  nextStep: string;
  totalMissing: string[];
}

/**
 * Check company profile completion level and verification badges
 * @param companyId - The company ID to check
 * @returns CompanyCompletionStatus with detailed breakdown
 */
export const checkCompanyCompletion = async (
  companyId: string
): Promise<CompanyCompletionStatus> => {
  try {
    // Fetch complete company data with all relations
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        location: true,
        legal: true,
        specializations: true,
        descriptions: true,
        founders: true,
        services: true,
        projects: true,
        catalogs: true,
        contactPersons: true,
        verification: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const parts: CompletionPart[] = [];
    const allMissing: string[] = [];

    // ========== PART 1: BASIC INFORMATION ==========
    const basicMissing: string[] = [];
    if (!company.name) basicMissing.push("Company name");
    if (!company.phone) basicMissing.push("Phone number");
    if (!company.email) basicMissing.push("Email address");
    if (!company.foundedYear) basicMissing.push("Founded year");
    if (!company.companySize) basicMissing.push("Company size");
    if (!company.logoUrl) basicMissing.push("Logo");
    if (!company.location) basicMissing.push("Location/Address");

    const basicComplete = basicMissing.length === 0;
    const basicPercentage = basicComplete ? 100 : Math.round(((7 - basicMissing.length) / 7) * 100);

    parts.push({
      id: "basic",
      name: "Basic Information",
      percentage: basicPercentage,
      isComplete: basicComplete,
      missing: basicMissing,
      description:
        "Essential company details including name, contact info, logo, and location",
    });

    if (basicMissing.length > 0) {
      allMissing.push(...basicMissing.map((m) => `Basic Info: ${m}`));
    }

    // ========== PART 2: LEGAL VERIFICATION ==========
    const legalMissing: string[] = [];
    if (!company.legal) {
      legalMissing.push(
        "Legal information not added",
        "Legal name",
        "Trade name",
        "Registration number",
        "TIN",
        "Date of incorporation",
        "Legal structure"
      );
    } else {
      if (!company.legal.legalName) legalMissing.push("Legal name");
      if (!company.legal.tradeName) legalMissing.push("Trade name");
      if (!company.legal.registrationNumber) legalMissing.push("Registration number");
      if (!company.legal.tin) legalMissing.push("TIN");
      if (!company.legal.dateOfIncorporation) legalMissing.push("Date of incorporation");
      if (!company.legal.structure) legalMissing.push("Legal structure");
    }

    const legalComplete = legalMissing.length === 0;
    const legalPercentage = legalComplete
      ? 100
      : Math.round(((6 - legalMissing.length) / 6) * 100);

    parts.push({
      id: "legal",
      name: "Legal Verification",
      percentage: legalPercentage,
      isComplete: legalComplete,
      missing: legalMissing,
      description:
        "Legal information including registration details and company structure",
    });

    if (legalMissing.length > 0) {
      allMissing.push(...legalMissing.map((m) => `Legal: ${m}`));
    }

    // ========== PART 3: PROFESSIONAL VERIFICATION ==========
    const professionalMissing: string[] = [];
    if (!company.specializations || company.specializations.length === 0) {
      professionalMissing.push("Specializations/Categories");
    }

    const professionalComplete = professionalMissing.length === 0;
    const professionalPercentage = professionalComplete ? 100 : 0;

    parts.push({
      id: "professional",
      name: "Professional Verification",
      percentage: professionalPercentage,
      isComplete: professionalComplete,
      missing: professionalMissing,
      description: "Professional specializations and business categories",
    });

    if (professionalMissing.length > 0) {
      allMissing.push(...professionalMissing.map((m) => `Professional: ${m}`));
    }

    // ========== PART 4: PROFILE VERIFICATION ==========
    const profileMissing: string[] = [];
    const requiredDescriptions = ["Overview", "Mission", "Vision"];
    const existingDescriptions = company.descriptions.map((d) => d.title);

    requiredDescriptions.forEach((desc) => {
      if (!existingDescriptions.includes(desc)) {
        profileMissing.push(`${desc} description`);
      }
    });

    if (!company.descriptions.some((d) => d.title === "Detailed")) {
      profileMissing.push("Detailed description");
    }

    const profileComplete = profileMissing.length === 0;
    const profilePercentage = profileComplete
      ? 100
      : Math.round(
          ((4 - profileMissing.length) / 4) * 100
        );

    parts.push({
      id: "profile",
      name: "Profile Verification",
      percentage: profilePercentage,
      isComplete: profileComplete,
      missing: profileMissing,
      description:
        "Company descriptions including overview, mission, vision, and detailed information",
    });

    if (profileMissing.length > 0) {
      allMissing.push(...profileMissing.map((m) => `Profile: ${m}`));
    }

    // ========== PART 5: OWNERSHIP VERIFICATION ==========
    const ownershipMissing: string[] = [];
    if (!company.founders || company.founders.length === 0) {
      ownershipMissing.push("Founder(s) information");
    }

    const ownershipComplete = ownershipMissing.length === 0;
    const ownershipPercentage = ownershipComplete ? 100 : 0;

    parts.push({
      id: "ownership",
      name: "Ownership Verification",
      percentage: ownershipPercentage,
      isComplete: ownershipComplete,
      missing: ownershipMissing,
      description: "Founder(s) and ownership details",
    });

    if (ownershipMissing.length > 0) {
      allMissing.push(...ownershipMissing.map((m) => `Ownership: ${m}`));
    }

    // ========== PART 6: SERVICE VERIFICATION ==========
    const serviceMissing: string[] = [];
    if (!company.services || company.services.length === 0) {
      serviceMissing.push("Services provided");
    }

    const serviceComplete = serviceMissing.length === 0;
    const servicePercentage = serviceComplete ? 100 : 0;

    parts.push({
      id: "service",
      name: "Service Verification",
      percentage: servicePercentage,
      isComplete: serviceComplete,
      missing: serviceMissing,
      description: "Services and products offered by the company",
    });

    if (serviceMissing.length > 0) {
      allMissing.push(...serviceMissing.map((m) => `Service: ${m}`));
    }

    // ========== PART 7: OPTIONAL - PORTFOLIO & ADDITIONAL ==========
    const optionalMissing: string[] = [];
    const optionalChecks = [];

    if (!company.projects || company.projects.length === 0) {
      optionalMissing.push("Projects");
      optionalChecks.push(false);
    } else {
      optionalChecks.push(true);
    }

    if (!company.catalogs || company.catalogs.length === 0) {
      optionalMissing.push("Product catalogs");
      optionalChecks.push(false);
    } else {
      optionalChecks.push(true);
    }

    if (!company.contactPersons || company.contactPersons.length === 0) {
      optionalMissing.push("Contact persons");
      optionalChecks.push(false);
    } else {
      optionalChecks.push(true);
    }

    const optionalPercentage = Math.round(
      (optionalChecks.filter((c) => c).length / optionalChecks.length) * 100
    );

    parts.push({
      id: "optional",
      name: "Portfolio & Additional",
      percentage: optionalPercentage,
      isComplete: optionalMissing.length === 0,
      missing: optionalMissing,
      description: "Projects, product catalogs, and contact persons (optional but recommended)",
    });

    // ========== CALCULATE OVERALL PERCENTAGE ==========
    const overallPercentage = Math.round(
      parts.reduce((sum, part) => sum + part.percentage, 0) / parts.length
    );

    // ========== CHECK BADGES ==========
    // Badges are awarded by admins, not by system automation
    // The function returns the badge status as set by admins in the CompanyVerification model

    const badges = {
      bronze: {
        name: "Bronze Verified",
        earned: company.verification?.isBronzeVerified ?? false,
        description: "Basic information, legal verification, and professional verification complete",
      },
      silver: {
        name: "Silver Verified",
        earned: company.verification?.isSilverVerified ?? false,
        description: "All bronze requirements plus profile and ownership verification",
      },
      gold: {
        name: "Gold Verified",
        earned: company.verification?.isGoldVerified ?? false,
        description: "Complete profile with all required and optional sections",
      },
    };

    // ========== DETERMINE NEXT STEP ==========
    let nextStep = "";
    if (!basicComplete) {
      nextStep = "Complete your basic company information to get started";
    } else if (!legalComplete) {
      nextStep = "Add legal information to unlock legal verification badge";
    } else if (!professionalComplete) {
      nextStep = "Add your specializations to get professional verification";
    } else if (!profileComplete) {
      nextStep = "Complete company descriptions to earn profile verification";
    } else if (!ownershipComplete) {
      nextStep = "Add founder information for ownership verification";
    } else if (!serviceComplete) {
      nextStep = "Add your services to complete service verification";
    } else if (optionalMissing.length > 0) {
      nextStep = `Add projects, catalogs, or contact persons to earn Gold verification`;
    } else {
      nextStep = "Congratulations! Your profile is fully verified";
    }

    return {
      overallPercentage,
      parts,
      badges,
      nextStep,
      totalMissing: allMissing,
    };
  } catch (error) {
    console.error("Error checking company completion:", error);
    throw error;
  }
};

/**
 * Update company verification status (PENDING, VERIFIED, REJECTED)
 * @param companyId - The company ID
 * @param status - The verification status
 * @param message - Optional message for the company
 * @returns Updated verification record
 */
export const updateCompanyVerificationStatus = async (
  companyId: string,
  status: "PENDING" | "VERIFIED" | "REJECTED",
  message?: string
) => {
  try {
    // Check if verification record exists
    const existingVerification = await prisma.companyVerification.findUnique({
      where: { companyId },
    });

    let verification;
    if (existingVerification) {
      verification = await prisma.companyVerification.update({
        where: { companyId },
        data: {
          status,
          message: message || undefined,
        },
      });
    } else {
      verification = await prisma.companyVerification.create({
        data: {
          companyId,
          status,
          message: message || "",
        },
      });
    }

    revalidatePages();
    return { success: true, verification };
  } catch (error) {
    console.error("Error updating verification status:", error);
    return { success: false, error: "Failed to update verification status" };
  }
};

/**
 * Update company verification badge (Bronze, Silver, Gold)
 * @param companyId - The company ID
 * @param badgeType - The badge type to toggle
 * @param value - Boolean value to set
 * @returns Updated verification record
 */
export const updateCompanyVerificationBadge = async (
  companyId: string,
  badgeType: "bronze" | "silver" | "gold",
  value: boolean
) => {
  try {
    // Check if verification record exists
    const existingVerification = await prisma.companyVerification.findUnique({
      where: { companyId },
    });

    const fieldMap = {
      bronze: "isBronzeVerified",
      silver: "isSilverVerified",
      gold: "isGoldVerified",
    } as const;

    let verification;
    if (existingVerification) {
      verification = await prisma.companyVerification.update({
        where: { companyId },
        data: {
          [fieldMap[badgeType]]: value,
        },
      });
    } else {
      const createData: any = {
        companyId,
        status: "PENDING",
        message: "",
        [fieldMap[badgeType]]: value,
      };
      
      verification = await prisma.companyVerification.create({
        data: createData,
      });
    }

    revalidatePages();
    return { success: true, verification };
  } catch (error) {
    console.error("Error updating verification badge:", error);
    return { success: false, error: "Failed to update verification badge" };
  }
};

/**
 * Fetch company verification status
 * @param companyId - The company ID
 * @returns Verification record or null
 */
export const fetchCompanyVerification = async (companyId: string) => {
  try {
    const verification = await prisma.companyVerification.findUnique({
      where: { companyId },
    });
    return verification;
  } catch (error) {
    console.error("Error fetching verification:", error);
    return null;
  }
};
