/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PriceDetails, Product, Review } from "@prisma/client";

// Define a type for cart products with quantity and rental dates
interface CartProduct extends Product {
  priceDetails: PriceDetails;
  reviews: Review[];
  quantity?: number;
  rentalStart?: string;
  rentalEnd?: string;
  type: "SALE" | "RENT";
}

interface cartResponse {
  cartItems: CartProduct[];
  totalPrice: number;
  totalQuantity: number;
}

// Helper function to calculate rental price
const calculateRentalPrice = (item: CartProduct): number => {
  if (!item.rentalStart || !item.rentalEnd) return 0;

  const start = new Date(item.rentalStart);
  const end = new Date(item.rentalEnd);
  const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)); // Convert ms to hours

  return hours * (item.priceDetails?.rentalPricePerHour || 0);
};

// Define API for cart operations
export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCartItems: builder.query<cartResponse, void>({
      query: () => `/cart`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      { success: boolean; cartItem: CartProduct },
      {
        productId: string;
        type: "SALE" | "RENT";
        quantity?: number;
        rentalStart?: string;
        rentalEnd?: string;
      }
    >({
      query: ({ productId, type, quantity = 1, rentalStart, rentalEnd }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, type, quantity, rentalStart, rentalEnd },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { productId, type, quantity = 1, rentalStart, rentalEnd },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
            if (!Array.isArray(draft.cartItems)) {
              draft.cartItems = [];
            }

            const existingItem = draft.cartItems.find(
              (item) =>
                item.id === productId &&
                (type === "SALE" ||
                  (type === "RENT" &&
                    item.rentalStart === rentalStart &&
                    item.rentalEnd === rentalEnd))
            );

            if (existingItem) {
              existingItem.quantity = (existingItem.quantity || 0) + quantity;
            } else {
              draft.cartItems.push({
                id: productId,
                type,
                quantity,
                rentalStart,
                rentalEnd,
              } as CartProduct);
            }

            // 🔥 Optimistically update total price & total quantity
            draft.totalQuantity += quantity;
            if (existingItem) {
              if (type === "SALE") {
                draft.totalPrice +=
                  (existingItem.priceDetails?.salePrice || 0) * quantity;
              } else {
                draft.totalPrice +=
                  calculateRentalPrice(existingItem) * quantity;
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Rollback on failure
        }
      },
    }),

    updateCartItem: builder.mutation<
      { success: boolean; cartItem: CartProduct },
      {
        productId: string;
        quantity?: number;
        rentalStart?: string;
        rentalEnd?: string;
      }
    >({
      query: ({ productId, quantity, rentalStart, rentalEnd }) => ({
        url: "/cart",
        method: "PATCH",
        body: { productId, quantity, rentalStart, rentalEnd },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(
        { productId, quantity, rentalStart, rentalEnd },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
            if (!Array.isArray(draft.cartItems)) {
              return;
            }

            const item = draft.cartItems.find((item) => item.id === productId);

            if (item) {
              if (quantity !== undefined) {
                const diff = quantity - (item.quantity || 0);
                draft.totalQuantity += diff;
                if (item.type === "SALE") {
                  draft.totalPrice +=
                    (item.priceDetails?.salePrice || 0) * diff;
                } else {
                  draft.totalPrice += calculateRentalPrice(item) * diff;
                }
                item.quantity = quantity;
              }
              if (rentalStart !== undefined) {
                item.rentalStart = rentalStart;
              }
              if (rentalEnd !== undefined) {
                item.rentalEnd = rentalEnd;
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Rollback on failure
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
            if (!Array.isArray(draft.cartItems)) {
              return;
            }

            const itemToRemove = draft.cartItems.find(
              (item) => item.id === productId
            );

            if (itemToRemove) {
              draft.totalQuantity -= itemToRemove.quantity || 0;
              if (itemToRemove.type === "SALE") {
                draft.totalPrice -=
                  (itemToRemove.priceDetails?.salePrice || 0) *
                  (itemToRemove.quantity || 1);
              } else {
                draft.totalPrice -=
                  calculateRentalPrice(itemToRemove) *
                  (itemToRemove.quantity || 1);
              }
            }

            draft.cartItems = draft.cartItems.filter(
              (item) => item.id !== productId
            );
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Rollback on failure
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
