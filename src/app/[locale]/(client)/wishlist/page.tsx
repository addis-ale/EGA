"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGetWishlistQuery } from "@/state/features/whishlistApi";
import { Heart, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TrendingCard from "@/components/productCards/trendingCard";
import Container from "@/components/container";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const WishlistPage = () => {
  const { data, isLoading, error } = useGetWishlistQuery();
  const wishlists = data?.wishlist || [];
  const user = useSelector(
    (state: RootState) => state.currentUser?.user as User | null
  );
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view your wishlist.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [user, toast, router]);

  if (!user) {
    return (
      <div className="flex w-full justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Unable to load wishlist
          </h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  if (wishlists.length === 0) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-center max-w-md mx-auto px-4">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add items to your wishlist to save them for later
          </p>
          <Button asChild>
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="container mx-auto py-8 px-4 mt-[80px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl text-teal">
            My Wishlist
          </h1>
          <p className="text-muted-foreground text-white">
            {wishlists.length} items
          </p>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlists.map((product) => (
            <TrendingCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default WishlistPage;
