// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export function Home() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "pickup">(
//     "pickup"
//   );

//   const cartItems = [
//     {
//       id: 1,
//       name: "UNO",
//       price: 300.0,
//       quantity: 1,
//       image: "/placeholder.svg?height=60&width=60",
//     },
//     {
//       id: 2,
//       name: "Jenga",
//       price: 320.0,
//       quantity: 2,
//       image: "/placeholder.svg?height=60&width=60",
//     },
//     {
//       id: 3,
//       name: "Chess",
//       price: 1000.0,
//       quantity: 1,
//       image: "/placeholder.svg?height=60&width=60",
//     },
//   ];

//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
//   const total = subtotal;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-zinc-900">
//       <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
//         <DialogContent className="sm:max-w-[800px] bg-zinc-800 text-white p-0">
//           <div className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-center">My Cart</h1>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2">
//                 <Card className="bg-zinc-700 border-zinc-600">
//                   <CardHeader>
//                     <CardTitle>Payment</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-sm font-medium mb-3">Pay With:</h3>
//                         <RadioGroup
//                           value={paymentMethod}
//                           onValueChange={(value) =>
//                             setPaymentMethod(value as "telebirr" | "pickup")
//                           }
//                           className="flex gap-6"
//                         >
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value="telebirr" id="telebirr" />
//                             <Label htmlFor="telebirr">Telebirr</Label>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <RadioGroupItem value="pickup" id="pickup" />
//                             <Label htmlFor="pickup">Pay at Pickup</Label>
//                           </div>
//                         </RadioGroup>
//                       </div>

//                       {paymentMethod === "pickup" && (
//                         <div className="space-y-6">
//                           <div className="text-center">
//                             <h2 className="text-xl font-bold mb-2">
//                               Pay at pickup
//                             </h2>
//                             <div className="text-sm text-zinc-300">
//                               Expires in{" "}
//                               <span className="text-green-400 text-xl font-bold">
//                                 72:00
//                               </span>{" "}
//                               hours
//                             </div>
//                           </div>

//                           <div className="text-center py-4">
//                             <div className="text-lg font-bold">
//                               Pay {total.toFixed(2)}
//                             </div>
//                             <div className="text-sm text-zinc-300">
//                               when you pick up
//                             </div>
//                           </div>

//                           <div className="text-xs text-zinc-400 mt-4">
//                             Your personal data will be used to process your
//                             order, support your experience throughout this
//                             website, and for other purposes described in our
//                             privacy policy.
//                           </div>
//                         </div>
//                       )}

//                       {paymentMethod === "telebirr" && (
//                         <div className="space-y-6">
//                           <div className="flex flex-col items-center">
//                             <div className="w-32 h-32 relative mb-4">
//                               <Image
//                                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-02%20215005-czYocfkYDVqXFBwjxw01ByQuCLWKj6.png"
//                                 alt="Telebirr Logo"
//                                 fill
//                                 className="object-contain"
//                               />
//                             </div>

//                             <h2 className="text-xl font-bold mb-2">
//                               Easy Online Payment
//                             </h2>
//                             <p className="text-center text-sm text-zinc-300 mb-6">
//                               Make your payment expeditious now, <br />
//                               faster today. No additional admin fee.
//                             </p>

//                             <Button className="w-full bg-black text-white hover:bg-gray-800 mb-3">
//                               Login
//                             </Button>

//                             <Button
//                               variant="outline"
//                               className="w-full border-blue-400 text-blue-500 hover:bg-blue-50"
//                             >
//                               Register
//                             </Button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="md:col-span-1">
//                 <Card className="bg-zinc-700 border-zinc-600">
//                   <CardHeader>
//                     <CardTitle>Order Summary</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="space-y-4">
//                       {cartItems.map((item) => (
//                         <div key={item.id} className="flex items-center gap-3">
//                           <div className="relative w-12 h-12 overflow-hidden rounded">
//                             <Image
//                               src={item.image || "/placeholder.svg"}
//                               alt={item.name}
//                               width={48}
//                               height={48}
//                               className="object-cover"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-medium">{item.name}</div>
//                             <div className="text-sm text-zinc-300">
//                               Qty: {item.quantity}
//                             </div>
//                           </div>
//                           <div className="font-medium">
//                             {item.price.toFixed(2)}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="border-t border-zinc-600 pt-4">
//                       <div className="flex justify-between text-sm">
//                         <span>Subtotal</span>
//                         <span>{subtotal.toFixed(2)}</span>
//                       </div>
//                     </div>

//                     <div className="border-t border-zinc-600 pt-4">
//                       <div className="flex justify-between font-bold">
//                         <span>Total</span>
//                         <span className="text-xl">{total.toFixed(2)}</span>
//                       </div>
//                       <div className="text-xs text-zinc-300">
//                         Including all tax and fees
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
