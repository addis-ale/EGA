import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";

export function WishlistButton() {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const currentPath = pathname.split("/").slice(0, 2).join("/");
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white hover:bg-gray-500"
      onClick={() => router.push(`${currentPath}/wishlist`)}
    >
      <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
    </Button>
  );
}
