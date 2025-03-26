"use client";
import React, { useEffect, useRef } from "react";
import {usePathname} from "next/navigation"
import gsap from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = usePathname();
  const elementRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  console.log("PageTransition render");
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      if (isFirstMount.current) {
        isFirstMount.current = false;
        gsap.set(element, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline();
      
      : 0 开始
      gsap.set(element, { opacity: 0 });

      
      tl.to(element, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        clearProps: "opacity" 
      });
    }, element);

    return () => ctx.revert(); 
  }, [location]); 

  return (
    <div
      ref={elementRef}
      className="h-full w-full"
      style={{ opacity: 0 }} 
    >
      {children}
    </div>
  );
};


export default React.memo(PageTransition);