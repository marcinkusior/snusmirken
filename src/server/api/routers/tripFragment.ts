import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const tripFragmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tripFragment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getByTripId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.tripFragment.findMany({
        where: { tripId: input },
        orderBy: { createdAt: "asc" },
      });

      return posts;
    }),
});
