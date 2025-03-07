"use client";

import Container from "@/components/container";
import { useGetProductByIdQuery } from "@/state/features/productApi";
import { useParams } from "next/navigation";
import DetailHero from "./detailHero";
import { dummyReviews } from "../../../../../../data/dummyReview";
import { ReviewCarousel } from "@/components/clientComponents/reviewSection";
import { DetailHeroSkeleton } from "@/components/clientComponents/detailHeroSkeleton";
const ProductDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetProductByIdQuery(id as string);
  const product = data?.product;

  //TODO: fetch the review for the respective product including the reviewers data
  const review = dummyReviews;
  //TODO: fetch related product also
  return (
    <Container>
      <div className="flex flex-col gap-4 py-4">
        {isLoading ? (
          <DetailHeroSkeleton />
        ) : (
          product && <DetailHero product={product} />
        )}
        <ReviewCarousel review={review} />
      </div>
    </Container>
  );
};

export default ProductDetail;
