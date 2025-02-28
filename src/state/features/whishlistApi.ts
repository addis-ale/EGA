import { Product } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the structure of the product in the wishlist

export const wishlistApi = createApi({
  reducerPath: "wishlistApi", // Fixed typo here ("whishlistApi" => "wishlistApi")
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // Add a product to the wishlist
    addToWishlist: builder.mutation<{ message: string }, { productId: string }>(
      {
        query: ({ productId }) => ({
          url: "/wishlist", // Corrected typo here ("whishlist" => "wishlist")
          method: "POST",
          body: { productId }, // Send the productId as the body
        }),
      }
    ),

    // Get the user's wishlist (returns an array of products)
    getWishlist: builder.query<{ wishlist: Product[] }, void>({
      query: () => ({
        url: "/wishlist", // Fetch wishlist data
        method: "GET",
      }),
    }),

    // Optionally, add a remove from wishlist endpoint
    removeFromWishlist: builder.mutation<
      { message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "/wishlist", // Assuming this endpoint handles removing products
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
