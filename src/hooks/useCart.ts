import { useCallback } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Product } from "@prisma/client";
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useGetCartItemsQuery,
} from "@/state/features/cartApi";
import { useToast } from "./use-toast";

export const useCart = () => {
  const { toast } = useToast();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const { refetch } = useGetCartItemsQuery();

  // Handle Cart Error
  const handleCartError = useCallback(
    (error: unknown, action: "add" | "remove" | "update") => {
      if ("status" in (error as FetchBaseQueryError)) {
        const err = error as FetchBaseQueryError;
        switch (err.status) {
          case 401:
            toast({
              title: "Sign in required",
              description: "Please log in to manage your cart.",
              style: { backgroundColor: "teal", color: "white" },
            });
            break;
          case 400:
            toast({
              title: "Cart Error",
              description: "Something went wrong. Try again!",
              style: { backgroundColor: "teal", color: "white" },
            });
            break;
          default:
            toast({
              title: "Server Error",
              description: `Unable to ${action} item. Please try later.`,
              style: { backgroundColor: "teal", color: "white" },
            });
        }
      } else {
        toast({
          title: "Network Error",
          description: "Check your internet connection and try again.",
          style: { backgroundColor: "teal", color: "white" },
        });
      }
    },
    [toast]
  );

  // Add to Cart
  const handleAddToCart = useCallback(
    async (
      product: Product,
      type: "SALE" | "RENT",
      quantity = 1,
      rentalStart?: Date,
      rentalEnd?: Date
    ) => {
      try {
        await addToCart({
          productId: product.id,
          type,
          quantity,
          rentalStart: rentalStart?.toISOString(),
          rentalEnd: rentalEnd?.toISOString(),
        }).unwrap();

        toast({
          title: "Added to Cart",
          description: `You added ${quantity} ${product.productName} to your cart.`,
          style: { backgroundColor: "green", color: "white" },
        });
      } catch (error) {
        handleCartError(error, "add");
      }
    },
    [addToCart, toast, handleCartError]
  );

  // Remove from Cart
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      try {
        await removeFromCart({ productId }).unwrap();
        refetch();

        toast({
          title: "Removed from Cart",
          description: "Product has been removed from your cart.",
          style: { backgroundColor: "red", color: "white" },
        });
      } catch (error) {
        handleCartError(error, "remove");
      }
    },
    [removeFromCart, toast, refetch, handleCartError]
  );

  // **Update Cart Item (Quantity, Rental Start & End Dates)**
  const handleUpdateCartItem = useCallback(
    async (
      productId: string,
      quantity?: number,
      rentalStart?: Date,
      rentalEnd?: Date
    ) => {
      try {
        await updateCartItem({
          productId,
          quantity,
          rentalStart: rentalStart?.toISOString(),
          rentalEnd: rentalEnd?.toISOString(),
        }).unwrap();
        refetch();

        toast({
          title: "Cart Updated",
          description: "Your cart item has been updated successfully.",
          style: { backgroundColor: "blue", color: "white" },
        });
      } catch (error) {
        handleCartError(error, "update");
      }
    },
    [updateCartItem, toast, refetch, handleCartError]
  );

  return { handleAddToCart, handleRemoveFromCart, handleUpdateCartItem };
};
