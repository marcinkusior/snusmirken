import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const postSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  tripId: z.number().optional(),
  date: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
