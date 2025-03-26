"use client";

import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ReadingProgressProps {
  articleRef: RefObject<HTMLDivElement>;
}

export function ReadingProgress({ articleRef }: ReadingProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!articleRef.current || !progressRef.current) return;

    const animation = gsap.to(progressRef.current, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: articleRef.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [articleRef]);

  return (
    <div
      ref={progressRef}
      className="reading-progress fixed left-0 top-0 z-50 h-1 w-0 bg-primary"
      style={{ transformOrigin: "0% 50%" }}
    />
  );
}
