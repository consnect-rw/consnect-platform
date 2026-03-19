"use client";

import BlogForm from "@/components/forms/blog/BlogForm";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogFormPage (){
     const router = useRouter();
     const searchParams = useSearchParams();
     // Use the blog id (or "new") as a React key so the form fully remounts
     // when switching between create mode and edit mode, clearing all stale state.
     const blogId = searchParams.get("id") ?? "new";

     return (
          <BlogForm key={blogId} onComplete={() => router.push('/admin/blogs')} />
     )
}