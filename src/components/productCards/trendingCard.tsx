import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bungee } from "next/font/google";

import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductCardProps {
  product: Product;
  currency?: string;
  setLocalWishList: React.Dispatch<React.SetStateAction<Product[]>>;
  localWishList: Product[];
}

export default function TrendingCard({
  product,
  currency = "ETB",
  setLocalWishList,
  localWishList,
}: ProductCardProps) {
  const { handleAddToWishlist } = useWishlist();
  const handleAddToWishlistWithOptimisticUpdate = async (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!localWishList.some((item) => item.id === product.id))
      setLocalWishList([...localWishList, product]);
    await handleAddToWishlist(product);
  };
  const router = useRouter();
  return (
    <Card
      className="w-full max-w-md overflow-hidden rounded-xl border-0 shadow-lg"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={product.uploadedCoverImage || "/placeholder.svg"}
          alt={`${product.productName} product image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-800/30" />

        <div className={`absolute bottom-0 left-0 p-6 text-white`}>
          <h2
            className={`text-4xl font-[400] tracking-wider ${bungee.className}`}
          >
            {product.productName}
          </h2>
          <p className="mt-1 text-lg font-light">
            {product.price} {currency}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row sm:gap-3 gap-2">
            <Button className="flex items-center gap-2 bg-green-600 px-4 py-2 hover:bg-green-700 w-full sm:w-auto">
              <ShoppingCart className="h-4 w-4 text-white" />
              <span className="text-white">Purchase Now</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleAddToWishlistWithOptimisticUpdate}
              className="bg-gray-900/90"
            >
              <Heart className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Add to Wishlist</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
