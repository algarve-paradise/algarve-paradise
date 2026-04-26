import { z } from "zod";

import { slugifyNewsTitle } from "@/lib/news-shared";

const optionalUrl = z
  .string()
  .trim()
  .nullable()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || /^https?:\/\//.test(value), {
    message: "Informe um URL valido iniciado por http:// ou https://",
  });

export const eventFormSchema = z.object({
  title: z.string().trim().min(4, "Informe um titulo com pelo menos 4 caracteres."),
  slug: z.string().trim().min(3).optional(),
  description: z.string().trim().min(20, "Informe uma descricao com pelo menos 20 caracteres."),
  location: z.string().trim().min(2, "Informe o local."),
  startsAt: z.string().min(1, "Informe a data/hora de inicio."),
  endsAt: z.string().optional(),
  sourceName: z.string().trim().optional(),
  sourceUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  coverImagePath: z.string().trim().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function normalizeEventFormValues(values: EventFormValues) {
  const slug = values.slug?.trim() ? slugifyNewsTitle(values.slug) : slugifyNewsTitle(values.title);

  return {
    ...values,
    slug,
    sourceName: values.sourceName?.trim() || null,
    sourceUrl: values.sourceUrl || null,
    coverImageUrl: values.coverImageUrl || null,
    coverImagePath: values.coverImagePath?.trim() || null,
    endsAt: values.endsAt && values.endsAt.trim() ? values.endsAt : null,
  };
}
