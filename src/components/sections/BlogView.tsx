"use client";

import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { createComment, fetchComments } from "@/server/blog/comment";
import { TBlogPage } from "@/types/blog/blog";
import { SComment, TComment } from "@/types/blog/comment";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  User,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronDown,
  Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "../ui/Image";
import RichTextView from "../ui/rich-text-viewer";
import { AuthFormToggleBtn } from "../forms/auth/AuthBtn";
import { createBlogLike } from "@/server/blog/blog-like";
import { createBlogView } from "@/server/blog/blog-view";

export const BlogView = ({ blog }: { blog: TBlogPage }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog._count.likes);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const {user} = useAuth();

  const publishedDate = blog.publishedAt || blog.createdAt;
  const timeAgo = formatDistanceToNow(new Date(publishedDate), {
    addSuffix: true,
  });

     const handleLike = async () => {
          if(!user) return toast.warning("You need to first login in!")
          setIsLiked(!isLiked);
          const userLike = blog.likes.find(like => like.user.id === user.id);
          if(userLike) return;
          const res = await createBlogLike({
               user:{connect:{id: user.id}},
               blog:{connect:{id: blog.id}}
          })
          if(!res) return;
          setLikes(isLiked ? likes - 1 : likes + 1);
     };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog.title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
      return;
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  useEffect(() => {
     if(user){
          const userLike = blog.likes.find(like => like.user.id === user.id)
          if(userLike) setIsLiked(true);
     }
     if(user) {
          const userView = blog.views.find(v => v.user.id === user.id);
          if(!userView) {
               createBlogView({
                    user: {connect: {id:user.id}},
                    blog:{connect: {id:blog.id}}
               })
          }
     }
  }, [blog])

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
          {/* Category Badge */}
          {blog.category && (
            <Link
              href={`/blogs?category=${blog.category.id}`}
              className="inline-block mb-6 px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-black text-sm uppercase tracking-wider hover:bg-yellow-300 transition-colors"
            >
              {blog.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Description */}
          {blog.description && (
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
              {blog.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            {/* Author */}
            {blog.author && (
              <div className="flex items-center gap-3">
                {blog.author.image ? (
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name || "Author"}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-900" />
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">
                    {blog.author.name || "Anonymous"}
                  </p>
                  <p className="text-sm">{timeAgo}</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{timeAgo}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-medium">{blog._count.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-yellow-400" />
              {blog.tags.map((tag, index) => (
                <span
                  key={`tag-${index}`}
                  className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImageUrl && (
        <div className="relative w-full max-w-5xl mx-auto -mt-12 px-6 mb-12 z-20">
          <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src={blog.featuredImageUrl}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Article Content */}
          <div className="w-full flex flex-col">
            {/* Main Content */}
          <RichTextView showBorder={false} content={blog.detailedDescription} />

            {/* Additional Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {blog.images.map((image, index) => (
                  <div
                    key={`image-${index}`}
                    className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={image}
                      alt={`${blog.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
               {/* Sidebar - Social Actions */}
            <div className="flex items-center lg:items-start gap-4">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`group flex items-center gap-2 p-3 rounded-xl transition-all ${
                  isLiked
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Heart
                  className={`w-6 h-6 transition-transform ${
                    isLiked ? "fill-current scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="text-sm font-bold">{likes}</span>
              </button>

              {/* Comment Count */}
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl text-gray-700">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm font-bold">{blog._count.comments}</span>
              </div>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="group flex cursor-pointer items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
                >
                  <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute left-0 lg:left-full lg:ml-4 mt-2 lg:mt-0 lg:top-0 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-3 w-48 z-50">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left transition-colors group"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-900">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full flex items-center flex-nowrap gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left transition-colors group"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <span className="font-bold text-gray-900">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <span className="font-bold text-gray-900">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors group"
                    >
                      <LinkIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-bold text-gray-900">Copy Link</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Comments Section */}
            <div className="mt-16 border-t-2 border-gray-200 pt-12">
              <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-yellow-400" />
                <span>Comments ({blog._count.comments})</span>
              </h2>

              <CommentForm blogId={blog.id} />
              <CommentsContainer blogId={blog.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentsContainer = ({ blogId }: { blogId: string }) => {
  const fetchSize = 10;
  const [currentComments, setCurrentComments] = useState<TComment[]>([]);
  const [page, setPage] = useState(1);

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["blog-comments", blogId, page],
    queryFn: () => fetchComments(SComment, { blog: { id: blogId } }, fetchSize, (page - 1) * fetchSize),
  });
  const comments = commentsData?.data ?? [];
  const totalComments = commentsData?.pagination.total ?? 0;
  const hasMore = currentComments.length < totalComments;

  useEffect(() => {
    if (comments.length > 0)
          setCurrentComments(prev => {
               const existingIds = new Set(prev.map(c => c.id));

               const newOnes = comments.filter(c => !existingIds.has(c.id));

               return [...prev, ...newOnes];
          });
  }, [comments]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading && currentComments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (currentComments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium text-lg">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>Load More Comments</span>
              <ChevronDown className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

const CommentCard = ({ comment }: { comment: TComment }) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {comment.user.image ? (
          <Image
            src={comment.user.image}
            alt={comment.user.name || "User"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-gray-900" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-black text-gray-900">
              {comment.user.name || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-500 font-medium">{timeAgo}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ blogId }: { blogId: string }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitData = async () => {
    try {
      if (!comment.trim()) {
        toast.error("Please write a comment");
        return;
      }

      setIsSubmitting(true);
      const res = await createComment({
        content: comment,
        blog: { connect: { id: blogId } },
        user: { connect: { id: user?.id } },
      });

      if (!res) {
        toast.error("Something went wrong!");
        return;
      }

      await queryClient.invalidateQueries();
      setComment("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Error sending your comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user)
    return (
      <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-8 text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Join the Discussion
        </h3>
        <p className="text-gray-600 font-medium mb-6">
          Sign in to share your thoughts and engage with the community
        </p>
        <div className="flex items-center justify-center gap-3">
          <AuthFormToggleBtn name="Sign In" className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full transition-colors"  />
        </div>
      </div>
    );

  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "You"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-2 border-yellow-400"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-gray-900" />
          </div>
        )}

        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:bg-white transition-all resize-none font-medium text-gray-900 placeholder:text-gray-400"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500 font-medium">
              {comment.length} / 500 characters
            </p>
            <button
              onClick={handleSubmitData}
              disabled={isSubmitting || !comment.trim()}
              className="group px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Post Comment</span>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};