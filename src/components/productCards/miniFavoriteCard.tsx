import Image from "next/image";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@prisma/client";

interface ProductCardProps {
  onRemove: (productId: string) => void;
  product: Product;
}

export function MiniFavoriteCard({ product, onRemove }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-transparent bg-transparent h-[100px] transition-all duration-200 hover:border-gray-500">
      {/* Cancel button (Appears only on hover) */}
      <button
        onClick={() => onRemove(product.id)}
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
            alt={product.productName}
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
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
