/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Container from "@/components/container";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Trending from "@/components/clientComponents/trending";
import Recommended from "@/components/clientComponents/recommended";
import { useState } from "react";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingSkeleton from "@/components/productCards/trendingCardSkeleton";
import TopRated from "@/components/clientComponents/topRated";
import SubCategory from "./subCatagorySection";
import ProductCarousel from "@/components/clientComponents/dealoftheweek";

const LIMIT_3 = 3; // Limit for the first set of trending products
const LIMIT_12 = 12; // Limit for the recommended products
const LIMIT_6 = 6; // Limit for the top-rated products

const ProductList = () => {
  const [page, setPage] = useState(1);

  // Fetch trending products
  const { data: trending, isLoading } = useGetAllProductsQuery({
    category: "trending",
    limit: LIMIT_3,
    page,
  });

  // Fetch recommended products
  const { data: recommended, isLoading: isRecommendedLoading } =
    useGetAllProductsQuery({
      category: "recommended",
      limit: LIMIT_12,
      page,
    });

  // Fetch top-rated products
  const { data: topRated, isLoading: isTopRatedLoading } =
    useGetAllProductsQuery({
      category: "top-rated",
      limit: LIMIT_6,
      page,
    });

  // Fetch Deal of the Week product
  const { data: dealOfTheWeek, isLoading: isDealLoading } =
    useGetAllProductsQuery({
      category: "deal-of-the-week",
    });

  const totalTrendingProducts = trending?.totalProducts;
  const totaldeal = dealOfTheWeek?.totalProducts;

  const totalPages = Math.ceil((totalTrendingProducts || 0) / LIMIT_3);

  // Process product lists
  const formatProductData = (products: any) =>
    products?.map((product: any) => ({
      ...product,
      priceDetails: product.priceDetails || {},
      videoUploaded: product.videoUploaded || {},
      reviews: product.reviews || [],
    })) || [];

  const trendingProducts = formatProductData(trending?.products);
  const recommendedProducts = formatProductData(recommended?.products);
  const topRatedProducts = formatProductData(topRated?.products);
  const dealOfTheWeekProduct = formatProductData(dealOfTheWeek?.products);

  console.log("Trending:", trendingProducts);
  console.log("Recommended:", recommendedProducts);
  console.log("Top Rated:", topRatedProducts);
  console.log("Deal of the Week:", dealOfTheWeekProduct);

  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
        <HomeBanner />
        {isLoading ||
        isRecommendedLoading ||
        isTopRatedLoading ||
        isDealLoading ? (
          <TrendingSkeleton />
        ) : (
          <>
            {trendingProducts.length > 0 && (
              <Trending
                trending={trendingProducts}
                setPage={setPage}
                totalPages={totalPages}
              />
            )}
            {recommendedProducts.length > 0 && (
              <Recommended recommended={recommendedProducts} />
            )}

            <SubCategory />
            {topRatedProducts.length > 0 && (
              <TopRated recommended={topRatedProducts} />
            )}
            {dealOfTheWeekProduct.length > 0 && (
              <ProductCarousel
                dealOfTheWeek={dealOfTheWeekProduct}
                totaldeal={totaldeal || 0}
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default ProductList;
