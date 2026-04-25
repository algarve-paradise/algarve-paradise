import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { getPublishedNewsBySlug, getPublishedNewsOrThrow } from "@/lib/news";
import { siteRoutes } from "@/lib/site";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedNewsBySlug(slug);

  if (!item) {
    return {
      title: "Noticia",
    };
  }

  return {
    title: item.title,
    description: item.excerpt,
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const item = await getPublishedNewsOrThrow(slug);

  return (
    <Container className="py-10">
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-5 border-y border-border py-8">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {item.category} · {new Date(item.date).toLocaleDateString("pt-PT")}
          </div>
          <h1 className="font-heading text-5xl leading-none sm:text-6xl">{item.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{item.excerpt}</p>
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item.authorName ? <span>Autor: {item.authorName}</span> : null}
            {item.sourceName ? (
              <span>
                Fonte:{" "}
                {item.sourceUrl ? (
                  <Link href={item.sourceUrl} className="text-foreground underline" target="_blank">
                    {item.sourceName}
                  </Link>
                ) : (
                  item.sourceName
                )}
              </span>
            ) : null}
          </div>
        </header>

        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={1600}
            height={900}
            className="h-auto max-h-[520px] w-full border border-border object-cover"
          />
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
          <div className="space-y-5 text-base leading-8 text-foreground">
            {item.content?.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="space-y-4 border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Navegacao
            </p>
            <Link href={siteRoutes.news} className="block text-sm hover:underline">
              Voltar ao portal de noticias
            </Link>
          </aside>
        </div>
      </article>
    </Container>
  );
}
