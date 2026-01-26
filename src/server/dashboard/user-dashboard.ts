"use server"

import { cache } from "react";
import { prisma } from "@/config/prisma";

export const fetchUserDashboardStats = cache(
  async (userId: string): Promise<{ label: string; value: string; trend: string }[]> => {
    try {
      // Fetch company first (single query)
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return [];
      }

      // Calculate date range for trends (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Execute all stats queries in parallel for optimization
      const [
        totalOffers,
        offersThisWeek,
        totalProjects,
        completedProjects,
        totalMessages,
        messagesThisWeek,
        reviewStats,
      ] = await Promise.all([
        // Total offers
        prisma.offer.count({
          where: { companyId: company.id },
        }),
        // Offers posted this week
        prisma.offer.count({
          where: {
            companyId: company.id,
            createdAt: { gte: sevenDaysAgo },
          },
        }),
        // Total projects
        prisma.project.count({
          where: { companyId: company.id },
        }),
        // Completed projects
        prisma.project.count({
          where: {
            companyId: company.id,
            phase: "COMPLETED",
          },
        }),
        // Total messages (received by the user)
        prisma.message.count({
          where: { receiverId: userId },
        }),
        // Messages received this week
        prisma.message.count({
          where: {
            receiverId: userId,
            createdAt: { gte: sevenDaysAgo },
          },
        }),
        // Reviews and rating aggregation
        prisma.review.aggregate({
          where: { companyId: company.id },
          _count: true,
          _avg: { rating: true },
        }),
      ]);

      const stats: { label: string; value: string; trend: string }[] = [
        {
          label: "Active Offers",
          value: totalOffers.toString(),
          trend:
            offersThisWeek > 0
              ? `+${offersThisWeek} posted this week`
              : "No new offers this week",
        },
        {
          label: "Projects",
          value: totalProjects.toString(),
          trend:
            completedProjects > 0
              ? `${completedProjects} completed`
              : "No completed projects yet",
        },
        {
          label: "Messages",
          value: totalMessages.toString(),
          trend:
            messagesThisWeek > 0
              ? `+${messagesThisWeek} received this week`
              : "No messages this week",
        },
        {
          label: "Company Rating",
          value: reviewStats._avg.rating
            ? reviewStats._avg.rating.toFixed(1)
            : "0",
          trend:
            reviewStats._count > 0
              ? `Based on ${reviewStats._count} ${reviewStats._count === 1 ? "review" : "reviews"}`
              : "No reviews yet",
        },
      ];

      return stats;
    } catch (error) {
      console.log("Error fetching user dashboard stats:", error);
      return [];
    }
  }
);

export const fetchUserRecentActivity = cache(
  async (userId: string): Promise<
    { title: string; message: string; timestamp: Date }[]
  > => {
    try {
      // Fetch company for the user
      const company = await prisma.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!company) {
        return [];
      }

      // Fetch recent activities in parallel
      const [recentOffers, recentProjects, recentReviews, recentMessages] =
        await Promise.all([
          // Recent offers posted by company
          prisma.offer.findMany({
            where: { companyId: company.id },
            select: { title: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 3,
          }),
          // Recent projects completed by company
          prisma.project.findMany({
            where: { companyId: company.id, phase: "COMPLETED" },
            select: { title: true, completedOn: true },
            orderBy: { completedOn: "desc" },
            take: 2,
          }),
          // Recent reviews received by company
          prisma.review.findMany({
            where: { companyId: company.id },
            select: { review: true, rating: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 3,
          }),
          // Recent messages received by user
          prisma.message.findMany({
            where: { receiverId: userId },
            select: { message: true, sender: { select: { name: true } }, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 3,
          }),
        ]);

      // Build activity array
      const activities: { title: string; message: string; timestamp: Date }[] =
        [];

      // Add offer activities
      recentOffers.forEach((offer) => {
        activities.push({
          title: "Offer Posted",
          message: `Company posted a new offer: "${offer.title}"`,
          timestamp: offer.createdAt,
        });
      });

      // Add project completion activities
      recentProjects.forEach((project) => {
        activities.push({
          title: "Project Completed",
          message: `Company completed project: "${project.title}"`,
          timestamp: project.completedOn || new Date(),
        });
      });

      // Add review activities
      recentReviews.forEach((review) => {
        activities.push({
          title: "New Review",
          message: `Company received a ${review.rating}-star review: "${review.review}"`,
          timestamp: review.createdAt,
        });
      });

      // Add message activities
      recentMessages.forEach((msg) => {
        activities.push({
          title: "New Message",
          message: `Message from ${msg.sender.name}: "${msg.message.substring(0, 50)}${msg.message.length > 50 ? "..." : ""}"`,
          timestamp: msg.createdAt,
        });
      });

      // Sort by timestamp (most recent first) and limit to 10
      const sortedActivities = activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

      return sortedActivities;
    } catch (error) {
      console.log("Error fetching user recent activity:", error);
      return [];
    }
  }
);

