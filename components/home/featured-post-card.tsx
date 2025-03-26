import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Post } from "@/lib/wordpress.d";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeaturedPostCardProps {
  post: Post;
  media?: {
    source_url: string;
  } | null;
  category?: {
    name: string;
    id: number;
  } | null;
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function FeaturedPostCard({
  post,
  media,
  category,
  className,
  layout = "vertical",
}: FeaturedPostCardProps) {
  const date = new Date(post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // estimate reading time
  const readingTime = Math.ceil(
    post.content.rendered.replace(/<[^>]*>/g, "").length / 300,
  );

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "card-hover group block overflow-hidden rounded-lg border bg-card",
        layout === "horizontal" ? "md:grid md:grid-cols-2" : "space-y-4",
        "paper-shadow",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden",
          layout === "horizontal" && "md:aspect-auto md:h-full",
        )}
      >
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title?.rendered || "No Image"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {category && (
            <Badge variant="outline" className="rounded-full">
              {category.name}
            </Badge>
          )}
        </div>
        <div>
          <h3
            className="mb-2 text-2xl font-medium transition-colors group-hover:text-primary"
            dangerouslySetInnerHTML={{
              __html: post.title?.rendered || "Untitled",
            }}
          />
          <p
            className="line-clamp-2 text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html:
                post.excerpt?.rendered.replace(/<[^>]*>/g, "") || "No Excerpt",
            }}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{` ${readingTime} minute(s)`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
