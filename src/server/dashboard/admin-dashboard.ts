"use server";

import { cache } from "react";
import { prisma } from "@/config/prisma";

/**
 * Calculate percentage change between two values
 * Used for trend analysis in dashboard stats
 */
function calculateTrend(current: number, previous: number): { percentage: number; direction: string } {
  if (previous === 0) {
    return { percentage: current > 0 ? 100 : 0, direction: current > 0 ? "↑" : "→" };
  }
  const percentage = Math.round(((current - previous) / previous) * 100);
  const direction = percentage > 0 ? "↑" : percentage < 0 ? "↓" : "→";
  return { percentage: Math.abs(percentage), direction };
}

export const fetchAdminDashboardStats = cache(async (): Promise<{ name: string; value: string; comment?: string; trend?: string }[]> => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 1. Active Non-Admin Users
    const totalNonAdminUsers = await prisma.user.count({
      where: { role: "USER", active: true },
    });
    const usersWithCompanies = await prisma.user.count({
      where: {
        role: "USER",
        active: true,
        company: { isNot: null },
      },
    });
    const usersWithoutCompanies = totalNonAdminUsers - usersWithCompanies;

    // 2. Company Stats (total, status breakdown)
    const totalCompanies = await prisma.company.count();
    const pendingCompanies = await prisma.companyVerification.count({ where: { status: "PENDING" } });
    const verifiedCompanies = await prisma.companyVerification.count({ where: { status: "VERIFIED" } });
    const rejectedCompanies = await prisma.companyVerification.count({ where: { status: "REJECTED" } });

    // 3. Message Volume with Trend
    const messagesCurrentPeriod = await prisma.message.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });
    const messagesPreviousPeriod = await prisma.message.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    });
    const messageTrend = calculateTrend(messagesCurrentPeriod, messagesPreviousPeriod);

    // 4. Blog Stats (published, drafts, engagement)
    const publishedBlogs = await prisma.blog.count({
      where: { status: "PUBLISHED" },
    });
    const draftBlogs = await prisma.blog.count({
      where: { status: "DRAFT" },
    });
    const blogEngagement = await prisma.blogLike.count(); // Total likes as engagement proxy

    // 5. Offer Stats (total, acceptance rate)
    const totalOffers = await prisma.offer.count();
    const acceptedOffers = await prisma.offerInterest.count({
      where: { status: "ACCEPTED" },
    });
    const totalOfferInterests = await prisma.offerInterest.count();
    const acceptanceRate = totalOfferInterests > 0 ? Math.round((acceptedOffers / totalOfferInterests) * 100) : 0;

    // 6. Review Stats (average rating, total count)
    const reviews = await prisma.review.findMany({
      select: { rating: true },
    });
    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0";
    const totalReviews = reviews.length;

    // 7. Company Verification Status
    const bronzeVerified = await prisma.companyVerification.count({
      where: { isBronzeVerified: true },
    });
    const silverVerified = await prisma.companyVerification.count({
      where: { isSilverVerified: true },
    });
    const goldVerified = await prisma.companyVerification.count({
      where: { isGoldVerified: true },
    });
    const totalVerifications = await prisma.companyVerification.count();
    const completionPercentage = totalVerifications > 0 ? Math.round(((bronzeVerified + silverVerified + goldVerified) / (totalVerifications * 3)) * 100) : 0;

    // 8. Support Messages
    const totalSupportMessages = await prisma.supportMessage.count();
    const unreadSupportMessages = await prisma.supportMessage.count({
      where: { isRead: false },
    });
    const supportMessagesCurrentPeriod = await prisma.supportMessage.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });
    const supportMessagesPreviousPeriod = await prisma.supportMessage.count({
      where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    });
    const supportTrend = calculateTrend(supportMessagesCurrentPeriod, supportMessagesPreviousPeriod);

    return [
      {
        name: "Active Users",
        value: totalNonAdminUsers.toString(),
        comment: `${usersWithCompanies} with companies, ${usersWithoutCompanies} without`,
        trend: undefined,
      },
      {
        name: "Total Companies",
        value: totalCompanies.toString(),
        comment: `${verifiedCompanies} verified, ${pendingCompanies} pending, ${rejectedCompanies} rejected`,
        trend: undefined,
      },
      {
        name: "Platform Messages",
        value: messagesCurrentPeriod.toString(),
        comment: `From last 7 days`,
        trend: `${messageTrend.direction} ${messageTrend.percentage}%`,
      },
      {
        name: "Blog Content",
        value: publishedBlogs.toString(),
        comment: `${draftBlogs} drafts, ${blogEngagement} total likes`,
        trend: undefined,
      },
      {
        name: "Offers Created",
        value: totalOffers.toString(),
        comment: `${acceptanceRate}% acceptance rate on ${totalOfferInterests} interests`,
        trend: undefined,
      },
      {
        name: "Average Company Rating",
        value: averageRating.toString(),
        comment: `From ${totalReviews} reviews across platform`,
        trend: undefined,
      },
      {
        name: "Company Verification Status",
        value: `${completionPercentage}%`,
        comment: `${bronzeVerified} bronze, ${silverVerified} silver, ${goldVerified} gold`,
        trend: undefined,
      },
      {
        name: "Support Messages",
        value: totalSupportMessages.toString(),
        comment: `${unreadSupportMessages} unread from last 7 days: ${supportMessagesCurrentPeriod}`,
        trend: `${supportTrend.direction} ${supportTrend.percentage}%`,
      },
    ];
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return [];
  }
});

