"use client";

import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Trash2Icon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice } from "@/utils/helper";
import { useCart } from "@/hooks/useCart";

interface PriceDetails {
  id: string;
  maximumRentalPeriod: number;
  minimumRentalPeriod: number;
  productId: string;
  rentalPricePerDay: number;
  salePrice: number | null;
}

interface Product {
  id: string;
  productName: string;
  productDescription: string;
  uploadedCoverImage: string;
  productType: string;
  gameType: string;
  discountPercentage: number;
  status: string;
  priceDetails: PriceDetails;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  rentalStart: string;
  rentalEnd: string;
  type: string;
  product: Product;
  priceDetails: PriceDetails;
}

interface CartItemsProps {
  cartItems: CartItem[];
  totalPrice: number;
}

const CartItems = ({ cartItems }: CartItemsProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    cartItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }),
      {}
    )
  );

  // State for rental dates
  const [rentalDates, setRentalDates] = useState<
    Record<string, { start: Date; end: Date }>
  >(
    cartItems.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          start: new Date(item.rentalStart),
          end: new Date(item.rentalEnd),
        },
      }),
      {}
    )
  );

  // State to track which items are being edited
  const [editingDates, setEditingDates] = useState<Record<string, boolean>>(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const { handleUpdateCartItem } = useCart();
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities({ ...quantities, [id]: newQuantity });
    handleUpdateCartItem(id, newQuantity);
    // Here you would typically call an API to update the cart
  };
  const { handleRemoveFromCart } = useCart();
  const handleRemoveItem = (id: string) => {
    handleRemoveFromCart(id);
    // Here you would typically call an API to remove the item
    console.log("Removing item:", id);
  };

  const toggleEditDates = (id: string) => {
    setEditingDates({ ...editingDates, [id]: !editingDates[id] });
  };

  const handleStartDateChange = (id: string, date: Date | undefined) => {
    if (!date) return;

    // Ensure start date is not after end date
    const currentEnd = rentalDates[id].end;
    if (date > currentEnd) {
      date = new Date(currentEnd);
    }

    setRentalDates({
      ...rentalDates,
      [id]: { ...rentalDates[id], start: date },
    });
  };

  const handleEndDateChange = (id: string, date: Date | undefined) => {
    if (!date) return;

    // Ensure end date is not before start date
    const currentStart = rentalDates[id].start;
    if (date < currentStart) {
      date = new Date(currentStart);
    }

    setRentalDates({
      ...rentalDates,
      [id]: { ...rentalDates[id], end: date },
    });
  };

  const saveDateChanges = (id: string) => {
    // Here you would typically call an API to update the rental dates
    console.log("Saving date changes for item:", id, rentalDates[id]);
    toggleEditDates(id);
  };

  const cancelDateChanges = (id: string) => {
    // Reset to original dates
    const originalItem = cartItems.find((item) => item.id === id);
    if (originalItem) {
      setRentalDates({
        ...rentalDates,
        [id]: {
          start: new Date(originalItem.rentalStart),
          end: new Date(originalItem.rentalEnd),
        },
      });
    }
    toggleEditDates(id);
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  // Calculate the new total price based on current quantities and rental dates
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const rentalDays = calculateDays(
        rentalDates[item.id].start,
        rentalDates[item.id].end
      );
      const itemTotal =
        item.priceDetails.rentalPricePerDay * rentalDays * quantities[item.id];
      return total + itemTotal;
    }, 0);
  };

  const newTotalPrice = calculateTotalPrice();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mt-[100px]">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <ShoppingCartIcon className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-white">Your Cart</h1>
            <Badge variant="outline" className="ml-2 text-white">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => {
              const rentalDays = calculateDays(
                rentalDates[item.id].start,
                rentalDates[item.id].end
              );
              const itemTotal =
                item.priceDetails.rentalPricePerDay *
                rentalDays *
                quantities[item.id];

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-all hover:shadow-lg bg-gray-800"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 h-48">
                      <Image
                        src={
                          item.product.uploadedCoverImage || "/placeholder.svg"
                        }
                        alt={item.product.productName}
                        fill
                        className="object-cover"
                      />
                      {item.product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 hover:bg-red-600">
                            {item.product.discountPercentage}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-xl font-bold capitalize mb-1 text-teal">
                            {item.product.productName}
                          </h2>
                          <p className="text-muted-foreground text-sm mb-3">
                            {item.product.productDescription}
                          </p>
                          <div className="flex items-center text-sm mb-2">
                            <Badge variant="secondary" className="mr-2">
                              {item.product.gameType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="capitalize text-teal"
                            >
                              {item.type}
                            </Badge>
                          </div>

                          <div className="flex items-center text-sm mb-4">
                            {!editingDates[item.id] ? (
                              <>
                                <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className=" text-white">
                                  {formatDate(rentalDates[item.id].start)} -{" "}
                                  {formatDate(rentalDates[item.id].end)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-teal"
                                >
                                  {rentalDays}{" "}
                                  {rentalDays === 1 ? "day" : "days"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 ml-2"
                                  onClick={() => toggleEditDates(item.id)}
                                >
                                  <PencilIcon className="h-3 w-3 text-white" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <div className="flex items-center gap-2">
                                  <div className="grid gap-1">
                                    <div className="text-xs font-medium text-teal">
                                      Start Date
                                    </div>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-[140px] justify-start text-left font-normal"
                                          size="sm"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {formatDate(
                                            rentalDates[item.id].start
                                          )}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={rentalDates[item.id].start}
                                          onSelect={(date) =>
                                            handleStartDateChange(item.id, date)
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>

                                  <div className="grid gap-1">
                                    <div className="text-xs font-medium text-teal">
                                      End Date
                                    </div>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-[140px] justify-start text-left font-normal"
                                          size="sm"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {formatDate(rentalDates[item.id].end)}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={rentalDates[item.id].end}
                                          onSelect={(date) =>
                                            handleEndDateChange(item.id, date)
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>

                                <div className="flex gap-1 mt-1 sm:mt-0">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                                    onClick={() => saveDateChanges(item.id)}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                                    onClick={() => cancelDateChanges(item.id)}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                quantities[item.id] - 1
                              )
                            }
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 font-medium text-white">
                            {quantities[item.id]}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                quantities[item.id] + 1
                              )
                            }
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">
                            ${item.priceDetails.rentalPricePerDay} ×{" "}
                            {rentalDays} days × {quantities[item.id]}
                          </div>
                          <div className="text-xl font-bold text-teal">
                            {formatPrice(itemTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full md:w-1/3">
          <Card className="sticky top-24 bg-gray-800 text-white">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-teal">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => {
                  const rentalDays = calculateDays(
                    rentalDates[item.id].start,
                    rentalDates[item.id].end
                  );
                  const itemTotal =
                    item.priceDetails.rentalPricePerDay *
                    rentalDays *
                    quantities[item.id];

                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="capitalize">
                        {item.product.productName} ({quantities[item.id]} ×{" "}
                        {rentalDays} days)
                      </span>
                      <span>${itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${newTotalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground text-sm mb-6">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${newTotalPrice.toFixed(2)}</span>
              </div>

              <Button
                className="w-full bg-teal text-white hover:bg-teal/90"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <p className="text-center text-muted-foreground text-xs mt-4">
                By proceeding, you agree to our terms and conditions.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
