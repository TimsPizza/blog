"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 100,
        delay: delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedList({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0.5 },
        show: {
          opacity: 1,
          transition: {
            duration: 0.2,
            when: "beforeChildren",
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0.8, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 100,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
