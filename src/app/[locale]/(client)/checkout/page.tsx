/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useGetCartItemsQuery } from "@/state/features/cartApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils/helper";
const CheckoutPage = () => {
  const { data, isLoading } = useGetCartItemsQuery();
  const cartItems = data?.cart || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCartItems = (cartItems: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cartItems?.map((product: any) => ({
      ...product,
      priceDetails: product.priceDetails || {},
    }));
  const myCart = formatCartItems(cartItems);
  console.log("My cart >>>>", myCart);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const formatOrderData = (cartItems: any) => {
    return cartItems.map((item: any) => {
      const { product, quantity, type, priceDetails, rentalStart, rentalEnd } =
        item;

      // Base information for all items
      const formattedItem = {
        productName: product.productName,
        quantity,
        price: priceDetails.salePrice,
        type,
        totalItemPrice: priceDetails.salePrice * quantity,
      };

      // Add rental-specific information if it's a rental
      if (type === "RENT" && rentalStart && rentalEnd) {
        const startDate = new Date(rentalStart);
        const endDate = new Date(rentalEnd);

        // Calculate the number of days between start and end dates
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...formattedItem,
          rentalStart: startDate.toLocaleDateString(),
          rentalEnd: endDate.toLocaleDateString(),
          rentalDays: diffDays,
          rentalPrice: priceDetails.rentalPricePerDay,
          totalRentalPrice: (priceDetails.rentalPricePerDay || 0) * diffDays,
        };
      }

      return formattedItem;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Ethiopian phone number validation regex
    const phoneRegex = /(^\+251[0-9]{9}$)|(^09[0-9]{8}$)|(^07[0-9]{8}$)/;
    if (!phoneRegex.test(formData.phone)) {
      alert(
        "Please enter a valid Ethiopian phone number (e.g., +251912345678 or 0912345678)"
      );
      return;
    }

    // Format the cart items
    const formattedItems = formatOrderData(myCart);

    // Calculate overall total
    const overallTotal = formattedItems.reduce((sum: number, item: any) => {
      return (
        sum +
        (item.type === "RENT"
          ? item.totalRentalPrice || 0
          : item.totalItemPrice)
      );
    }, 0);

    // Prepare order data
    const orderData = {
      customerInfo: formData,
      items: formattedItems,
      total: overallTotal,
    };

    console.log("Formatted order data:", orderData);

    // Create a formatted message for Telegram
    const message = `
🛒 *New Order*
👤 *Customer*: ${formData.name}
📱 *Phone*: ${formData.phone}

*Order Items:*
${formattedItems
  .map((item: any) => {
    if (item.type === "SALE") {
      return `- ${item.productName} (${item.quantity}x) - ${formatPrice(
        item.price
      )} each = ${formatPrice(item.totalItemPrice)}`;
    } else {
      return `- ${item.productName} (${item.quantity}x) - Rental: ${
        item.rentalStart
      } to ${item.rentalEnd} (${item.rentalDays} days) - ${formatPrice(
        item.rentalPrice
      )}/day = ${formatPrice(item.totalRentalPrice)}`;
    }
  })
  .join("\n")}

*Total: ${formatPrice(overallTotal)}*
  `;

    console.log("Telegram message:", message);

    await fetch("/api/telegrambot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!myCart.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add some items to your cart to checkout.
          </p>
        </div>
      </div>
    );
  }

  // Calculate total
  const total = data?.totalPrice ?? 0;
  return (
    <div className="container max-w-4xl py-10 mx-auto ">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        {/* Customer Information Form */}
        <Card className="bg-black text-white  border-2 border-green-500">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Please provide your contact details
            </CardDescription>
          </CardHeader>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="(^\+251[0-9]{9}$)|(^09[0-9]{8}$)|(^07[0-9]{8}$)"
                    title="Please enter a valid Ethiopian phone number (e.g., +251912345678 or 0912345678)"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Order Summary */}
        <Card className="bg-black text-white  border-2 border-green-500">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCart.map((item: any) => (
              <div key={item.id} className="space-y-3">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image
                      src={
                        item.product.uploadedCoverImage || "/placeholder.svg"
                      }
                      alt={item.product.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.productName}</h3>

                    <div className="mt-1 flex items-center text-sm">
                      <span className="font-medium">
                        {formatPrice(item.priceDetails.salePrice)}
                      </span>
                      <span className="mx-2 text-muted-foreground">×</span>
                      <span>{item.quantity}</span>
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            ))}

            <div className="pt-2">
              <Separator className="my-2" />
              <div className="flex justify-between py-1 font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              form="checkout-form"
              type="submit"
              className="w-full bg-green-500 text-white hover:bg-green-500/90"
            >
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
