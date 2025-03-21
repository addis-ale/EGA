"use client";

import { useParams } from "next/navigation";
import ProductUpdateForm from "./productUpdateForm";
import { useGetProductByIdQuery } from "@/state/features/productApi";

export default function Home() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetProductByIdQuery(id as string);
  const product = data?.product;
  console.log(product);

  return (
    <main className="w-full min-h-screen">
      <h1 className="text-3xl font-bold py-8 text-center  text-white">
        Update Product Post
      </h1>
      {product && <ProductUpdateForm singleProduct={product} />}
    </main>
  );
}
