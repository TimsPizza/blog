"use client";

import { Post } from "@/lib/wordpress.d";
import {
  AnimatedSection,
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "./table-of-contents";
import { ReadingProgress } from "./reading-progress";
import Image from "next/image";
import { Calendar, Clock, Share2 } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/craft";

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
  const [copied, setCopied] = useState(false);

  // estimate reading time
  const readingTime = Math.ceil(
    post.content.rendered.replace(/<[^>]*>/g, "").length / 300,
  );

  // 格式化日期
  const date = new Date(post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    console.log("Sharing:", post.title.rendered);
    try {
      await navigator.share({
        title: post.title.rendered,
        url: window.location.href,
      });
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Error when trying to copy:", err);
    }
  };

  return (
    <>
      <ReadingProgress />
      <div className="relative">
        <article className="prose prose-lg relative mx-auto prose-headings:text-foreground/90 prose-p:text-foreground/80">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="ml-auto"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {copied ? "Link copied" : "Share"}
                  </Button>
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
                className="reading-prose"
                dangerouslySetInnerHTML={{
                  __html: post.content?.rendered || "",
                }}
              />
            </AnimatedListItem>
          </Container>
        </article>

        <TableOfContents content={post.content?.rendered || ""} />
      </div>
    </>
  );
}
