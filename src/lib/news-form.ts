import { z } from "zod";

import { newsCategories, slugifyNewsTitle } from "@/lib/news-shared";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || /^https?:\/\//.test(value), {
    message: "Informe um URL valido iniciado por http:// ou https://",
  });

export const newsFormSchema = z.object({
  title: z.string().trim().min(6, "Informe um titulo com pelo menos 6 caracteres."),
  slug: z.string().trim().min(3).optional(),
  excerpt: z.string().trim().min(20, "Informe um resumo com pelo menos 20 caracteres."),
  content: z.string().trim().min(80, "Informe o corpo da noticia com pelo menos 80 caracteres."),
  category: z.enum(newsCategories as [typeof newsCategories[number], ...typeof newsCategories]),
  sourceName: z.string().trim().optional(),
  sourceUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  coverImagePath: z.string().trim().optional(),
  featured: z.boolean().default(false),
  live: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export function normalizeNewsFormValues(values: NewsFormValues) {
  return {
    ...values,
    slug: values.slug?.trim() ? slugifyNewsTitle(values.slug) : slugifyNewsTitle(values.title),
    sourceName: values.sourceName?.trim() || null,
    sourceUrl: values.sourceUrl || null,
    coverImageUrl: values.coverImageUrl || null,
    coverImagePath: values.coverImagePath?.trim() || null,
  };
}
