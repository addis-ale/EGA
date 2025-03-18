import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PriceDetails, Product, Review } from "@prisma/client";
interface WishlistProduct extends Product {
  priceDetails: PriceDetails;
  reviews: Review[];
}
export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    getWishlist: builder.query<{ wishlist: WishlistProduct[] }, void>({
      query: () => ({ url: "/wishlist", method: "GET" }),
      providesTags: ["Wishlist"],
    }),

    toggleWishlist: builder.mutation<
      { message: string },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              if (!draft) return; // Ensure draft exists before modifying

              // If wishlist is undefined, initialize it as an empty array
              draft.wishlist = draft.wishlist || [];

              const index = draft.wishlist.findIndex((p) => p.id === productId);
              if (index !== -1) {
                draft.wishlist.splice(index, 1); // Remove existing product
              } else {
                draft.wishlist.push({ id: productId } as WishlistProduct); // Add new product
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const { useGetWishlistQuery, useToggleWishlistMutation } = wishlistApi;
