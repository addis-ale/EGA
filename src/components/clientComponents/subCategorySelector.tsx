"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, Dices, Users } from "lucide-react";

interface GameSubcategoryProps {
  onCategoryChange: (category: string) => void;
  initialCategory?: string;
}

export default function GameSubcategorySelector({
  onCategoryChange,
  initialCategory = "ALL",
}: GameSubcategoryProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const categories = [
    {
      id: "ALL",
      name: "All Games",
      icon: <Gamepad2 className="h-5 w-5 mr-2" />,
    },
    {
      id: "Table Top Game",
      name: "Table Top Games",
      icon: <Dices className="h-5 w-5 mr-2" />,
    },
    {
      id: "Physical Game",
      name: "Physical Games",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      id: "Digital Game",
      name: "Digital Games",
      icon: <Gamepad2 className="h-5 w-5 mr-2" />,
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Game Categories</h2>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 ${
              activeCategory === category.id
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.icon}
            <span className="hidden sm:inline">{category.name}</span>
            <span className="sm:hidden">{category.name.split(" ")[0]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
