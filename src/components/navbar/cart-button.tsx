import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartButton() {
  return (
    <Button variant="ghost" size="icon" className="relative text-white">
      <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
      <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] font-bold">
        2
      </span>
    </Button>
  );
}
