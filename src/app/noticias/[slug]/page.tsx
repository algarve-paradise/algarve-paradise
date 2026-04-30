import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { NewsCommentForm } from "@/components/forms/news-comment-form";
import { ArticleDetail } from "@/components/shared/article-detail";
import { getApprovedNewsComments } from "@/lib/comments";
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
  const [item, comments] = await Promise.all([
    getPublishedNewsOrThrow(slug),
    getApprovedNewsComments(slug),
  ]);

  return (
    <>
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
        backLabel="Voltar às notícias"
        backHref={siteRoutes.news}
        secondaryAction={{ label: "Ver mais notícias", href: siteRoutes.news }}
      />
      <Container className="-mt-8 pb-16">
        <NewsCommentForm slug={slug} initialComments={comments} />
      </Container>
    </>
  );
}
