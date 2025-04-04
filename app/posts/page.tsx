import { Container, Section } from "@/components/craft";
import { ExtendedPost, PostsGrid } from "@/components/posts/posts-grid";
import { SearchFilter } from "@/components/posts/search-filter";
import {
  getAllCategories,
  getAllPosts,
  getFeaturedMediaById,
} from "@/lib/wordpress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "A collection of all articles on the site.",
};

const POSTS_PER_PAGE = 12;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const category = searchParams.category;
  const sort = searchParams.sort || "date";

  const categories = await getAllCategories();

  const queryParams = (() => {
    if (!search && !category) return undefined;

    const params: {
      search?: string;
      category?: number;
    } = {};

    if (search && search.trim() !== "") {
      params.search = search;
    }

    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        params.category = categoryId;
      }
    }

    return Object.keys(params).length > 0 ? params : undefined;
  })();

  const allPosts = await getAllPosts(queryParams).then(async (posts) => {
    console.log("[POSTS]", posts);
    const new_post = await Promise.all(
      posts.map(async (post) => {
        const media = post.featured_media && post.featured_media !== 0
          ? await getFeaturedMediaById(post.featured_media)
          : null;
        if (media) {
          // @ts-ignore
          post._media = media;
        }
        return post;
      }),
    );
    console.log("[POSTS]", new_post);
    return new_post;
  });

  const sortedPosts = [...allPosts].sort((a, b) => {
    switch (sort) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "views":
        return (
          (parseInt(String(b.meta?.views ?? "0")) || 0) -
          (parseInt(String(a.meta?.views ?? "0")) || 0)
        );
      case "views-asc":
        return (
          (parseInt(String(a.meta?.views ?? "0")) || 0) -
          (parseInt(String(b.meta?.views ?? "0")) || 0)
        );
      case "date":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <Section>
      <Container className="space-y-8">
        <div>
          <h1 className="mb-8 text-3xl font-medium tracking-tight text-foreground/90 sm:text-4xl">
            Articles
          </h1>
          <SearchFilter categories={categories} />
        </div>

        <div className="py-4">
          {/* 结果统计 */}
          <p className="text-sm text-muted-foreground/80">
            {`Found ${sortedPosts.length} article(s)`}
            {search && `,include keywords "${search}"`}
            {category &&
              `,in category "${categories.find((cat) => cat.id.toString() === category)?.name || category}"`}
          </p>
        </div>

        <PostsGrid
          posts={paginatedPosts}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Container>
    </Section>
  );
}
