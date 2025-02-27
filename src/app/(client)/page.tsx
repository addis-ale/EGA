"use client";
import { useState } from "react";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Container from "@/components/container";
import { dummyData } from "../../../data/catagorizedDummy";
import Trending from "@/components/clientComponents/trending";
import Recommended from "@/components/clientComponents/recommended";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingCardSkeleton from "@/components/productCards/trendingCardSkeleton";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const LIMIT = 3;

  const { data: trending, isLoading } = useGetAllProductsQuery({
    category: "trending",
    page,
    limit: LIMIT,
  });
  const totalProducts = trending?.total || 0; // Ensure it doesn't break if undefined
  const totalPages = Math.ceil(totalProducts / LIMIT);
  //TODO: fetch from the api later
  const recommended = dummyData.recommendations;
  // Calculate total pages from API response (assuming total count is provided)

  return (
    <Container>
      <div className="w-full flex flex-col">
        <HomeBanner />
        {isLoading ? (
          <TrendingCardSkeleton limit={LIMIT} />
        ) : (
          trending && (
            <Trending
              setPage={setPage}
              trending={trending.products}
              totalPages={totalPages}
            />
          )
        )}
        <Recommended recommended={recommended} />
      </div>
    </Container>
  );
};

export default ProductList;
