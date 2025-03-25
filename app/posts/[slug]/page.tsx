import { ArticleView } from "@/components/posts/article-view";
import { ArticleSkeleton } from "@/components/ui/skeleton";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";
import { Suspense } from "react";

interface PostPageProps {
  params: {
    slug: string;
  };
}

// 动态生成元数据
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post?.title?.rendered,
    description: post?.excerpt?.rendered.replace(/<[^>]*>/g, ""),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Section>
      <Container className="max-w-4xl">
        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleView
            post={post}
            media={media}
            category={category}
          />
        </Suspense>
      </Container>
    </Section>
  );
}
