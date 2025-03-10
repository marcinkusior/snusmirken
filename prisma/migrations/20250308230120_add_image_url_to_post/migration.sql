-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Post_tripFragmentId_idx" ON "Post"("tripFragmentId");
