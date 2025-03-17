"use client";
import Container from "@/components/container";
import { useGetCartItemsQuery } from "@/state/features/cartApi";
import CartDetailSkeleton from "@/components/clientComponents/cartDetailSkeleton";
import EmptyCart from "./empytCart";
import CartItems from "./cartDetail";

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
  console.log(myCart);

  return (
    <div className="flex justify-center items-center min-h-screen w-full py-8">
      <Container>
        {isLoading ? (
          <CartDetailSkeleton />
        ) : (cartItems ?? []).length > 0 ? (
          <div>
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
