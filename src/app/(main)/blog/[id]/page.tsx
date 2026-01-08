import { BlogView } from "@/components/sections/BlogView";
import { DetailedDescriptionView } from "@/components/ui/description-view";
import Image from "@/components/ui/Image";
import { fetchBlogById } from "@/server/blog/blog";
import { SBlogPage } from "@/types/blog/blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * ✅ Dynamic SEO metadata for every blog post
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const {id: blogId} = await params;
  const blog = await fetchBlogById(blogId, SBlogPage);

  if (!blog) {
    return {
      title: "Blog not found",
      description: "This blog post does not exist.",
    };
  }

  const title = blog.title;
  const description = blog.description;
  const image = blog.featuredImageUrl;
  const url = `https://consnect.rw/blog/${blog.id}`;

  return {
    title,
    description,
    keywords: blog.tags ?? [],
    authors: [{ name: blog.author.name ?? "Consnect" }],
    openGraph: {
      title,
      description,
      url,
      siteName: "Consnect",
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [blog.author.name ?? "Consnect"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * ✅ Main blog page
 */
export default async function BlogPage({ params }: Props) {
     const {id: blogId} = await params;
  const blog = await fetchBlogById(blogId, SBlogPage);

  if (!blog) return notFound();

  // ✅ JSON-LD Structured Data for Google & AI
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    image: blog.featuredImageUrl,
    datePublished: blog.publishedAt,
    author: {
      "@type": "Person",
      name: blog.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Consnect",
      logo: {
        "@type": "ImageObject",
        url: "https://consnect.rw/logo/consnect.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://consnect.rw/blog/${blog.id}`,
    },
  };

  return (
     <BlogView blog={blog} />
  )
}