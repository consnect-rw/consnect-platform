"use server";

import { cache } from "react";
import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePages } from "../revalidate";

export async function createSubscription(data: Prisma.SubscriptionCreateInput) {
     try{
          const res = await prisma.subscription.create({data});
          if(res) revalidatePages();
          return res;
     }catch(error){
          console.log("error creating Subscription: ",error);
          return null;
     }
}

export async function updateSubscription (id:string, data:Prisma.SubscriptionUpdateInput) {
     try {
          const res = await prisma.subscription.update({where: {id}, data});
          if(res) revalidatePages();
          return res; 
     } catch (error) {
          console.log(`Error updating Subscription with id: ${id}`, error);
          return null;
     }
}

export async function deleteSubscription (id:string) {
     try {
          const res = await prisma.subscription.delete({where: {id}});
          
          const Subscription = await prisma.subscription.findUnique({where:{id}});

          if (!Subscription) throw new Error("Subscription not found");

          if(res) revalidatePages();
           
          return res;
     } catch (error) {
          console.log("Error deleting Subscription with id: ", id, error);
          return null;
     }
}

export const fetchSubscriptions = cache(async <T extends Prisma.SubscriptionSelect>(
          selectType: T, search?: Prisma.SubscriptionWhereInput, take:number = 20, skip:number = 0,
          orderBy: Prisma.SubscriptionOrderByWithRelationInput | Prisma.SubscriptionOrderByWithRelationInput[]  = { createdAt: 'desc' }
     ):Promise<{data: Prisma.SubscriptionGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.subscription.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.subscription.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Subscriptions: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchSubscriptionById = cache(async <T extends Prisma.SubscriptionSelect>(id:string, selectType: T): Promise<Prisma.SubscriptionGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.subscription.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Subscription data for id: ${id}`, error);
          return null;
     }
})