import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bungee } from "next/font/google";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  currency?: string;
}

export default function TrendingCard({
  name,
  image,
  price,
  currency = "birr",
}: ProductCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden rounded-xl border-0 shadow-lg">
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={image || "/placeholder.svg"}
          alt={`${name} product image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-800/30" />

        <div className={`absolute bottom-0 left-0 p-6 text-white`}>
          <h2
            className={`text-4xl font-[400] tracking-wider ${bungee.className}`}
          >
            {name}
          </h2>
          <p className="mt-1 text-lg font-light">
            {price} {currency}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row sm:gap-3 gap-2">
            <Button className="flex items-center gap-2 bg-green-600 px-4 py-2 hover:bg-green-700 w-full sm:w-auto">
              <ShoppingCart className="h-4 w-4 text-white" />
              <span className="text-white">Purchase Now</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-500 bg-gray-700/60 text-white hover:bg-gray-600 w-full sm:w-auto"
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
