import { MetadataRoute } from "next";
import prisma from "@/config/prisma";

const BASE_URL = "https://consnect.rw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static routes ────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/companies`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/offer`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/catalogs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/get-started`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/auth/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/auth/register`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // ── Dynamic: company pages ───────────────────────────────────────────────────
  let companyRoutes: MetadataRoute.Sitemap = [];
  try {
    const companies = await prisma.company.findMany({
      where: { verification: { status: "VERIFIED" } },
      select: { handle: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    companyRoutes = companies.map((c) => ({
      url: `${BASE_URL}/company/${encodeURIComponent(c.handle)}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (_) {}

  // ── Dynamic: offer pages ─────────────────────────────────────────────────────
  let offerRoutes: MetadataRoute.Sitemap = [];
  try {
    const offers = await prisma.offer.findMany({
      where: { status: "PUBLISHED", visibility: { in: ["PUBLIC", "RESTRICTED"] } },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    offerRoutes = offers.map((o) => ({
      url: `${BASE_URL}/offer/${o.id}`,
      lastModified: o.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch (_) {}

  // ── Dynamic: blog posts ──────────────────────────────────────────────────────
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    blogRoutes = blogs.map((b) => ({
      url: `${BASE_URL}/blog/${b.id}`,
      lastModified: b.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (_) {}

  return [...staticRoutes, ...companyRoutes, ...offerRoutes, ...blogRoutes];
}
