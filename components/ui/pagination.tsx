"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={createPageUrl(currentPage - 1)} scroll={false}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          const isEllipsis =
            page !== 1 &&
            page !== totalPages &&
            (page < currentPage - 1 || page > currentPage + 1);

          if (isEllipsis) {
            return page === currentPage - 2 || page === currentPage + 2 ? (
              <span key={page} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : null;
          }

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="icon"
              asChild
            >
              <Link href={createPageUrl(page)} scroll={false}>
                {page}
              </Link>
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage >= totalPages}
      >
        <Link href={createPageUrl(currentPage + 1)} scroll={false}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
