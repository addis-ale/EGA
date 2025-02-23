"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resetProduct } from "@/state/features/createPostSlice";
import { useEffect } from "react";

// Schema
const productSchema = z.object({
  productName: z.string().min(3).max(50).optional(),
  productDescription: z.string().min(50).optional(),
  coverImage: z.instanceof(File).optional(),
  video: z.instanceof(File).optional(),
  price: z.number().min(0),
  discountPercentage: z.number().min(0).max(100),
  ageRestriction: z.enum(["all", "13", "15", "18"]),
  gameType: z.string().min(1),
  availableProduct: z.number().int().min(1),
});

type ProductState = z.infer<typeof productSchema>;

export default function ProductReview() {
  const product = useSelector((state: RootState) => state.createPost);
  const {
    price,
    discountPercentage,
    ageRestriction,
    productDescription,
    productName,
    availableProduct,
    coverImage,
    video,
    gameType,
  } = product;

  const discountedPrice = price - (price * discountPercentage) / 100;
  const router = useRouter();
  const dispatch = useDispatch();

  // Form handling
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductState>({
    resolver: zodResolver(productSchema),
    defaultValues: product, // Ensure form is pre-filled
  });

  // Sync form values with Redux state
  useEffect(() => {
    Object.keys(product).forEach((key) => {
      setValue(key as keyof ProductState, product[key as keyof ProductState]);
    });
  }, [product, setValue]);

  async function onSubmit(data: ProductState) {
    try {
      console.log("Submitting product:", data);
      // TODO: Dispatch to Redux or send API request
      // await apiCallToSubmitProduct(data);

      // Navigate to the next step or success page
      router.push("/dashboard/createpost/success");
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center">
      <Card className="w-full max-w-6xl mx-auto bg-white text-black shadow-lg rounded-lg border-none">
        <CardHeader className="border-b border-gray-300 bg-gray-50 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            Product Review
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {productName}
              </h2>
              <p className="text-md text-gray-700 leading-relaxed mt-2 border-l-4 border-green-500 pl-3">
                {productDescription}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="font-semibold text-gray-800 text-lg">
                  Price:
                </span>
                <span className="text-xl font-bold text-green-600">
                  (ETB){price.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white text-sm px-3 py-1">
                    {discountPercentage}% off
                  </Badge>
                )}
              </div>
              {discountPercentage > 0 && (
                <div className="text-md text-gray-700 mt-1">
                  <span className="font-semibold">Discounted Price:</span> (ETB)
                  {discountedPrice.toFixed(2)}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-6 text-md bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <span className="font-semibold text-gray-800">
                    Age Restriction:
                  </span>{" "}
                  {ageRestriction}+
                </div>
                <div>
                  <span className="font-semibold text-gray-800">
                    Available:
                  </span>{" "}
                  {availableProduct}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">
                    Game Type:
                  </span>{" "}
                  {gameType}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src={"/placeholder.png"}
                alt={productName || "Product Image"}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
              />
              <video
                src={"/videoplaceholder.mp4"}
                controls
                className="w-full h-48 mt-4 object-cover rounded-lg border border-gray-300 shadow-sm"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-300 bg-gray-50 p-6 rounded-b-lg">
          <Button
            type="button"
            className="w-fit bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg px-4 py-2 transition"
            onClick={() => router.push("/dashboard/createpost/step3")}
          >
            Previous
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              type="button"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2 transition"
              onClick={() => dispatch(resetProduct())}
            >
              Clear
            </Button>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition"
              >
                Confirm
              </Button>
            </form>
          </div>
        </CardFooter>
        {Object.keys(errors).length > 0 && (
          <div className="p-4 mt-4 text-red-600 bg-red-100 border-l-4 border-red-500 rounded-lg">
            <p className="font-semibold text-lg">Error Submitting Form:</p>
            <ul className="list-disc ml-5">
              {errors.productName && (
                <li>Product Name must be between 3 and 50 characters.</li>
              )}
              {errors.coverImage && (
                <li>Product must contain a cover image.</li>
              )}
              {errors.video && (
                <li>Product must contain a cover a demo video.</li>
              )}
              {errors.productDescription && (
                <li>
                  Product Description must be at least 50 characters long.
                </li>
              )}
              {errors.price && <li>Price must be a valid number.</li>}
              {errors.discountPercentage && (
                <li>Discount Percentage must be between 0 and 100.</li>
              )}
              {errors.ageRestriction && (
                <li>Age Restriction must be one of the allowed values.</li>
              )}
              {errors.gameType && <li>Game Type is required.</li>}
              {errors.availableProduct && (
                <li>Available Product must be a positive integer.</li>
              )}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
