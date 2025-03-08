import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PriceDetails, Product, Review } from "@prisma/client";

// Define a type for cart products with quantity
interface CartProduct extends Product {
  priceDetails: PriceDetails;
  reviews: Review[];
  quantity?: number;
  rentalStart?: string;
  rentalEnd?: string;
  type: "SALE" | "RENT";
}

// Define API for cart operations
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCartItems: builder.query<
      { cart: CartProduct[]; totalPrice: number; totalQuantity: number },
      void
    >({
      query: () => `/cart`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      { success: boolean; cartItem: CartProduct },
      {
        productId: string;
        type: "SALE" | "RENT";
        quantity?: number;
        rentalStart?: Date;
        rentalEnd?: Date;
      }
    >({
      query: ({ productId, type, quantity, rentalStart, rentalEnd }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, type, quantity, rentalStart, rentalEnd },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { productId, type, quantity, rentalStart, rentalEnd },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
            // Ensure draft.cart is an array before modifying it
            if (!Array.isArray(draft.cart)) {
              console.warn("draft.cart is not an array, initializing as []");
              draft.cart = [];
            }

            console.log("Draft cart before update:", draft.cart);
            console.log("Adding product ID:", productId);

            const existingItem = draft.cart.find(
              (item) => item?.id === productId
            );

            if (existingItem) {
              console.log("Product already in cart, updating quantity");
              existingItem.quantity =
                (existingItem.quantity || 0) + (quantity || 1);
            } else {
              console.log("Product not in cart, adding new item");
              draft.cart.push({
                id: productId,
                type,
                quantity: quantity || 1,
                rentalStart,
                rentalEnd,
              } as CartProduct);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error in addToCart mutation:", error);
          patchResult.undo();
        }
      },
    }),

    updateCartItem: builder.mutation<
      { success: boolean; cartItem: CartProduct },
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "PATCH",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
            if (!Array.isArray(draft.cart)) {
              console.warn("draft.cart is not an array, cannot update");
              return;
            }

            console.log(
              "Updating cart item:",
              productId,
              "New Quantity:",
              quantity
            );

            const item = draft.cart.find((item) => item?.id === productId);
            if (item) {
              console.log("Found item, updating quantity");
              item.quantity = quantity;
            } else {
              console.warn("Item not found in cart for update");
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error in updateCartItem mutation:", error);
          patchResult.undo();
        }
      },
    }),

    removeFromCart: builder.mutation<
      { success: boolean },
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "/cart",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
            if (!Array.isArray(draft.cart)) {
              console.warn("draft.cart is not an array, cannot remove item");
              return;
            }

            console.log("Removing item from cart:", productId);

            const originalLength = draft.cart.length;
            draft.cart = draft.cart.filter((item) => item?.id !== productId);

            if (draft.cart.length < originalLength) {
              console.log("Item successfully removed from cart");
            } else {
              console.warn("Item not found in cart for removal");
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error in removeFromCart mutation:", error);
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
