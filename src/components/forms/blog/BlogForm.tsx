"use client";

import { SelectInputGroup, TextAreaInputGroup, TextInputGroup } from "@/components/forms/InputGroups";
import { MainForm, MainFormLoader } from "@/components/forms/MainForm";
import { RichTextEditor } from "@/components/forms/TextEditor";
import Image from "@/components/ui/Image";
import ImageUploader from "@/components/ui/upload/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { createBlog, fetchBlogById, updateBlog } from "@/server/blog/blog";
import { fetchCategorys } from "@/server/common/category";
import { SBlogUpdate } from "@/types/blog/blog";
import { EAspectRatio } from "@/types/enums";
import { deleteSingleImage } from "@/util/s3Helpers";
import { EBlogStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Trash, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BlogForm({onComplete}:{onComplete:() => void}) {
     const searchparams = useSearchParams();
     const blogId = searchparams.get("id");
     const [detailedDescription, setDetailedDescription] = useState("");
     const [tags, setTags] = useState<string[]>([]);
     const [images,setImages] = useState<string[]>([]);
     const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
     const [submittingForm,setSubmittingForm] = useState(false);
     const [title,setTitle] = useState<string>("");
     const [description,setDescription] = useState<string>("");
     const [categoryId,setCategoryId] = useState("");
     const {user} = useAuth();

     const {data:categoriesData, isLoading:fetchingCategories} = useQuery({
          queryKey: ["blog-form-categories"],
          queryFn:() => fetchCategorys({id:true, name:true}, {type: "BLOG"}, 100)
     });

     const {data: blogData, isLoading: fetchingBlog} = useQuery({
          queryKey: ["blog-form-blog", blogId],
          queryFn: () => blogId ? fetchBlogById(blogId as string, SBlogUpdate) :null
     })

     const loading = fetchingCategories || fetchingBlog;
     const categories = categoriesData?.data || [];
     const blog = blogData;

     const resetForm = () => {
          setTitle("");
          setFeaturedImageUrl("");
          setDescription("");
          setDetailedDescription("");
          setTags([]);
     }

     const submitData = async(status: EBlogStatus) => {
          try {
               setSubmittingForm(true);
               if(!blogId) {
                    if(!categoryId) return toast.warning("Please select blog category!");
                    if(!title) return toast.warning("Please add blog title");
                    if(!description) return toast.warning("Please add blog summary");
                    if(!featuredImageUrl) return toast.warning("Please add featured Image!");
                    if(tags.length === 0) return toast.warning("Please add at least on tag");
                    if(!detailedDescription) return toast.warning("Please blog body");
 
                    const newBlog = await createBlog({
                         category:{connect:{id: categoryId}},
                         title, description, detailedDescription, tags, featuredImageUrl, status,
                         author: {connect:{id:user?.id}}
                    });

                    if(!newBlog) return toast.error("Error saving the blog.", {description: "Please try again later"});
                    queryClient.invalidateQueries();
                    toast.success("Blog saved successfully");
                    resetForm();
                    return onComplete();
               }
               const updatedBlog = await updateBlog(blogId, {
                    ...(categoryId && categoryId !== blog?.category.id ? {category: {connect:{id:categoryId}}} : {}),
                    ...(title ? {title}:{}),
                    ...(description ? {description}:{}),
                    ...(detailedDescription ? {description}:{}),
                    ...(tags.length === 0 ? {tags}:{}),
                    ...(featuredImageUrl && featuredImageUrl !== blog?.featuredImageUrl ? {featuredImageUrl} :{}),
                    status
               })

               if(!updatedBlog) return toast.error("Error updating the blog.", {description: "Please try again later"});
                    queryClient.invalidateQueries();
                    toast.success("Blog updated successfully");
                    resetForm();
                    return onComplete();

          } catch (error) {
               
          }finally{
               setSubmittingForm(false);
          }

     }

     const deleteFImage = async () => {
          try {
               await deleteSingleImage(featuredImageUrl);
               setFeaturedImageUrl("");
               toast.success("Featured image deleted successfully.");
          } catch (error) {
               console.error("Error deleting featured image:", error);
               return toast.error("Failed to delete featured image. Please try again.");
          }
          
     }

     const addTag = () => {
          const newTagInput = (document.getElementsByName("tags")[0] as HTMLInputElement);
          const newTag = newTagInput.value.trim();
          if (newTag && !tags.includes(newTag)) {
               setTags([...tags, newTag]);
               newTagInput.value = "";
          }
     }

     useEffect(() => {
          if(blog) {
               setTitle(blog.title);
               setTags(blog.tags);
               setDescription(blog.description);
               setDetailedDescription(blog.detailedDescription);
               setFeaturedImageUrl(blog.featuredImageUrl);
               setCategoryId(blog.category.id)
          }
     }, [blog]);

     if(loading) return <MainFormLoader />;

     return (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-4  items-center shadow-md rounded-xl p-4 bg-white">
               <div className="w-full flex flex-col gap-2 items-center">
                    <h1 className="text-2xl font-semibold">{blogId ? "Edit Blog Post" : "Create New Blog Post"}</h1>
                    <p className="text-gray-600">{blogId ? "Update the details of your blog post below." : "Fill in the details of your new blog post below."}</p>
               </div>
               <form className="w-full flex flex-col items-start gap-8">
                    <SelectInputGroup action={setCategoryId} name="category" label="Category" values={categories.map(c => ({label: c.name, value:c.id}))} />
                    <TextInputGroup name="title" label="Title *" placeholder="Enter the title of the blog post" action={ res => setTitle(res as string)}  />
                    <TextAreaInputGroup defaultValue={description ?? ""} name="description" label="Summary: " maxWords={100} placeholder="Enter a brief summary of the blog post" action={res => setDescription(res as string)} />
                    <div className="w-full flex flex-col items-start gap-3">
                         <label className="font-medium text-gray-700">Featured Image: </label>
                         {
                              featuredImageUrl ?
                                   <div className="w-full flex flex-col gap-2">
                                        <Image src={featuredImageUrl} alt="Featured Image" className="w-64 rounded-md"/>
                                        <button className="flex items-center gap-2 text-red-500" onClick={deleteFImage}><Trash /> Delete</button>
                                   </div>
                              :
                              <ImageUploader onUploadComplete={setFeaturedImageUrl} Icon={Upload} name="Add Featured Image" aspect={EAspectRatio.STANDARD} />
                         }
                    </div>
                    <div className="w-full flex flex-col gap-3">
                         <label className="font-medium text-gray-700">Detailed Description: </label>
                         <RichTextEditor defaultValue={detailedDescription} onChange={setDetailedDescription} placeholder="Enter detailed description here..." />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                         <label className="font-medium text-gray-700">Tags: </label>
                         <div className="flex items-center gap-2 flex-wrap">
                              {tags.length === 0 && <p className="text-gray-600 text-sm font-medium">No tags added yet.</p>}
                              {tags.map((tag, index) => (
                                   <div key={index} className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-xl flex items-center gap-2">
                                        <span>{tag}</span>
                                        <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))} className="text-red-500 font-bold">x</button>
                                   </div>
                              ))}
                         </div>
                         <div className="w-full flex items-center justify-start gap-2">
                              <TextInputGroup name="tags" label="" placeholder="New tag..."  />
                              <button onClick={addTag} type="button" className="py-2 text-sm px-4 bg-gray-800 hover:bg-gray-700 cursor-pointer text-white rounded-md flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
                         </div>
                    </div>
                    {
                         submittingForm ? 
                              <div className="w-full py-2 flex items-center justify-center">
                                   <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                              </div>
                         :
                         <div className="w-full grid grid-cols-2 gap-2">
                         <button onClick={() => submitData("DRAFT")}  type="button" className="w-full py-2 font-medium flex justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800  items-center gap-2 cursor-pointer">Save Draft</button>
                         <button onClick={() => submitData("PUBLISHED")} type="button" className="w-full py-2 font-medium flex justify-center bg-amber-800 hover:bg-amber-600 text-white rounded-md items-center gap-2 cursor-pointer">Publish</button>
                    </div>
                    }
               </form>
          </div>
          
     )
}