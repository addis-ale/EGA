"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce"; // Import debounce hook

export function SearchBar() {
  const t = useTranslations("NavBar");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = pathname.split("/").slice(0, 2).join("/");

  // Initialize searchQuery from URL
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("keyword") || ""
  );
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (value.trim() === "") {
        // Remove 'keyword' from the URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("keyword");
        router.push(`${currentPath}/filter?${params.toString()}`);
      }
    },
    [router, searchParams, currentPath]
  );

  // Handle Enter key press to trigger navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && debouncedSearch.trim()) {
      router.push(
        `${currentPath}/filter?keyword=${encodeURIComponent(debouncedSearch)}`
      );
    }
  };

  // **Clear search when leaving /filter**
  useEffect(() => {
    if (!pathname.includes("/filter")) {
      setSearchQuery(""); // Clear state
    }
  }, [pathname, router, searchParams, currentPath]);

  return (
    <div className="flex items-center gap-4">
      <Search className="h-6 w-6 text-white" />
      <Input
        placeholder={t("search")}
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-72 sm:w-96 bg-white text-black border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
