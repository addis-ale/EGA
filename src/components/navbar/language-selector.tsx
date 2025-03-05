"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UnitedStatesFlag from "../flags/us";
import EthiopiaFlag from "../flags/et";

type Language = {
  name: string;
  code: string;
  flag: React.ReactNode;
  region?: string;
};

const languages: Language[] = [
  {
    name: "English",
    code: "en",
    flag: <UnitedStatesFlag />,
    region: "United States",
  },
  {
    name: "አማርኛ",
    code: "am",
    flag: <EthiopiaFlag />,
  },
];

export function LanguageSelector() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    const currentPath = window.location.pathname.split("/").slice(2).join("/"); // Get the current route without the lang prefix
    router.replace(`/${language.code}/${currentPath}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white"
          aria-label="Select Language"
        >
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center">
              {selectedLanguage.flag}
            </span>
            <span className="text-sm hidden sm:inline">
              {selectedLanguage.name}
              {selectedLanguage.region && ` (${selectedLanguage.region})`}
            </span>
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-gray-900 border border-gray-700"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex items-center gap-2 text-white hover:bg-gray-800 cursor-pointer px-4 py-2"
            onClick={() => handleLanguageChange(language)}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {language.flag}
            </span>
            <span>
              {language.name}
              {language.region && ` (${language.region})`}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
