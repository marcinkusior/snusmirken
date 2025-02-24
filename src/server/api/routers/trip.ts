import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const tripRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.trip.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
