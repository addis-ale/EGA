import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bungee } from "next/font/google";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Add required weights
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface RecommendationCardProps {
  image: string;
  name: string;
  type: string;
  originalPrice: number;
  discountPercentage: number;
  currency?: string;
  className?: string;
  onClick?: () => void;
}

export function RecommendedCard({
  image,
  name,
  type,
  originalPrice,
  discountPercentage,
  currency = "birr",
  className,
  onClick,
}: RecommendationCardProps) {
  // Calculate the discounted price
  const discountedPrice =
    originalPrice - originalPrice * (discountPercentage / 100);

  return (
    <Card
      className={cn(
        "overflow-hidden w-full max-w-xs bg-zinc-900 text-white border-none cursor-pointer transition-transform flex flex-col gap-6",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <CardContent className="px-2">
        <div className="flex flex-col">
          <h3 className={`text-2xl font-bold uppercase ${bungee.className}`}>
            {name}
          </h3>
          <p className="text-zinc-400">{type}</p>

          {/* Discount Badge */}
          <div className="flex items-center gap-3">
            {discountPercentage > 0 && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-none">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Price Section */}
          <div
            className={`flex items-center justify-between ${manrope.className}`}
          >
            {discountPercentage > 0 && (
              <span className="relative text-zinc-500 text-xs font-medium ">
                {originalPrice.toFixed(2)} {currency}
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
