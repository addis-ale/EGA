import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bungee } from "next/font/google";
import { Manrope } from "next/font/google";
import { Product } from "@prisma/client";
import { truncateText } from "@/utils/helper";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add required weights
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface RecommendationCardProps {
  product: Product;
  onClick?: () => void;
  currency?: string;
}

export function RecommendedCard({
  product,
  onClick,
  currency = "ETB",
}: RecommendationCardProps) {
  // Calculate the discounted price
  const discountedPrice =
    product.price - product.price * (product.discountPercentage / 100);

  return (
    <Card
      className={cn(
        "overflow-hidden w-full max-w-xs bg-zinc-900 text-white border-none cursor-pointer transition-transform flex flex-col gap-6"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={product.uploadedCoverImage || "/placeholder.svg"}
          alt={truncateText(product.productName)}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <CardContent className="px-2">
        <div className="flex flex-col">
          <h3 className={`text-2xl font-bold uppercase ${bungee.className}`}>
            {truncateText(product.productName)}
          </h3>
          <p className="text-zinc-400">{product.gameType}</p>

          {/* Discount Badge */}
          <div className="flex items-center gap-3">
            {product.discountPercentage > 0 && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-none">
                -{product.discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Price Section */}
          <div
            className={`flex items-center justify-between ${manrope.className}`}
          >
            {product.discountPercentage > 0 && (
              <span className="relative text-zinc-500 text-xs font-medium ">
                {product.price.toFixed(2)} {currency}
                {/* Slash Effect */}
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full bg-shadGray rotate-[-10deg]"></span>
              </span>
            )}
            <span className="text-xl font-normal text-zinc-400">
              {discountedPrice.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
