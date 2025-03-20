import { Section, Container } from "@/components/craft";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site.config";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <Section className="relative h-full overflow-hidden">
      <Container className="relative py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8 text-center">
            <h1 className="bg-clip-text text-3xl font-medium text-foreground sm:text-5xl md:text-6xl">
              {siteConfig.site_name}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {siteConfig.site_description}
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-12 px-6" asChild>
                <Link href="/posts">
                  All Posts <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="h-12 px-6" variant="outline" asChild>
                <Link href="/posts/categories">By Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.02]" />
        <div className="absolute inset-0" />
      </div>
    </Section>
  );
}
