"use server";

import { cache } from "react";
import { prisma } from "@/config/prisma";

/**
 * Fetch all users in the system for direct messaging
 * @param currentUserId - The ID of the current user (to exclude them)
 * @param search - Optional search query to filter users
 * @returns Array of users with their basic info and company details, sorted with admins and company users first
 */
export const fetchAllUsers = cache(
  async (currentUserId?: string, search?: string) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          ...(currentUserId && { NOT: { id: currentUserId } }),
          active: true,
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { company: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      // Sort to prioritize admins and users with companies
      return users.sort((a, b) => {
        // Admin users come first
        if (a.role !== b.role) {
          return a.role === 'ADMIN' ? -1 : 1;
        }
        // Users with companies come before those without
        if ((a.company !== null) !== (b.company !== null)) {
          return a.company !== null ? -1 : 1;
        }
        // Otherwise keep alphabetical order
        return (a.name || '').localeCompare(b.name || '');
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
);

/**
 * Get or create a direct message conversation between two users
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @returns Conversation object
 */
export const getOrCreateDirectConversation = async (userId1: string, userId2: string) => {
  try {
    // Check if a direct conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        type: 'CHAT',
        participants: {
          hasEvery: [userId1, userId2],
        },
      },
      include: {
        messages: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { select: { id: true, name: true, image: true } },
            receiver: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: 'CHAT',
          participants: [userId1, userId2],
          messages: {
            create: [],
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            include: {
              sender: { select: { id: true, name: true, image: true } },
              receiver: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    }

    return conversation;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    return null;
  }
};

/**
 * Fetch conversations for a specific user
 * @param userId - The user ID
 * @param limit - Number of conversations to fetch
 * @returns Array of conversations with last message
 */
export const fetchUserConversations = cache(
  async (userId: string, limit: number = 20) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            has: userId,
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              sender: { select: { id: true, name: true, image: true } },
              receiver: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return conversations;
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      return [];
    }
  }
);
