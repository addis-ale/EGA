import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
} from "@/state/features/whishlistApi";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Product } from "@prisma/client";

export const useWishlist = () => {
  const { toast } = useToast();
  const [addToWishlist] = useAddToWishlistMutation();
  const { refetch } = useGetWishlistQuery();
  const handleAddToWishlist = useCallback(
    async (product: Product) => {
      try {
        await addToWishlist({ productId: product.id }).unwrap();
        refetch();
        toast({
          title: "Success",
          description: "Product added to wishlist",
        });
      } catch (error) {
        if ("status" in (error as FetchBaseQueryError)) {
          const err = error as FetchBaseQueryError;
          switch (err.status) {
            case 401:
              toast({
                title: "Sign in first",
                description:
                  "You need to be logged in to add items to your wishlist.",
              });
              break;
            case 400:
              toast({
                title: "Already in Wishlist",
                description: "This product is already in your wishlist.",
              });
              break;
            default:
              toast({
                title: "Error",
                description:
                  "An error occurred while adding to wishlist. Please try again.",
              });
          }
        } else {
          toast({
            title: "Network Error",
            description: "Please check your internet connection and try again.",
          });
        }
      }
    },
    [addToWishlist, toast, refetch]
  );

  return { handleAddToWishlist };
};
