import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCartItemsQuery } from "@/state/features/cartApi";
import { usePathname, useRouter } from "next/navigation";

export function CartButton() {
  const router = useRouter();
  const { data } = useGetCartItemsQuery();
  const totalQuantity =
    data?.cart.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0;
  const pathname = usePathname(); // Get current path
  const currentPath = pathname.split("/").slice(0, 2).join("/");
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white hover:bg-gray-500"
      onClick={() => router.push(`${currentPath}/cart`)}
    >
      <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
      <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-orange-500 text-[10px] font-bold ">
        {totalQuantity}
      </span>
    </Button>
  );
}
