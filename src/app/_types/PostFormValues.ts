import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const postSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number(),
  longitude: z.number(),
  tripId: z.number(),
  tripFragmentId: z.number(),
  date: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
