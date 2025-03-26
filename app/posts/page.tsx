import { Section, Container } from "@/components/craft";
import { SearchFilter } from "@/components/posts/search-filter";
import { PostsGrid } from "@/components/posts/posts-grid";
import { getAllPosts, getAllCategories } from "@/lib/wordpress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "A collection of all articles on the site.",
};

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
  sort?: string;
}

const POSTS_PER_PAGE = 12;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
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

  const allPosts = await getAllPosts(queryParams);

  
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
          <h1 className="mb-8 text-3xl font-medium text-foreground/90 tracking-tight sm:text-4xl">Articles</h1>
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
