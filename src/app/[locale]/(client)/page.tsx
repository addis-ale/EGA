"use client";

import Container from "@/components/container";
import { dummyData } from "../../../../data/catagorizedDummy";
import HomeBanner from "@/components/clientComponents/homeBanner";
import Trending from "@/components/clientComponents/trending";
import { useState } from "react";
import { trendingProduct } from "../../../../data/trending";

const ProductList = () => {
  // Recommended products from dummy data
  const recommended = dummyData.recommendations;
  const trending = trendingProduct;
  const [page, setPage] = useState(1);

  return (
    <Container>
      <div className="w-full flex flex-col gap-4">
        <HomeBanner />
        <Trending trending={trending} setPage={setPage} totalPages={4} />
      </div>
    </Container>
  );
};

export default ProductList;
