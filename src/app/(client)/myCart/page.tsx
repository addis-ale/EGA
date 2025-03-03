"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { fetchUser, setUser } from "@/state/features/currentUserSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CheckoutModal } from "@/components/checkOut-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
export default function MyCart() {
  const [error, setError] = useState("");
  const [item, setItem] = useState([]);
  const { user } = useSelector((state: RootState) => state.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!user) return;
    async function getCartItem() {
      const res = await fetch(`/api/getCart/${user.id}`);
      const data = await res.json();
      if (data.Success === "false") {
        setError(data.error);
      }
      console.log(data);
      setItem(data);
    }
    getCartItem();
  }, [user]);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Uno",
      category: "Table top game",
      age: "13+",
      price: 300,
      quantity: 1,
      image: "/uno.png", // Replace with actual image
    },
    {
      id: 2,
      name: "Jenga",
      category: "Table top game",
      age: "13+",
      price: 500,
      quantity: 2,
      image: "/jenga.png", // Replace with actual image
    },
    {
      id: 3,
      name: "Chess",
      category: "Table top game",
      age: "13+",
      price: 1000,
      quantity: 1,
      image: "/chess.png", // Replace with actual image
    },
  ]);
  const handleWishList = async (id: number) => {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prodcutId: id,
      }),
    });
    const data = await response.json();
    if (data.Success === "false") {
      console.log("error happend");
      setError(data.error);
      toast({
        description: error,
      });
    }
    toast({
      description: "Item added to wishlist",
    });
  };
  const handleQuantityChange = async (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: quantity,
            }
          : {
              ...item,
            }
      )
    );

    await fetch(`/api/getCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        quantity: quantity,
      }),
    });
  };

  const handleRemove = async (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    await fetch(`/api/deletecartitem/cartid/${id}`, {
      method: "DELETE",
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div>{item ? "yes it is" : "not "}</div>
      <div
        className={` ${
          isOpen
            ? "bg-white/10 backdrop-blur-md"
            : "max-w-7xl mx-auto p-6 text-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6">My Cart</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between  p-4 rounded-full white shadow-lg"
              >
                <div className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="text-sm text-gray-400">Age {item.age}</p>
                    <h2 className="text-lg font-bold mt-2">
                      {item.price} Birr
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="bg-green-500 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="bg-green-500 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleWishList(item.id)}
                    >
                      Move to Wishlist
                    </Button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-600 p-6 rounded-lg w-full md:w-1/3 shadow-lg">
            <h1 className="text-xl font-bold mb-4">Order Summary</h1>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-500 p-2 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <h1>{item.name}</h1>
                  </div>
                  <div className="text-right">
                    <p>{item.price} Birr</p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Gift or discount code"
                className="w-full p-2 text-black rounded-md"
              />
              <button className="w-full bg-gray-600 mt-2 p-2 rounded-md">
                Apply
              </button>
            </div>
            <div className="mt-4">
              <p className="flex justify-between text-lg font-semibold">
                Subtotal <span>{subtotal} Birr</span>
              </p>
              <p className="flex justify-between text-lg font-semibold">
                Taxes <span>6.24 Birr</span>
              </p>
              <p className="flex justify-between text-xl font-bold mt-2">
                Total <span>{subtotal + 6.24} Birr</span>
              </p>
            </div>
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full bg-green-500 text-white text-lg font-bold py-2 rounded-md mt-4"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>{" "}
      <div className="flex items-center bg-white/10 backdrop-blur-md justify-center min-h-screen ">
        <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
          <DialogContent className="sm:max-w-[800px] bg-white/10 backdrop-blur-md text-white p-0">
            <CheckoutModal />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
