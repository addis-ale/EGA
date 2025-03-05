"use client";

import Container from "@/components/container";
import {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/state/features/cartApi";
import { useEffect, useState } from "react";
import CartDetail from "./cartDetail";
import CartDetailSkeleton from "@/components/clientComponents/cartDetailSkeleton";
import EmptyCart from "./empytCart";

const CartPage = () => {
  const { data, isLoading } = useGetCartItemsQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveFromCartMutation();

  const [cartItems, setCartItems] = useState(data?.cart || []);
  const [totalPrice, setTotalPrice] = useState(data?.totalPrice || 0);

  useEffect(() => {
    if (data) {
      setCartItems(data.cart);
      setTotalPrice(data.totalPrice);
    }
  }, [data]);

  // ✅ Handle quantity updates
  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }
    // Backup state in case of failure
    const prevCart = [...cartItems];
    const prevTotal = totalPrice;

    // Update cart items in state
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    // Recalculate total price
    const updatedTotal = updatedCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCartItems(updatedCart);
    setTotalPrice(updatedTotal);

    // API update
    try {
      await updateCartItem({ productId, quantity: newQuantity });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setCartItems(prevCart); // Rollback
      setTotalPrice(prevTotal);
    }
  };

  // ✅ Handle item removal
  const handleRemoveItem = async (productId: string) => {
    // Backup state in case of failure
    const prevCart = [...cartItems];
    const prevTotal = totalPrice;

    // Remove item from state
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    const updatedTotal = updatedCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCartItems(updatedCart);
    setTotalPrice(updatedTotal);

    // API call
    try {
      await removeCartItem({ productId });
    } catch (error) {
      console.error("Failed to remove item:", error);
      setCartItems(prevCart); // Rollback
      setTotalPrice(prevTotal);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Container>
        {isLoading ? (
          <CartDetailSkeleton />
        ) : cartItems.length > 0 ? (
          <CartDetail
            cart={cartItems}
            totalPrice={totalPrice}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem} // Pass down remove function
          />
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;
