"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/lib/wordpress.d";

interface SearchFilterProps {
  categories: Category[];
}

export function SearchFilter({ categories }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    const query = createQueryString({
      q: searchQuery || null,
      sort: sortBy,
    });
    router.push(`/posts?${query}`);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const query = createQueryString({
      q: searchQuery || null,
      sort: e.target.value,
      category: searchParams.get("category"),
    });
    router.push(`/posts?${query}`);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const query = createQueryString({
      q: searchQuery || null,
      sort: sortBy,
      category: e.target.value || null,
    });
    router.push(`/posts?${query}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Search for Posts
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter keywords to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-[180px] space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Sort By
          </label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="date">Publish Time - Newest</option>
            <option value="date-asc">Publish Time - Oldest</option>
            <option value="views">Views - Highest</option>
            <option value="views-asc">Views - Lowest</option>
          </select>
        </div>

        <div className="w-[180px] space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={searchParams.get("category") || ""}
            onChange={handleCategory}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          className="mt-auto"
          onClick={() => {
            setSearchQuery("");
            setSortBy("date");
            router.push("/posts");
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
