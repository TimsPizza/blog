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
      
      // 确保动画从 opacity: 0 开始
      gsap.set(element, { opacity: 0 });

      // 简单的淡入动画
      tl.to(element, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        clearProps: "opacity" // 动画结束后清除样式
      });
    }, element);

    return () => ctx.revert(); // 清理动画上下文
  }, [location]); // 只在路径变化时触发

  return (
    <div
      ref={elementRef}
      className="h-full w-full"
      style={{ opacity: 0 }} // 初始状态设为透明
    >
      {children}
    </div>
  );
};

// 使用 memo 优化性能
export default React.memo(PageTransition);