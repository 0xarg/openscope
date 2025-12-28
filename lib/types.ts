import { z } from "zod";

export const AddRepoSchema = z.object({
  githubUrl: z.string(),
  type: z.string().optional(),
});
