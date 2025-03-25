import { Hero } from "@/components/home/hero";
import { FeaturedPosts } from "@/components/home/featured-posts";
import NewsLetter from "@/components/home/newsletter";

export default function Home() {
  return (
    <main className="h-full">
      <Hero />
      <FeaturedPosts />
      <NewsLetter />
    </main>
  );
}
