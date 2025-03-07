"use client";

import Container from "@/components/container";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Trending from "@/components/clientComponents/trending";
import { useState } from "react";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingSkeleton from "@/components/productCards/trendingCardSkeleton";
import Recommended from "@/components/clientComponents/recommended";

const LIMIT_3 = 3; // Limit for the first set of trending products
const LIMIT_12 = 12; // Limit for the recommended products

const ProductList = () => {
  const [page, setPage] = useState(1);

  // Fetch trending products with limit 3 and page
  const { data: trending, isLoading } = useGetAllProductsQuery({
    category: "trending",
    limit: LIMIT_3,
    page,
  });

  // Fetch recommended category products with limit 12 and page
  const { data: recommended, isLoading: isRecommendedLoading } =
    useGetAllProductsQuery({
      limit: LIMIT_12,
      page,
    });

  const totalTrendingProducts = trending?.totalProducts;
  const totalRecommendedProducts = recommended?.totalProducts;

  const totalPages = Math.ceil((totalTrendingProducts || 0) / LIMIT_3);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trendingProducts = trending?.products.map((product: any) => ({
    ...product,
    priceDetails: product.priceDetails || {},
    videoUploaded: product.videoUploaded || {},
    reviews: product.reviews || [],
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recommendedProducts = recommended?.products.map((product: any) => ({
    ...product,
    priceDetails: product.priceDetails || {},
    videoUploaded: product.videoUploaded || {},
    reviews: product.reviews || [],
  }));

  console.log(trendingProducts);
  console.log(totalTrendingProducts);
  console.log(recommendedProducts);
  console.log(totalRecommendedProducts);

  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
        <HomeBanner />
        {isLoading || isRecommendedLoading ? (
          <TrendingSkeleton />
        ) : (
          <>
            {trendingProducts && (
              <Trending
                trending={trendingProducts}
                setPage={setPage}
                totalPages={totalPages}
              />
            )}
            {recommendedProducts && (
              <Recommended recommended={recommendedProducts} />
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
