"use client";

import { AnimatedListItem } from "@/components/animations/animated-section";
import { Container } from "@/components/craft";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/wordpress.d";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { ReadingProgress } from "./reading-progress";
import { TableOfContents } from "./table-of-contents";

interface ArticleProps {
  post: Post;
  author?: {
    name: string;
  } | null;
  category?: {
    name: string;
  } | null;
  media?: {
    source_url: string;
  } | null;
}

export function ArticleView({ post, category, media }: ArticleProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  // estimate reading time
  const readingTime = Math.ceil(
    post.content.rendered.replace(/<[^>]*>/g, "").length / 300,
  );

  const date = new Date(post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ReadingProgress articleRef={articleRef} />
      <div ref={articleRef} className="relative">
        <article className="prose relative mx-auto lg:prose-lg xl:prose-xl 2xl:prose-2xl prose-headings:text-foreground/90 prose-p:text-foreground/80">
          <Container className="mb-12 space-y-8">
            <AnimatedListItem>
              <header className="not-prose">
                <h1
                  className="mb-4 text-4xl font-bold tracking-tight text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: post.title?.rendered || "Untitled",
                  }}
                />
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {category && (
                    <Badge variant="outline" className="rounded-full">
                      {category.name}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{` ${readingTime} minute(s)`}</span>
                  </div>
                </div>
              </header>
            </AnimatedListItem>

            {media?.source_url && (
              <AnimatedListItem>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={media.source_url}
                    alt={post.title?.rendered || "No Image"}
                    className="object-cover"
                    fill
                    priority
                  />
                </div>
              </AnimatedListItem>
            )}

            <AnimatedListItem>
              <div
                id="article-content"
                className="reading-prose"
                dangerouslySetInnerHTML={{
                  __html: post.content?.rendered || "",
                }}
              />
            </AnimatedListItem>
          </Container>
        </article>

        <TableOfContents
          className="hidden md:!fixed"
          content={post.content?.rendered || ""}
        />
      </div>
    </>
  );
}
