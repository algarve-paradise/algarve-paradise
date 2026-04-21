import { z } from "zod";

import { newsCategories, slugifyNewsTitle } from "@/lib/news-shared";
import { siteConfig, siteRoutes } from "@/lib/site";

const optionalUrl = z
  .string()
  .trim()
  .nullable()
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
  const slug = values.slug?.trim() ? slugifyNewsTitle(values.slug) : slugifyNewsTitle(values.title);
  const sourceName = values.sourceName?.trim() || siteConfig.name;
  const sourceUrl = values.sourceUrl || `${siteConfig.url}${siteRoutes.news}/${slug}`;

  return {
    ...values,
    slug,
    sourceName,
    sourceUrl,
    coverImageUrl: values.coverImageUrl || null,
    coverImagePath: values.coverImagePath?.trim() || null,
  };
}
