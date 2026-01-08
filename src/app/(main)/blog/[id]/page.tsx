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

//   return (
//     <div className="p-12 my-8 max-w-7xl w-full mx-auto rounded-xl flex flex-col gap-8">
//       {/* ✅ Structured Data for SEO & AI */}
//       <Script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <h1 className="text-4xl font-bold">{blog.title}</h1>

//       <div className="flex items-center gap-4 text-sm text-gray-500">
//         <span>{blog.author.name}</span>
//         <span>•</span>
//         <span>{new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString()}</span>
//         <span>•</span>
//         <span>{blog.category.name}</span>
//       </div>

//       <Image
//         src={blog.featuredImageUrl}
//         alt={blog.title}
//         width={1200}
//         height={630}
//         className="rounded-xl w-full object-cover"
//       />

//       <p className="text-lg text-gray-600">{blog.description}</p>

//       {/* <article
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.detailedDescription }}
//       /> */}
//       <DetailedDescriptionView description={blog.detailedDescription} />

//       {/* Tags */}
//       <div className="flex gap-2 flex-wrap mt-8">
//         {blog.tags?.map((tag) => (
//           <span
//             key={tag}
//             className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//           >
//             #{tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
}
