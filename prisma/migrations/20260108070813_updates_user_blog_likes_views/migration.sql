/*
  Warnings:

  - You are about to drop the column `commentCount` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `likedBlogs` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `viewedBlogs` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "commentCount",
DROP COLUMN "likeCount",
DROP COLUMN "viewCount";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "likedBlogs",
DROP COLUMN "viewedBlogs";

-- CreateTable
CREATE TABLE "BlogLike" (
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,

    CONSTRAINT "BlogLike_pkey" PRIMARY KEY ("userId","blogId")
);

-- CreateTable
CREATE TABLE "BlogView" (
    "userId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,

    CONSTRAINT "BlogView_pkey" PRIMARY KEY ("userId","blogId")
);

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogView" ADD CONSTRAINT "BlogView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogView" ADD CONSTRAINT "BlogView_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
