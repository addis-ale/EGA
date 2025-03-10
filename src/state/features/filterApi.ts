import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "@prisma/client";

export const FilterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Ensure this matches your actual API base URL
  }),
  tagTypes: ["filter"],
  endpoints: (builder) => ({
    getFilterProduct: builder.query<
      {
        product: Product[];
        limit: number;
        totalCount: number;
        totalPage: number;
        page: number;
      },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        return `/search?${params.toString()}`;
      },
      providesTags: ["filter"],
    }),
  }),
});

export const { useGetFilterProductQuery } = FilterApi;
