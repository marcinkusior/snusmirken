import { z } from "zod";
import { postSchema } from "~/app/_types/PostFromValues";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: publicProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        name: input.name,
        latitude: input.latitude,
        longitude: input.longitude,
        tripId: input.tripId,
      },
    });
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return posts;
  }),

  getByTripId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      console.log("inputzzz", typeof input);

      const posts = await ctx.db.post.findMany({
        where: { tripId: input },
        orderBy: { createdAt: "desc" },
      });

      return posts;
    }),
});
