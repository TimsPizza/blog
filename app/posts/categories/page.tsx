import { getAllCategories } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";
import { CatIcon } from "lucide-react";
import CatIconByName from "@/components/ui/cat-icon";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all categories of our blog posts",
  alternates: {
    canonical: "/posts/categories",
  },
};

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-2xl font-bold">Explore Topics</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((topic, index) => (
            <Link
              key={index}
              href={`/posts/?category=${topic.id}`}
              className="group flex flex-col items-center rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary/50 hover:bg-accent hover:!text-accent-foreground"
            >
              <div className="mb-3 rounded-full bg-primary/10 p-3 text-inherit group-hover:bg-gray-400/20">
                <CatIconByName category={topic.name} />
              </div>
              <h3 className="font-medium">{topic.name}</h3>
              <p className="mt-1 text-sm">{`${topic.count} Article(s)`}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
