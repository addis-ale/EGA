"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Package, SortAsc, User, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Container from "@/components/container";

type Filter = {
  id: string;
  label: string;
  category: "price" | "published" | "alphabet" | "age" | "type";
};

export default function FilterInterface() {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const filters: Filter[] = [];

    searchParams?.getAll("price").forEach((value) => {
      filters.push({ id: `price-${value}`, label: value, category: "price" });
    });

    searchParams?.getAll("published").forEach((value) => {
      filters.push({
        id: `published-${value}`,
        label: value,
        category: "published",
      });
    });

    searchParams?.getAll("type").forEach((value) => {
      filters.push({ id: `type-${value}`, label: value, category: "type" });
    });

    searchParams?.getAll("alphabet").forEach((value) => {
      filters.push({
        id: `alphabet-${value}`,
        label: value,
        category: "alphabet",
      });
    });

    searchParams?.getAll("age").forEach((value) => {
      filters.push({ id: `age-${value}`, label: value, category: "age" });
    });

    setActiveFilters(filters);
  }, [searchParams]);

  const addFilter = (filter: Filter) => {
    setActiveFilters((prev) => {
      if (!prev.some((f) => f.id === filter.id)) {
        return [...prev, filter];
      }
      return prev;
    });
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== filterId));
  };

  const clearAll = () => {
    setActiveFilters([]);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const params = new URLSearchParams();

      activeFilters.forEach((filter) => {
        params.append(filter.category, filter.label);
      });

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  return (
    <Container>
      <div className="space-y-4 text-white">
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Price range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-white">
              {["$0 - $20", "$20 - $50", "$50 - $100", "$100+"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    addFilter({
                      id: `price-${label}`,
                      label,
                      category: "price",
                    })
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                Published at
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-white">
              {["Today", "This Week", "This Month", "This Year"].map(
                (label) => (
                  <DropdownMenuItem
                    key={label}
                    onClick={() =>
                      addFilter({
                        id: `published-${label}`,
                        label,
                        category: "published",
                      })
                    }
                  >
                    {label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <Package className="mr-2 h-4 w-4" />
                Product Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-white">
              {["PHYSICAL", "TABLE_TOP"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    addFilter({ id: `type-${label}`, label, category: "type" })
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <SortAsc className="mr-2 h-4 w-4" />
                Alphabet
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-white">
              {["A to Z", "Z to A"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    addFilter({
                      id: `alphabet-${label}`,
                      label,
                      category: "alphabet",
                    })
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <User className="mr-2 h-4 w-4" />
                Age
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 border-zinc-700 text-white">
              {["All Ages", "18+", "21+", "30+"].map((label) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    addFilter({ id: `age-${label}`, label, category: "age" })
                  }
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant="outline"
                className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 px-3 py-1"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-2 hover:text-zinc-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="outline"
              onClick={clearAll}
              className="ml-2 bg-white text-black hover:bg-zinc-100"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
