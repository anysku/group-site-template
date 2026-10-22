import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One optional file per organization, named after its anySKU username: src/content/organizations/{username}.md
const organizations = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/organizations" }),
  schema: z.object({
    name: z.string().optional(),
    photo: z.string().optional(),
    website: z.url().optional(),
    hidden: z.boolean().default(false),
  }),
});

export const collections = { organizations };
