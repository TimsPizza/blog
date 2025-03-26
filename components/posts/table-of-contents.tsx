"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);

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

  // 设置 Intersection Observer
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        // 找到最接近视口顶部的可见标题
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const sorted = visibleEntries.sort((a, b) => {
            const aDistance = Math.abs(a.boundingClientRect.top);
            const bDistance = Math.abs(b.boundingClientRect.top);
            return aDistance - bDistance;
          });
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0% -80% 0%",
        threshold: [0, 1],
      },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });
  }, [headings]);

  // 监听滚动事件并更新活动标题
  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleHeadingClick = (heading: Heading) => {
    const element = document.getElementById(heading.id);
    if (!element) return;

    // temporarily disable observer
    isScrollingRef.current = true;
    setActiveId(heading.id);

    // calc offset
    const offset = heading.level === "2" ? 80 : 60;
    const y = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    // enable overlay after 1s
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000); // wait for scroll animation to finish
  };

  return (
    <motion.div
      id="article-nav"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "left-8 top-32 hidden w-64 bg-transparent xl:block",
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
                handleHeadingClick(heading);
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
