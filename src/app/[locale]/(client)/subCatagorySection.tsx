"use client";

import GameSubcategorySelector from "@/components/clientComponents/subCategorySelector";
import TrendingCard from "@/components/productCards/trendingCard";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import { PriceDetails, Product, Review, VideoUploaded } from "@prisma/client";
import { useState } from "react";

// Define the ProductType interface
interface ProductType extends Product {
  priceDetails: PriceDetails;
  videoUploaded: VideoUploaded[];
  reviews: Review[];
}

// Ensure that each product includes the necessary properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ensureProductType = (product: any): ProductType => {
  return {
    ...product,
    priceDetails: product.priceDetails || { price: 0, currency: "ETB" },
    videoUploaded: product.videoUploaded || [],
    reviews: product.reviews || [],
  };
};

export default function SubCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const { data: products } = useGetAllProductsQuery({
    gameTypeFilter: selectedCategory,
  });
  const filteredProducts = products?.products.map(ensureProductType);

  return (
    <div className="container mx-auto px-4 py-8">
      <GameSubcategorySelector
        onCategoryChange={setSelectedCategory}
        initialCategory="ALL"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts &&
          filteredProducts.map((product) => (
            <TrendingCard key={product.id} product={product} />
          ))}
      </div>

      {filteredProducts && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">
            No products found in this category
          </h3>
          <p className="text-muted-foreground mt-2">
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
}
