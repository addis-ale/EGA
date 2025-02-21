import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { LogInDialog } from "./login-dialog";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="flex h-16 px-12">
        {/* Left Section - Divider and Logo */}
        <div className="flex items-center gap-8  px-4 ">
          <Link href="/" className="text-2xl  font-bold text-white">
            EGA
          </Link>
          <Separator
            orientation="vertical"
            className="h-8 bg-white flex justify-end"
          />
        </div>

        {/* Center Section - Search and Navigation */}
        <div className="flex-1 flex justify-center">
          <div className="max-w-6xl w-full flex items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <Search className="h-6 w-6 text-white" />
                <Input
                  placeholder="Search games..."
                  className="w-[320px] bg-white text-black border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm text-white hover:text-gray-300"
                >
                  Home
                </Link>
                <Link
                  href="/filter"
                  className="text-sm text-white hover:text-gray-300 font-semibold"
                >
                  Filter
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-white"
                  >
                    <span className="text-sm">English(United States)</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900">
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Español</DropdownMenuItem>
                  <DropdownMenuItem>Français</DropdownMenuItem>
                  <DropdownMenuItem>Deutsch</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white"
              >
                <ShoppingCart className="h-8 w-8" />
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] font-bold">
                  2
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="h-8 bg-white" />
          <LogInDialog />
        </div>
      </div>
    </header>
  );
}
