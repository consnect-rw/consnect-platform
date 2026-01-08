-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likedBlogs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "viewedBlogs" TEXT[] DEFAULT ARRAY[]::TEXT[];
