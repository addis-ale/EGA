"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogInDialog } from "./modals/loginModal";

import {
  type CurrentUserState,
  setUser,
} from "@/state/features/currentUserSlice";
import { MobileSearch } from "./navbar/mobile-search";
import { SearchBar } from "./navbar/search-bar";
import { NavLinks } from "./navbar/nav-links";
import { LanguageSelector } from "./navbar/language-selector";
import { CartButton } from "./navbar/cart-button";
import CustomeDropDown from "./customeDropDown";

export function NavBar({ user }: CurrentUserState) {
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="sticky top-8 md:top-0 z-50 bg-black border-b border-gray-800 w-full">
      <div className="flex h-16  px-4 lg:px-12 items-center justify-between w-full">
        <Logo />
        <DesktopNavigation
          isSearchOpen={isSearchOpen}
          toggleSearch={toggleSearch}
        />
        <UserActions user={user} />
      </div>
      <MobileSearch isOpen={isSearchOpen} />
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-4 lg:gap-8">
      <Link href="/" className="text-2xl font-bold text-white">
        EGA
      </Link>
    </div>
  );
}

function DesktopNavigation({
  isSearchOpen,
  toggleSearch,
}: {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}) {
  return (
    <div className="flex-1 flex justify-center items-center max-w-full">
      <div className="w-full max-w-4xl lg:max-w-6xl flex items-center justify-between px-2 lg:px-4">
        <div className="hidden lg:flex items-center gap-8">
          <SearchBar />
          <NavLinks />
        </div>
        <MobileSearchToggle
          isSearchOpen={isSearchOpen}
          toggleSearch={toggleSearch}
        />
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <CartButton />
        </div>
      </div>
    </div>
  );
}

function MobileSearchToggle({
  isSearchOpen,
  toggleSearch,
}: {
  isSearchOpen: boolean;
  toggleSearch: () => void;
}) {
  return (
    <div className="lg:hidden flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="text-white"
        onClick={toggleSearch}
      >
        {isSearchOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Search className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}

function UserActions({ user }: CurrentUserState) {
  return (
    <div className="flex items-center gap-2 px-2 lg:px-4">
      <Separator
        orientation="vertical"
        className="h-8 bg-white hidden lg:block"
      />
      {user ? <CustomeDropDown /> : <LogInDialog />}
    </div>
  );
}
