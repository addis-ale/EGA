"use client";

import { Button } from "@/components/ui/button";

export function createNonceStr() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 32; i++) {
    // eslint-disable-next-line prefer-const
    let index = Math.floor(Math.random() * chars.length);
    str += chars[index];
  }
  return str;
}
// const mockdata = {
//   status: "PENDING",
//   totalPrice: 20,
//   paymentMethod: "TeleBirr",

//   orderItem: [
//     {
//       productId: "product1",
//       quantity: 2,
//     },
//     {
//       productId: "product2",
//       quantity: 1,
//     },
//   ],
// };
export default function Pay() {
  const cartId = "33333";
  const authToken = createNonceStr();
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/apply/h5token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authToken: authToken, // Use the actual token
        }),
      });
      if (!response.ok) {
        throw new Error("error happend ");
      }
      const orderResponse = await fetch("/api/create/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "BuyGoods",
          amount: "amount",
          authToken: authToken,
          cartId: cartId, // Use the received auth token
        }),
      });
      const rawRequest = await orderResponse.text();
      console.log("payment request:", rawRequest.trim());
    } catch (error) {
      console.log(error);
    }
  };

  return <Button onClick={handlePayment}>pay with telebirr</Button>;
}
