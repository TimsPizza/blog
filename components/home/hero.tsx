import { ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GoChevronDown } from "react-icons/go";

export function Hero() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12 md:py-20 lg:mx-40">
        <div className="relative grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6 self-start">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <Tag className="mr-2 h-4 w-4" />
              <span>Tech | Essay | Learning</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              tim&apos;s nest
            </h1>

            <p className="font-lxgw text-lg text-muted-foreground">
              Hi, I'm Peisen (Tim), this is my personal blog and mind zone. I
              share my thoughts, learning notes, and technical articles here.
              Feel free to explore and learn with me!
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/posts/categories"
                className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                By Categories
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md md:ml-auto">
            <Image
              src="/hero.png"
              alt="Blog illustration"
              width={400}
              height={400}
              className="rounded-lg object-cover shadow-lg"
              priority
            />
          </div>

          <div>
            <GoChevronDown className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce text-4xl text-muted-foreground" />
          </div>
        </div>
      </section>
    </div>
  );
}
