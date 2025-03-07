import { useCallback } from "react";
import { useToast } from "./use-toast";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Product } from "@prisma/client";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/state/features/whishlistApi";

export const useWishlist = () => {
  const { toast } = useToast();
  const [toggleWishlist] = useToggleWishlistMutation();
  const { refetch, data } = useGetWishlistQuery();

  const handleToggleWishlist = useCallback(
    async (product: Product) => {
      const isInWishlist = data?.wishlist?.some(
        (item) => item.id === product.id
      );

      try {
        await toggleWishlist({ productId: product.id }).unwrap();
        refetch(); // Refresh wishlist

        toast({
          title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
          description: isInWishlist
            ? "Product has been removed from your wishlist."
            : "Product added to your wishlist successfully!",
        });
      } catch (error) {
        if ("status" in (error as FetchBaseQueryError)) {
          const err = error as FetchBaseQueryError;
          switch (err.status) {
            case 401:
              toast({
                title: "Sign in required",
                description: "Please log in to manage your wishlist.",
              });
              break;
            case 400:
              toast({
                title: "Wishlist Error",
                description: "Something went wrong. Try again!",
              });
              break;
            default:
              toast({
                title: "Server Error",
                description: "Unable to update wishlist. Please try later.",
              });
          }
        } else {
          toast({
            title: "Network Error",
            description: "Check your internet connection and try again.",
          });
        }
      }
    },
    [toggleWishlist, toast, refetch, data]
  );

  return { handleToggleWishlist };
};
