"use client";
import { useState } from "react";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Container from "@/components/container";
import { dummyData } from "../../../data/catagorizedDummy";
import Trending from "@/components/clientComponents/trending";
import Recommended from "@/components/clientComponents/recommended";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingCardSkeleton from "@/components/productCards/trendingCardSkeleton";
import ProductCarousel from "@/components/clientComponents/dealOfTheWeek";
import ProductCarouselSkeleton from "@/components/productCards/productCarousalSkeleton";

const ProductList = () => {
  //trending
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
  //deal of the week

  const { data: dealOfTheWeek, isLoading: dealLoading } =
    useGetAllProductsQuery({
      category: "deal-of-the-week",
    });
  const totaldeal = dealOfTheWeek?.total;
  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
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
        {dealLoading ? (
          <ProductCarouselSkeleton />
        ) : (
          dealOfTheWeek && (
            <ProductCarousel
              dealOfTheWeek={dealOfTheWeek.products}
              totaldeal={totaldeal || 0}
            />
          )
        )}
        {/* TODO: top rated after review section  */}
      </div>
    </Container>
  );
};

export default ProductList;
