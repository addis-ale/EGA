import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function EmptyCart() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between min-h-screen w-full bg-black p-4">
      <Separator
        orientation="vertical"
        className="h-[60%] w-[3px] bg-gray-500"
      />
      <div className="relative flex flex-col items-center justify-center max-w-md w-full text-center">
        {/* Background blob with cart overlay */}
        <div className="relative mb-4 z-10">
          <Image
            src="/imageAssets/Background.png"
            alt="Background decoration"
            width={300}
            height={150}
            className="opacity-80"
          />
          <Image
            src="/imageAssets/cart.png"
            alt="Empty cart"
            width={150}
            height={150}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Text content */}
        <h2 className="text-white text-xl font-medium mb-1 z-10">
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-sm mb-6 z-10">
          Check out what is trending
        </p>

        {/* Button */}
        <Button
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-2 z-10"
          onClick={() => router.push("/")}
        >
          Add to cart
        </Button>
      </div>
      <Separator
        orientation="vertical"
        className="h-[60%] w-[3px] bg-gray-500"
      />
    </div>
  );
}
