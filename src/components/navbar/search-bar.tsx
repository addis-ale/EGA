import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function SearchBar() {
  const t = useTranslations("NavBar");

  return (
    <div className="flex items-center gap-4">
      <Search className="h-6 w-6 text-white" />
      <Input
        placeholder={t("search")}
        className="w-72 sm:w-96 bg-white text-black border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
