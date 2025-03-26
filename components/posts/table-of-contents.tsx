"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Heading {
  id: string;
  text: string;
  level: string;
}

function generateId(text: string): string {
  return text.toLowerCase().replace(/[^\w]+/g, "-");
}

function extractNumber(text: string): number {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

function extractText(text: string): string {
  return text.replace(/\d+\. /, "");
}

export function TableOfContents({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<Heading[]>([]);

  // 提取标题并处理内容
  useEffect(() => {
    const extracted =
      content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g)?.map((heading) => {
        const level = heading.charAt(2);
        const text = heading.replace(/<[^>]*>/g, "");
        const id = generateId(text);
        return { level, text, id };
      }) || [];

    setHeadings(extracted);

    // add ids to headings
    const article = document.querySelector("article");
    if (article) {
      article.innerHTML = article.innerHTML.replace(
        /<h([23])[^>]*>(.*?)<\/h\1>/g,
        (match, level, text) => {
          const id = generateId(text);
          return `<h${level} id="${id}">${text}</h${level}>`;
        },
      );
    }
  }, [content]);

  // listen for scroll events and update active heading id
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <motion.div
      id="article-nav"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "fixed left-8 top-32 hidden w-64 bg-transparent xl:block",
        className,
      )}
    >
      <div className="border-b p-4">
        <h4 className="text-sm font-medium">Table of Contents</h4>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <nav className="p-4">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const offset = element.tagName === "h2" ? 80 : 40;
                  const y =
                    element.getBoundingClientRect().top +
                    window.scrollY -
                    offset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={cn(
                "inline-block py-1 text-sm transition-colors hover:text-foreground",
                heading.level === "3" ? "pl-4" : "",
                activeId === heading.id
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              <div className="flex flex-row items-start justify-center">
                <span className="h-full min-w-6">{`${extractNumber(heading.text)}.`}</span>
                <span className="ml-1">{extractText(heading.text)}</span>
              </div>
            </a>
          ))}
        </nav>
      </ScrollArea>
    </motion.div>
  );
}
