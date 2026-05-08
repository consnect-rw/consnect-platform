import { fetchOfferById } from "@/server/offer/offer";
import { SPublicOfferDetail, SPublicOfferCard } from "@/types/offer/offer";
import { PublicOfferDetailView } from "@/components/containers/offer/PublicOfferDetailView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd, buildOfferSchema, buildBreadcrumbSchema } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const offer = await fetchOfferById(id, SPublicOfferCard);

  if (!offer || offer.status !== "PUBLISHED") {
    return { title: "Work Package Not Found | Consnect" };
  }

  const title = `${offer.title} | Construction Opportunity`;
  const description = (offer.description ?? `${offer.title} — a construction work package posted on Consnect Rwanda.`).slice(0, 160);
  const url = `https://consnect.rw/offer/${offer.id}`;

  return {
    title,
    description,
    keywords: [offer.category?.name ?? "construction", offer.siteLocation?.city ?? "Rwanda", "construction opportunity Rwanda", "subcontracting Rwanda"],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Consnect",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
     
     const offer = await fetchOfferById(id, SPublicOfferDetail);

     if (!offer || offer.status !== "PUBLISHED") {
          return (
               <div className="min-h-4/12 py-2 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <p className="text-gray-600 font-bold">Work Package not found or not published</p>
                    </div>
               </div>
          )
     }

     const offerSchema = buildOfferSchema({
       id: offer.id,
       title: offer.title,
       description: offer.description,
       createdAt: offer.createdAt,
       timeline: offer.timeline,
       pricing: offer.pricing,
       company: offer.company,
       category: offer.category,
     });

     const breadcrumb = buildBreadcrumbSchema([
       { name: "Home", url: "https://consnect.rw" },
       { name: "Offers", url: "https://consnect.rw/offer" },
       { name: offer.title, url: `https://consnect.rw/offer/${offer.id}` },
     ]);

     return (
       <>
         <JsonLd data={offerSchema} />
         <JsonLd data={breadcrumb} />
         <PublicOfferDetailView offer={offer} />
       </>
     );
}