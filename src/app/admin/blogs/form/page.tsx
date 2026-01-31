"use client";

import BlogForm from "@/components/forms/blog/BlogForm";
import { useRouter } from "next/navigation";

export default function BlogFormPage (){
     const router = useRouter();

     return (
          <BlogForm onComplete={() => router.push('/admin/blogs')} />
     )
}