"use client";

import { useEffect, useMemo, useState } from "react";
// import FilterInterface from "@/components/filter-interface";
// import ProductGrid from "@/components/product-grid";
// import Header from "@/components/header";
// import type { Product } from "@/lib/products";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import FilterInterface from "@/components/clientComponents/filter";
import Container from "@/components/container";
import ProductListingCard from "@/components/productCards/trendingCard";
import { useGetFilterProductQuery } from "@/state/features/filterApi";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import FilterInterface from "@/components/filter";
// import { Pagination } from "@/components/pagination";

// interface ApiResponse {
//   products: Product[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }
// interface productProps {
//   product: Product[];
//   totalCount: number;
//   totalPage: number;
//   limit: number;
//   page: number;
// }
interface paginationProps {
  total: number;
  limit: number;
  totalPages: number;
  page: number;
}

export default function FilterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<paginationProps>({
    total: 0,
    limit: 10,
    totalPages: 1,
    page: 1,
  });

  const searchParams = useSearchParams();
  // const router = useRouter();

  // const params = new URLSearchParams(searchParams?.toString());

  const queryParams = useMemo(() => {
    return { page: pagination.page, limit: pagination.limit };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pagination.limit, pagination.page]);

  const { data, error, isLoading } = useGetFilterProductQuery(queryParams);
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());

    params.set("page", pagination?.page?.toString());
    params.set("limit", pagination?.limit?.toString());
    if (data) {
      setProducts(data?.product);
      // setPagination(data.limit);
      setPagination((prev) => ({
        ...prev,
        limit: data.limit,
        page: data.page,
        total: data.totalCount,
        totalPages: data.totalPage,
      }));
    }
  }, [searchParams, pagination.limit, pagination.page, data]);
  useEffect(() => {});
  if (isLoading) return <p>Loading...</p>;
  if (error) {
    setError("error happend");
  }

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const params = new URLSearchParams(searchParams?.toString());

  //       params.set("page", pagination?.page?.toString());
  //       params.set("limit", pagination?.limit.toString());

  //       const response = await fetch(`/api/search?${params.toString()}`);

  //       if (!response.ok) {
  //         throw new Error(`API error: ${response.status}`);
  //       }

  //       const data: productProps = await response.json();
  //       console.log(data);

  //       setProducts(data.product);
  //       // setPagination(data.limit);
  //       setPagination((prev) => ({
  //         ...prev,
  //         limit: data.limit,
  //         page: data.page,
  //         total: data.totalCount,
  //         totalPages: data.totalPage,
  //       }));
  //     } catch (error) {
  //       console.error("Failed to fetch products:", error);
  //       setError("Failed to load products. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Number(prev.page) + newPage,
    }));
  };

  return (
    <Container>
      <div className="min-h-screen mt-20  text-white">
        <main className="py-8">
          <FilterInterface />

          <div className="container mx-auto px-4 mt-8">
            {error ? (
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
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(-1)}
                      size="icon"
                      className={`${(pagination.page = 0)} && disabled`}
                    >
                      <ChevronLeft />
                    </Button>
                    {pagination.page}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(1)}
                      size="icon"
                      className={`${
                        pagination.totalPages === pagination.page
                      }&& disabled`}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
                {products}
                {products &&
                  products.map((product) => (
                    <ProductListingCard key={product?.id} product={product} />
                  ))}
                {/* <ProductGrid products={products} isLoading={isLoading} /> */}

                {/* {!isLoading && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )} */}
              </>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
}