export const fetchAdminRecentActivity = cache(
  async (userId: string): Promise<{ id: string; type: string; description: string; createdAt: Date }[]> => {
    try {
      const activities: { id: string; type: string; description: string; createdAt: Date }[] = [];

      // 1. Messages sent TO the admin user (support messages)
      const messagesForAdmin = await prisma.message.findMany({
        where: { receiverId: userId },
        select: {
          id: true,
          message: true,
          createdAt: true,
          sender: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      activities.push(
        ...messagesForAdmin.map((msg) => ({
          id: msg.id,
          type: "Message Received",
          description: `${msg.sender.name || msg.sender.email} sent: "${msg.message.substring(0, 50)}${msg.message.length > 50 ? "..." : ""}"`,
          createdAt: msg.createdAt,
        }))
      );

      // 2. Recently published blogs
      const recentBlogs = await prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 5,
      });

      activities.push(
        ...recentBlogs.map((blog) => ({
          id: blog.id,
          type: "Blog Published",
          description: `${blog.author?.name || "Unknown"} published: "${blog.title}"`,
          createdAt: blog.createdAt,
        }))
      );

      // 3. Recently created offers
      const recentOffers = await prisma.offer.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          company: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      activities.push(
        ...recentOffers.map((offer) => ({
          id: offer.id,
          type: "Offer Created",
          description: `${offer.company.name} created: "${offer.title}"`,
          createdAt: offer.createdAt,
        }))
      );

      // 4. Recent company reviews
      const recentReviews = await prisma.review.findMany({
        select: {
          id: true,
          name: true,
          rating: true,
          createdAt: true,
          company: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      activities.push(
        ...recentReviews.map((review) => ({
          id: review.id,
          type: "Review Submitted",
          description: `${review.name} gave ${review.rating}⭐ to ${review.company.name}`,
          createdAt: review.createdAt,
        }))
      );

      // 5. Recent company verifications
      const recentVerifications = await prisma.companyVerification.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          company: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      activities.push(
        ...recentVerifications.map((verification) => ({
          id: verification.id,
          type: `Company ${verification.status}`,
          description: `${verification.company.name} verification status: ${verification.status}`,
          createdAt: verification.createdAt,
        }))
      );

      // 6. Support messages received
      const supportMessages = await prisma.supportMessage.findMany({
        select: {
          id: true,
          name: true,
          subject: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      activities.push(
        ...supportMessages.map((msg) => ({
          id: msg.id,
          type: "Support Message",
          description: `${msg.name} submitted: "${msg.subject}"`,
          createdAt: msg.createdAt,
        }))
      );

      // Sort by createdAt descending and return top 50
      return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50);
    } catch (error) {
      console.error("Error fetching admin recent activity:", error);
      return [];
    }
  }
);