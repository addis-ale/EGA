"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Container from "@/components/container";
import ProductListingCard from "@/components/productCards/trendingCard";
import { PriceDetails, Product, Review } from "@prisma/client";
import FilterInterface from "@/components/filter";

interface FilterProductResponse {
  message: string;
  product: (Product & {
    priceDetails: PriceDetails;
    reviews: Review[];
  })[];
  limit: string;
  page: string;
  totalPage: number;
  totalCount: number;
  status: number;
}
interface paginationProps {
  total: number;
  limit: number;
  totalPages: number;
  page: number;
}
interface ProductProps {
  product: Product & {
    priceDetails: PriceDetails;
    reviews: Review[];
  };
}
export default function FilterPage() {
  const [products, setProducts] = useState<ProductProps["product"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<paginationProps>({
    total: 0,
    limit: 10,
    totalPages: 1,
    page: 1,
  });

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("searchQuery") || "";

  useEffect(() => {
    if (!searchQuery) {
      setProducts([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        totalPages: 0,
      })); // ✅ Reset when searchQuery is cleared
    }
  }, [searchQuery]);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) {
  //   setError("error happend");
  // }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(searchParams?.toString());

        params.set("page", pagination?.page?.toString());
        params.set("limit", pagination?.limit.toString());

        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          // throw new Error(`API error: ${response.status}`);
        }

        const data: FilterProductResponse = await response.json();
        console.log(data);

        setProducts(data?.product);
        // setPagination(data.limit);
        setPagination((prev) => ({
          ...prev,
          limit: Number(data.limit),
          page: Number(data.page),
          total: data.totalCount,
          totalPages: data.totalPage,
        }));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <Container>
      <div className="min-h-screen mt-20  text-white">
        <main className="py-8">
          <FilterInterface />

          <div className="container mx-auto px-4 mt-8">
            {Error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{Error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {pagination.total} Products
                    {searchParams?.toString() ? " (Filtered)" : ""}
                  </h2>
                </div>
                {isLoading && <div className="items-center">Loading...</div>}
                {products && (
                  <div className="flex gap-10 flex-wrap">
                    {products.map((product) => (
                      <div key={product?.id} className="flex gap-10">
                        <ProductListingCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
}
