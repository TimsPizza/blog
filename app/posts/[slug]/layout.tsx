"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const pageVariants = {
  initial: { y: 10 },
  animate: { 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    y: -10,
    transition: {
      duration: 0.3
    }
  }
};

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
      <ScrollToTop />
    </>
  );
}
