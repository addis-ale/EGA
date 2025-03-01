"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { SignoutModal } from "./dashboard/signout-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { LogOut, Truck } from "lucide-react";
import { usePathname } from "next/navigation";

const CustomeDropDown = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.currentUser.user);
  const pathName = usePathname();
  // Handle toggling of the dropdown menu
  const handleDropdownToggle = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  // Handle clicking signout and opening the modal
  const handleSignoutClick = () => {
    setIsDropDownOpen(false); // Close the dropdown
    setIsModalOpen(true); // Open the sign-out modal
  };

  return (
    <div>
      {user?.role === "ADMIN" ? (
        <DropdownMenu open={isDropDownOpen} onOpenChange={handleDropdownToggle}>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User avatar"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(pathName === "/" ||
              (pathName.startsWith("/") &&
                !pathName.includes("/dashboard"))) && (
              <DropdownMenuLabel>
                <Link href="/dashboard" className="w-full">
                  Your Dashboard
                </Link>
              </DropdownMenuLabel>
            )}
            {pathName.includes("/dashboard") && (
              <DropdownMenuLabel>
                <Link href="/" className="w-full">
                  <div className="flex gap-2">
                    <LogOut />
                    <span>Exit</span>
                  </div>
                </Link>
              </DropdownMenuLabel>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignoutClick}>
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu open={isDropDownOpen} onOpenChange={handleDropdownToggle}>
          <DropdownMenuTrigger className="focus:outline-none">
            <Truck className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Your Orders</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignoutClick}>
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Signout Modal */}
      {isModalOpen && <SignoutModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CustomeDropDown;
