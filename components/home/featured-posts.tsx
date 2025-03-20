import { Section, Container } from "@/components/craft";
import { FeaturedPostCard } from "./featured-post-card";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

export async function FeaturedPosts() {
  // 获取最新的文章并只使用前4篇
  const posts = (await getAllPosts()).slice(0, 4);

  return (
    <Section>
      <Container>
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-medium sm:text-3xl">Most Recent</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map(async (post, index) => {
            const media = post.featured_media
              ? await getFeaturedMediaById(post.featured_media)
              : null;
            const author = post.author
              ? await getAuthorById(post.author)
              : null;
            const category = post.categories?.[0]
              ? await getCategoryById(post.categories[0])
              : null;

            return (
              <FeaturedPostCard
                key={post.id}
                post={post}
                media={media}
                author={author}
                category={category}
                layout={index === 0 ? "horizontal" : "vertical"}
                className={index === 0 ? "sm:col-span-2" : ""}
              />
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
