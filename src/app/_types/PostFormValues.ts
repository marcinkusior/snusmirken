import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const postSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number(),
  longitude: z.number(),
  tripId: z.number(),
  date: z.string(),
});

export type PostFormValues = z.infer<typeof postSchema>;
