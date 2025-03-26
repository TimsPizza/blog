"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject, useEffect, useRef } from "react";

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
        scrub: true,
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
