import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCartItemsQuery } from "@/state/features/cartApi";
import { useRouter } from "next/navigation";

export function CartButton() {
  const { data } = useGetCartItemsQuery();
  const totalQuantity = data?.totalQuantity ?? 0;
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
      <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-orange-500 text-[10px] font-bold">
        {totalQuantity}
      </span>
    </Button>
  );
}
