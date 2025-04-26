"use client";
import Container from "@/components/container";
import { useGetCartItemsQuery } from "@/state/features/cartApi";
import CartDetailSkeleton from "@/components/skeleton/cartDetailSkeleton";
import EmptyCart from "./empytCart";
import CartItems from "./cartDetail";
import { User } from "@prisma/client";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const CartPage = () => {
  const { data, isLoading } = useGetCartItemsQuery();
  const cartItems = data?.cart || [];
  console.log("cartItem logging....", cartItems);
  const totalPrice = data?.totalPrice ?? 0;
  // const totalQuantity = data?.totalQuantity ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCartItems = (cartItems: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cartItems?.map((product: any) => ({
      ...product,
      priceDetails: product.priceDetails || {},
    }));
  const myCart = formatCartItems(cartItems);
  console.log("My cart >>>>", myCart);

  const user = useSelector(
    (state: RootState) => state.currentUser?.user as User | null
  );
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view your cart.",
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

  return (
    <div className="flex justify-center items-center min-h-screen w-full py-8">
      <Container>
        {isLoading ? (
          <CartDetailSkeleton />
        ) : (cartItems ?? []).length > 0 ? (
          <div className="w-full">
            <CartItems cartItems={myCart} totalPrice={totalPrice} />
          </div>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;
