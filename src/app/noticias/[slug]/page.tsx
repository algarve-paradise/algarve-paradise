import type { Metadata } from "next";

import { ArticleDetail } from "@/components/shared/article-detail";
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
      title: "Notícia",
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

  const isReport = item.category === "Reportagem";

  return (
    <ArticleDetail
      category={item.category}
      title={item.title}
      excerpt={item.excerpt}
      date={item.date}
      imageUrl={item.imageUrl}
      authorName={item.authorName}
      sourceName={item.sourceName}
      sourceUrl={item.sourceUrl}
      region={item.region}
      content={item.content}
      backLabel={isReport ? "Voltar à TV" : "Voltar às notícias"}
      backHref={isReport ? siteRoutes.tv : siteRoutes.news}
      secondaryAction={{ label: "Ver mais notícias", href: siteRoutes.news }}
    />
  );
}
