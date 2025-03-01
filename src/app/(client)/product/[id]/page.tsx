"use client";

import Container from "@/components/container";
//import { useGetProductByIdQuery } from "@/state/features/productApi";
import { useParams } from "next/navigation";
import DetailHero from "./detailHero";
import { dummyReviews } from "../../../../../data/dummyReview";
import { ReviewSlider } from "@/components/clientComponents/reviewSection";

const ProductDetail = () => {
  const { id } = useParams();

  //   const {
  //     data: product,
  //     isLoading,
  //     isError,
  //   } = useGetProductByIdQuery(id as string);
  //TODO: fetch the review for the respective product including the reviewers data
  const review = dummyReviews;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <DetailHero />
        {/* <ReviewSlider reviews={review} /> */}
      </div>
    </Container>
  );
};

export default ProductDetail;
