"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, Tag, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useUpdateCartItemMutation } from "@/state/features/cartApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDates?: {
    startDate: Date | null;
    endDate: Date | null;
  };
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

  const [rentalDates, setRentalDates] = useState<{
    [key: string]: { startDate: Date | null; endDate: Date | null };
  }>(
    cartItems.reduce((acc, item) => {
      if (item.type === "rental") {
        acc[item.id] = item.rentalDates || { startDate: null, endDate: null };
      }
      return acc;
    }, {} as { [key: string]: { startDate: Date | null; endDate: Date | null } })
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

  const handleDateChange = async (
    id: string,
    type: "startDate" | "endDate",
    date: Date | null
  ) => {
    setRentalDates((prev) => {
      const currentDates = prev[id] || { startDate: null, endDate: null };
      return {
        ...prev,
        [id]: {
          ...currentDates,
          [type]: date,
        },
      };
    });

    // You could add an API call here to update the rental dates on the server
    try {
      await updateCartItem({
        productId: id,
        rentalDates: {
          ...rentalDates[id],
          [type]: date,
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update rental dates:", error);
    }
  };

  const calculateRentalDuration = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Function to calculate rental price based on hours between dates
  const calculateRentalPrice = (item: CartItem) => {
    if (!item.rentalStartDate || !item.rentalEndDate) return 0;

    const startDate = new Date(item.rentalStartDate);
    const endDate = new Date(item.rentalEndDate);

    // Calculate difference in hours
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    // Calculate price based on hourly rate and quantity
    const itemQuantity = quantity[item.id] || 1;
    const totalPrice =
      diffHours * item.priceDetails.rentalPricePerHour * itemQuantity;

    return totalPrice;
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
                    {/* Display rental dates if item type is rental */}
                    {item.type === "rental" && (
                      <div className="mt-2 text-sm text-gray-300">
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Rental Period:</span>
                        </div>
                        <div className="ml-5 mt-1 space-y-1">
                          <p>
                            <span className="text-gray-400">Start:</span>{" "}
                            <span className="font-medium text-white">
                              {item.rentalStartDate
                                ? new Date(
                                    item.rentalStartDate
                                  ).toLocaleDateString()
                                : "Not set"}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-400">End:</span>{" "}
                            <span className="font-medium text-white">
                              {item.rentalEndDate
                                ? new Date(
                                    item.rentalEndDate
                                  ).toLocaleDateString()
                                : "Not set"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Calculated Rental Price Component */}
                    {item.type === "rental" &&
                      item.rentalStartDate &&
                      item.rentalEndDate && (
                        <div className="mt-2 text-sm">
                          <div className="flex items-center gap-1 mt-1">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">
                              Calculated Price:
                            </span>
                          </div>
                          <div className="ml-5 mt-1">
                            <div className="flex flex-col">
                              <p className="text-gray-300">
                                <span className="text-gray-400">Rate:</span>{" "}
                                <span className="font-medium text-white">
                                  $
                                  {item.priceDetails.rentalPricePerHour.toFixed(
                                    2
                                  )}
                                  /hour
                                </span>
                              </p>
                              <p className="text-gray-300">
                                <span className="text-gray-400">Duration:</span>{" "}
                                <span className="font-medium text-white">
                                  {Math.ceil(
                                    Math.abs(
                                      new Date(item.rentalEndDate).getTime() -
                                        new Date(item.rentalStartDate).getTime()
                                    ) /
                                      (1000 * 60 * 60)
                                  )}{" "}
                                  hours
                                </span>
                              </p>
                              <p className="text-gray-300">
                                <span className="text-gray-400">Quantity:</span>{" "}
                                <span className="font-medium text-white">
                                  {quantity[item.id] || 1}
                                </span>
                              </p>
                              <p className="text-green-400 font-medium mt-1">
                                Total: ${calculateRentalPrice(item).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Rental Dates Section */}
                    {item.type === "rental" && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-300">
                          Rental Period:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white",
                                  !rentalDates[item.id]?.startDate &&
                                    "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {rentalDates[item.id]?.startDate ? (
                                  format(rentalDates[item.id].startDate, "PPP")
                                ) : (
                                  <span>Start date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-zinc-800 border-zinc-700"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={
                                  rentalDates[item.id]?.startDate || undefined
                                }
                                onSelect={(date) =>
                                  handleDateChange(item.id, "startDate", date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[140px] justify-start text-left font-normal border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white",
                                  !rentalDates[item.id]?.endDate &&
                                    "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {rentalDates[item.id]?.endDate ? (
                                  format(rentalDates[item.id].endDate, "PPP")
                                ) : (
                                  <span>End date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 bg-zinc-800 border-zinc-700"
                              align="start"
                            >
                              <CalendarComponent
                                mode="single"
                                selected={
                                  rentalDates[item.id]?.endDate || undefined
                                }
                                onSelect={(date) =>
                                  handleDateChange(item.id, "endDate", date)
                                }
                                initialFocus
                                disabled={(date) =>
                                  rentalDates[item.id]?.startDate
                                    ? date < rentalDates[item.id].startDate
                                    : false
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {rentalDates[item.id]?.startDate &&
                          rentalDates[item.id]?.endDate && (
                            <p className="text-sm text-gray-300">
                              Duration:{" "}
                              <span className="font-medium text-white">
                                {calculateRentalDuration(
                                  rentalDates[item.id].startDate,
                                  rentalDates[item.id].endDate
                                )}{" "}
                                days
                              </span>
                            </p>
                          )}
                      </div>
                    )}
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
