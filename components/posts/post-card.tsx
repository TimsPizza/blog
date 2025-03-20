import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";
import { Badge } from "@/components/ui/badge";

export async function PostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = new Date(post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "group flex flex-col justify-between gap-8 rounded-lg border",
        "bg-card p-4 text-card-foreground shadow-sm transition-all",
        "hover:bg-accent/5 hover:shadow-md"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md border bg-muted">
          {media?.source_url ? (
            <Image
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={media.source_url}
              alt={post.title?.rendered || "文章配图"}
              width={400}
              height={200}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              暂无配图
            </div>
          )}
        </div>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.title?.rendered || "无标题",
            }}
            className="mb-2 text-xl font-medium text-foreground transition-colors group-hover:text-primary"
          />
          <div
            className="text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: post.excerpt?.rendered
                ? post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim() +
                  "..."
                : "暂无摘要",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border-t border-border" />
        <div className="flex items-center justify-between text-sm text-muted-foreground/80">
          {category?.name && (
            <Badge variant="secondary" className="rounded-full">
              {category.name}
            </Badge>
          )}
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
