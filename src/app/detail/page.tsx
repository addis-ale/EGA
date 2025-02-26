"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ProductProps = {
  uploadedCoverImage: string;
  productName: string;
  gameType: string;
  rating: number;
  ageRestriction: number;
};

type DetailProps = {
  params: { id: string };
};

export default function Detail({ params }: DetailProps) {
  const { id: productId } = params;
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleItemAdd() {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "123",
        product,
      }),
    });
    if (!res.ok) {
      setError("Can't add the item");
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/getGame/${productId}`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          setError("Can't fetch product data");
          setLoading(false);
          return;
        }
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  return (
    <main className="p-6 m-7">
      {loading && <p className="text-center mt-10 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center mt-10 text-2xl text-red-700">{error}</p>
      )}
      {!loading && !error && product && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="basis-1/4 space-y-4 items-centers">
            <div className="flex gap-4">
              {" "}
              <h1 className="text-2xl font-bold">{product.productName}</h1>
              <span>geeeeeee</span>
              <p className="text-gray-400">{product.gameType}</p>
              <span>geeeeeee</span>{" "}
            </div>

            <Image
              src={product.uploadedCoverImage}
              alt="Product image"
              width={600}
              height={300}
              className="rounded-lg shadow-lg"
            />
            <div className="flex items-center space-x-4">
              <span className="text-yellow-500 font-semibold">
                ⭐ {product.rating}
              </span>
              <p className="bg-red-500 text-white px-2 py-1 rounded">
                {product.ageRestriction}+
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleItemAdd}
              className="bg-green-500 text-white flex items-center gap-2"
            >
              <ShoppingCart size={20} /> Add to cart
            </Button>
          </div>
          <div className="flex-grow">
            <p className="text-gray-500">Product video will go here.</p>
          </div>
        </div>
      )}
    </main>
  );
}
