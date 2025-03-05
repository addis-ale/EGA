"use client";
import { useState, useEffect } from "react";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Container from "@/components/container";
import { dummyData } from "../../../data/catagorizedDummy";
import Trending from "@/components/clientComponents/trending";
import Recommended from "@/components/clientComponents/recommended";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingCardSkeleton from "@/components/productCards/trendingCardSkeleton";
import ProductCarouselSkeleton from "@/components/productCards/productCarousalSkeleton";
import { useGetWishlistQuery } from "@/state/features/whishlistApi";
import ProductCarousel from "@/components/clientComponents/dealoftheweek";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const LIMIT = 3;
  const { data: trending, isLoading: trendingLoading } = useGetAllProductsQuery(
    {
      category: "trending",
      page,
      limit: LIMIT,
    }
  );

  const totalProducts = trending?.total || 0;
  const totalPages = Math.ceil(totalProducts / LIMIT);

  // TODO: get recommended from you database
  const recommended = dummyData.recommendations;

  // Fetching wishlist data
  const { data: fav, isLoading: favLoading } = useGetWishlistQuery();
  const [localWishlist, setLocalWishlist] = useState(fav?.wishlist || []);

  // Deal of the week
  const { data: dealOfTheWeek, isLoading: dealLoading } =
    useGetAllProductsQuery({
      category: "deal-of-the-week",
    });

  const totaldeal = dealOfTheWeek?.total;

  // Synchronize local wishlist with fetched data
  useEffect(() => {
    if (fav?.wishlist) {
      setLocalWishlist(fav.wishlist);
    }
  }, [fav?.wishlist]);

  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
        <HomeBanner />

        {/* Trending products */}
        {trendingLoading ? (
          <TrendingCardSkeleton />
        ) : (
          trending && (
            <Trending
              setPage={setPage}
              trending={trending.products}
              totalPages={totalPages}
              setLocalWishList={setLocalWishlist}
              localWishList={localWishlist}
            />
          )
        )}

        {/* Recommended products */}
        {fav && (
          <Recommended
            recommended={recommended}
            localWishList={localWishlist}
            setLocalWishList={setLocalWishlist}
            loading={favLoading}
          />
        )}

        {/* Deal of the week */}
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
      </div>
    </Container>
  );
};

export default ProductList;
