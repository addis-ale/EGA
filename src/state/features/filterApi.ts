import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, PriceDetails, Review } from "@prisma/client";

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

export const FilterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getFilterProduct: builder.query<
      FilterProductResponse,
      { page: number; limit: number; searchQuery: string }
    >({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        return `/search?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetFilterProductQuery } = FilterApi;
