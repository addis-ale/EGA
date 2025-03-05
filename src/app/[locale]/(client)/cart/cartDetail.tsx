"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@prisma/client";
import { formatPrice, truncateText } from "@/utils/helper";
interface CartItem extends Product {
  quantity: number;
}
interface CartDetailProps {
  cart: CartItem[];
  totalPrice: number;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}
export default function CartDetail({
  cart: cartItems,
  totalPrice,
  onQuantityChange,
  onRemoveItem,
}: CartDetailProps) {
  const [discountCode, setDiscountCode] = useState("");

  return (
    <div className="w-full items-center mt-[60px]">
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">My Cart</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full sm:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className=" rounded-lg p-4 flex flex-col sm:flex-row gap-4 border-2 border-gray-300"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={item.uploadedCoverImage || "/placeholder.svg"}
                    alt={item.productName}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg text-white">
                        {truncateText(item.productName, 10)}
                      </h3>
                      <p className="text-sm text-gray-400">{item.gameType}</p>
                      <p className="text-xl text-gray-400 font-bold">
                        Age {item.ageRestriction}+
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onQuantityChange(item.id, item.quantity - 1)
                        }
                        className="bg-green-800 text-white w-6 h-6 rounded-md flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onQuantityChange(item.id, item.quantity + 1)
                        }
                        className="bg-green-800 text-white w-6 h-6 rounded-md flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove Button */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full sm:w-1/3 bg-[#3A4437] rounded-lg p-4 h-fit">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 text-white">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 items-center bg-[#636961] p-2 rounded-md"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.uploadedCoverImage || "/placeholder.svg"}
                      alt={item.productName}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-white">
                      {truncateText(item.productName)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                {/* Discount Input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="bg-zinc-800 border-gray-700 text-white"
                  />
                  <Button variant="secondary" className="whitespace-nowrap">
                    Apply
                  </Button>
                </div>

                {/* Price Details */}
                <div className="border-t border-gray-300 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">
                      {formatPrice(totalPrice)}{" "}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 ">
                    <span className="text-white">Total</span>
                    <span className="text-white">
                      {formatPrice(totalPrice)}{" "}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tax included if applicable
                  </p>

                  <Button className="w-full bg-green-600 hover:bg-green-700 mt-4 py-6 text-white">
                    Checkout → {formatPrice(totalPrice)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
