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

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<Heading[]>([]);

  // 提取标题并处理内容
  useEffect(() => {
    const extracted = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g)?.map(heading => {
      const level = heading.charAt(2);
      const text = heading.replace(/<[^>]*>/g, "");
      const id = generateId(text);
      return { level, text, id };
    }) || [];

    setHeadings(extracted);

    // 为文章中的标题添加 id
    const article = document.querySelector('article');
    if (article) {
      article.innerHTML = article.innerHTML.replace(
        /<h([23])[^>]*>(.*?)<\/h\1>/g,
        (match, level, text) => {
          const id = generateId(text);
          return `<h${level} id="${id}">${text}</h${level}>`;
        }
      );
    }
  }, [content]);

  // 监听滚动以更新活动标题
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
      }
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden xl:block fixed right-8 top-32 w-64 rounded-lg bg-card border shadow-sm"
    >
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium">目录</h4>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <nav className="p-4">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={cn(
                "block py-1 text-sm transition-colors hover:text-foreground",
                heading.level === "3" ? "pl-4" : "",
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </ScrollArea>
    </motion.div>
  );
}
