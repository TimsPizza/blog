import { Section, Container } from "@/components/craft";
import { FeaturedPostCard } from "./featured-post-card";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import Image from "next/image";

export async function FeaturedPosts() {
  const posts = (await getAllPosts()).slice(0, 4);
  const medias = await Promise.all(
    posts.map((post) => {
      try {
        getFeaturedMediaById(post.featured_media);
      } catch (e) {
        return { source_url: null };
      }
    }),
  );

  return (
    <Section className="bg-muted/50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link
            href="/posts"
            className="inline-flex items-center text-primary hover:underline"
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-48">
                <Image
                  src={medias[index]?.source_url || "/placeholder.svg"}
                  alt={"No Image"}
                  fill
                  className="m-auto object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="inline-flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="mx-2">•</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold">
                  {post.title.rendered}
                </h3>
                <p className="line-clamp-2 text-muted-foreground">
                  {post.excerpt?.rendered.replace(/<[^>]*>/g, "") ||
                    "No Excerpt"}
                </p>
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center pt-2 text-primary hover:underline"
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
