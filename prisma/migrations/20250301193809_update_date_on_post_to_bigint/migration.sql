-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "date" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE INDEX "Post_date_idx" ON "Post"("date");
