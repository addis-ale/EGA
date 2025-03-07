"use client";

import Container from "@/components/container";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Trending from "@/components/clientComponents/trending";
import { useState } from "react";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import TrendingSkeleton from "@/components/productCards/trendingCardSkeleton";
//import { PriceDetails, Product, Review, VideoUploaded } from "@prisma/client";
// interface ProductType {
//   product: Product & {
//     priceDetails: PriceDetails;
//     videoUploaded: VideoUploaded;
//     reviews: Review[];
//   };
// }

const LIMIT = 3;
const ProductList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllProductsQuery({
    limit: LIMIT,
    page,
  });
  const totalTrendingProducts = data?.totalProducts;

  const totalPages = Math.ceil((totalTrendingProducts || 0) / LIMIT);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trendingProducts = data?.products.map((product: any) => ({
    ...product,
    priceDetails: product.priceDetails || {},
    videoUploaded: product.videoUploaded || {},
    reviews: product.reviews || [],
  }));
  console.log(trendingProducts);
  console.log(totalTrendingProducts);

  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
        <HomeBanner />
        {isLoading ? (
          <TrendingSkeleton />
        ) : (
          trendingProducts && (
            <Trending
              trending={trendingProducts}
              setPage={setPage}
              totalPages={totalPages}
            />
          )
        )}
      </div>
    </Container>
  );
};

export default ProductList;
