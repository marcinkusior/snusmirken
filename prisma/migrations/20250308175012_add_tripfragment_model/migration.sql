-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "tripFragmentId" INTEGER;

-- CreateTable
CREATE TABLE "TripFragment" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL,

    CONSTRAINT "TripFragment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TripFragment_tripId_idx" ON "TripFragment"("tripId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tripFragmentId_fkey" FOREIGN KEY ("tripFragmentId") REFERENCES "TripFragment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripFragment" ADD CONSTRAINT "TripFragment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
