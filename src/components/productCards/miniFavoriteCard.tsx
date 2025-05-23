import Image from "next/image";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@prisma/client";
import { useAddToCartMutation } from "@/state/features/cartApi";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
interface ProductCardProps {
  product: Product;
}

export function MiniFavoriteCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [addCartItem] = useAddToCartMutation();
  const handleAddTocart = () => {
    if (product && product.id) {
      addCartItem({ productId: product.id, quantity: 1 })
        .unwrap()
        .then(() => {
          toast({
            title: "Product added to cart",
            description: `${product.productName} has been added to your cart.`,
            className: "bg-teal text-white",
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Failed to add to cart",
            description: "Something went wrong.",
            variant: "destructive",
          });
        });
    }
  };
  const { handleToggleWishlist } = useWishlist();

  const handleDeleteWishlist = () => {
    handleToggleWishlist(product);
  };
  return (
    <Card className="group relative overflow-hidden border border-transparent bg-transparent h-[100px] transition-all duration-200 hover:border-gray-500">
      {/* Cancel button (Appears only on hover) */}
      <button
        onClick={handleDeleteWishlist}
        className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center text-red-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-label="Remove from favorites"
      >
        <X className="h-4 w-4" />
      </button>

      <CardContent className="flex gap-2 items-center h-full p-2">
        {/* Image */}
        <div className="relative h-[80px] w-[60px] flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={product.uploadedCoverImage || "/placeholder.svg"}
            alt={product.productName || "/placeholder.svg"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 60px, 60px"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-white leading-tight">
              {product.productName}
            </h3>
            <p className="text-xs text-gray-400">{product.gameType}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-7 w-full bg-green-600 text-xs text-white hover:bg-green-700"
            onClick={handleAddTocart}
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
