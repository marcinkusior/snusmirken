import { z } from "zod";
import { postSchema } from "~/app/_types/PostFormValues";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: publicProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    const timestamp = new Date(input.date).getTime();

    return ctx.db.post.create({
      data: {
        name: input.name,
        latitude: input.latitude,
        longitude: input.longitude,
        tripId: input.tripId,
        date: timestamp,
      },
    });
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { date: "desc" },
    });

    return post ?? null;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { date: "desc" },
      take: 30,
    });

    return posts;
  }),

  getByTripId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      console.log("inputzzz", typeof input);

      const posts = await ctx.db.post.findMany({
        where: { tripId: input },
        orderBy: { date: "asc" },
      });

      return posts;
    }),
});
