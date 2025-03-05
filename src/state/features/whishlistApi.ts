import { Product } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    addToWishlist: builder.mutation<{ message: string }, { productId: string }>(
      {
        query: ({ productId }) => ({
          url: "/wishlist",
          method: "POST",
          body: { productId },
        }),
      }
    ),

    getWishlist: builder.query<{ wishlist: Product[] }, void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
    }),

    removeFromWishlist: builder.mutation<
      { message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "/wishlist",
        method: "DELETE",
        body: { productId },
      }),
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} = wishlistApi;
