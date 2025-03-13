"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce"; // Custom debounce hook

export function SearchBar() {
  const t = useTranslations("NavBar");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize searchQuery from the URL
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );

  // Debounce the search query to avoid frequent URL updates
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Update the URL when the debounced search query changes
  useEffect(() => {
    const query = new URLSearchParams(searchParams?.toString());

    if (debouncedSearchQuery.trim()) {
      query.set("searchQuery", debouncedSearchQuery);
    } else {
      query.delete("searchQuery"); // Remove searchQuery if it's empty
    }

    // Navigate to /en/filter if not already there
    if (pathname !== "/en/filter") {
      router.replace(`/en/filter?${query.toString()}`);
    } else {
      router.replace(`/en/filter?${query.toString()}`); // Replace the current history entry
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Search className="h-6 w-6 text-white" />
      <Input
        placeholder={t("search")}
        onChange={handleChange}
        value={searchQuery}
        className="w-72 sm:w-96 bg-white text-black border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
