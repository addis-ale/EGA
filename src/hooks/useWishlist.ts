import { useCallback } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Product } from "@prisma/client";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/state/features/whishlistApi";
import { useToast } from "./use-toast";

export const useWishlist = () => {
  const { toast } = useToast(); // Ensure this is correctly set up
  const [toggleWishlist] = useToggleWishlistMutation();
  const { refetch, data } = useGetWishlistQuery();

  const handleToggleWishlist = useCallback(
    async (product: Product) => {
      if (!data) {
        console.warn("Wishlist data is not loaded yet.");
        return;
      }

      const isInWishlist = data?.wishlist?.some(
        (item) => item.id === product.id
      );

      try {
        await toggleWishlist({ productId: product.id }).unwrap();
        refetch(); // Refresh wishlist

        console.log("Displaying toast...");
        toast({
          title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
          description: isInWishlist
            ? "Product has been removed from your wishlist."
            : "Product added to your wishlist successfully!",
          style: {
            backgroundColor: "green", // teal background
            color: "white", // white text color
            padding: "10px 20px", // optional padding for better readability
            borderRadius: "8px", // optional rounded corners
          },
        });
      } catch (error) {
        console.error("Error occurred:", error);

        if ("status" in (error as FetchBaseQueryError)) {
          const err = error as FetchBaseQueryError;
          console.log("Error status:", err.status);

          switch (err.status) {
            case 401:
              toast({
                title: "Sign in required",
                description: "Please log in to manage your wishlist.",
                style: {
                  backgroundColor: "teal",
                  color: "white",
                },
              });
              break;
            case 400:
              toast({
                title: "Wishlist Error",
                description: "Something went wrong. Try again!",
                style: {
                  backgroundColor: "teal",
                  color: "white",
                },
              });
              break;
            default:
              toast({
                title: "Server Error",
                description: "Unable to update wishlist. Please try later.",
                style: {
                  backgroundColor: "teal",
                  color: "white",
                },
              });
          }
        } else {
          toast({
            title: "Network Error",
            description: "Check your internet connection and try again.",
            style: {
              backgroundColor: "teal",
              color: "white",
            },
          });
        }
      }
    },
    [toggleWishlist, toast, refetch, data]
  );

  return { handleToggleWishlist };
};
