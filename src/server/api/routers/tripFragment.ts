import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tripFragmentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.tripFragment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
