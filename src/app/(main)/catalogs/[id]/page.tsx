import { fetchProductCatalogById } from "@/server/company/product-catalog";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import CatalogDetailClient from "./CatalogDetailClient";

const SCatalogDetail = {
  id: true,
  name: true,
  description: true,
  image: true,
  fileUrl: true,
  createdAt: true,
  updatedAt: true,
  company: {
    select: {
      id: true,
      name: true,
      handle: true,
      logoUrl: true,
      phone: true,
      email: true,
      website: true,
      foundedYear: true,
      companySize: true,
      slogan: true,
      verification: {
        select: { status: true, isGoldVerified: true, isSilverVerified: true, isBronzeVerified: true },
      },
      location: { select: { country: true, city: true, state: true } },
      specializations: { select: { name: true } },
    },
  },
} satisfies Prisma.ProductCatalogSelect;

export default async function CatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await fetchProductCatalogById(id, SCatalogDetail);

  if (!catalog) return notFound();

  return <CatalogDetailClient catalog={catalog} />;
}