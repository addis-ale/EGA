import { useRemoveFromWishlistMutation } from "@/state/features/whishlistApi";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Product } from "@prisma/client";

export const useRemoveFromWishlist = (
  wishlist: Product[],
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  const { toast } = useToast();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleRemoveFromWishlist = useCallback(
    async (productId: string) => {
      // Optimistically update the wishlist (remove the product from local state)
      const updatedWishlist = wishlist.filter((item) => item.id !== productId);
      setWishlist(updatedWishlist);

      try {
        // Call the mutation to remove the product from the wishlist
        await removeFromWishlist({ productId }).unwrap();

        toast({
          title: "Success",
          description: "Product removed from wishlist",
        });
      } catch (error) {
        if ("status" in (error as FetchBaseQueryError)) {
          const err = error as FetchBaseQueryError;
          switch (err.status) {
            case 401:
              toast({
                title: "Sign in first",
                description:
                  "You need to be logged in to remove items from your wishlist.",
              });
              break;
            case 400:
              toast({
                title: "Error",
                description:
                  "This product could not be removed from your wishlist.",
              });
              break;
            default:
              toast({
                title: "Error",
                description:
                  "An error occurred while removing from wishlist. Please try again.",
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
    [removeFromWishlist, toast, wishlist, setWishlist]
  );

  return { handleRemoveFromWishlist };
};
