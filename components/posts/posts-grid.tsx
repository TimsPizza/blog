"use client";
import { FeaturedPostCard } from "@/components/home/featured-post-card";
import { Pagination } from "@/components/ui/pagination";
import { Post } from "@/lib/wordpress.d";

interface PostsGridProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

interface MediaType {
  source_url: string;
}

interface CategoryType {
  id: number;
  name: string;
}

interface AuthorType {
  name: string;
}

interface ExtendedPost extends Post {
  _media?: MediaType;
  _author?: AuthorType;
  _category?: CategoryType;
}

export function PostsGrid({ posts, currentPage, totalPages }: PostsGridProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: ExtendedPost) => (
          <FeaturedPostCard
            key={post.id}
            post={post}
            media={post._media}
            category={post._category}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
