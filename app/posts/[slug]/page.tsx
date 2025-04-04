import { Container, Section } from "@/components/craft";
import { ArticleView } from "@/components/posts/article-view";
import { ArticleSkeleton } from "@/components/ui/skeleton";
import {
  getCategoryById,
  getFeaturedMediaById,
  getPostBySlug,
} from "@/lib/wordpress";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post?.title?.rendered,
    description: post?.excerpt?.rendered.replace(/<[^>]*>/g, ""),
  };
}

export default async function PostPage({ params }: { params: any }) {
  const post = await getPostBySlug(params.slug);
  const media = post.featured_media && post.featured_media !== 0
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Section>
      <Container className="max-w-4xl">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleView post={post} media={media} category={category} />
        </Suspense>
      </Container>
    </Section>
  );
}
