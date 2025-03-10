"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useUpdateCartItemMutation } from "@/state/features/cartApi";

interface CartItem {
  id: string;
  product: {
    id: string;
    productName: string;
    uploadedCoverImage: string;
    gameType: string;
    discountPercentage: number;
  };
  priceDetails: {
    rentalPricePerHour: number;
    salePrice: number | null;
  };
  quantity?: number;
  type: string;
}

interface CartItemsProps {
  cartItems: CartItem[];
  totalPrice: number;
}

const CartItems = ({ cartItems, totalPrice }: CartItemsProps) => {
  const [updateCartItem] = useUpdateCartItemMutation();
  const [quantity, setQuantity] = useState<{ [key: string]: number }>(
    cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number })
  );

  const handleQuantityChange = async (id: string, increment: number) => {
    setQuantity((prev) => {
      const newQuantity = (prev[id] || 1) + increment;
      if (newQuantity <= 0) return prev; // Prevent negative quantity
      return { ...prev, [id]: newQuantity };
    });

    // Make the API call to update the cart item quantity
    try {
      await updateCartItem({
        productId: id,
        quantity: (quantity[id] || 1) + increment,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <div className="w-full space-y-6 bg-black text-white p-6 rounded-lg mt-[60px]">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 relative bg-zinc-900 border-zinc-800 text-white"
            >
              {/* Discount Badge */}
              {item.product.discountPercentage > 0 && (
                <div className="absolute top-2 left-2 flex items-center text-sm font-medium bg-green-600 text-white px-2 py-1 rounded-md z-10">
                  <Tag className="h-4 w-4 mr-1" />
                  {item.product.discountPercentage}% OFF
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative h-32 w-full sm:w-32 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.product.uploadedCoverImage || "/placeholder.svg"}
                    alt={item.product.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {item.product.productName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                      Type:{" "}
                      <span className="font-medium text-white">
                        {item.product.gameType}
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {quantity[item.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <p className="font-medium">
                        {item.priceDetails.salePrice
                          ? `$${item.priceDetails.salePrice.toFixed(2)} each`
                          : `$${item.priceDetails.rentalPricePerHour * 24}/day`}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-zinc-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4 bg-zinc-900 border-zinc-800 text-white">
            <h3 className="text-lg font-medium">Order Summary</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-300">Calculated at checkout</span>
              </div>
              <Separator className="bg-zinc-700" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Proceed to Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
