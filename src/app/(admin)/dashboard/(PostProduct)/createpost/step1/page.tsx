"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/state/features/createPostSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/state/store";

export default function CreatePostStep1() {
  // Define the Zod schema for validation
  const productSchema = z.object({
    productName: z
      .string()
      .min(3, "Product name must contain at least 3 characters")
      .max(50, "Product name can't be longer than 50 characters"),
    productDescription: z
      .string()
      .min(50, "Description must contain at least 50 characters"),
  });

  // Use react-hook-form with Zod resolver
  const product = useSelector((state: RootState) => state.createPost);
  const { productName, productDescription } = product;
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: productName,
      productDescription: productDescription,
    },
  });
  const dispatch = useDispatch();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof productSchema>) {
    dispatch(updateProduct(values));
    router.push("/dashboard/createpost/step2");
    console.log(values);
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col "
        >
          {/* Product Name Field */}
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold text-gray-800">
                  Product Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    {...field}
                    className="border border-gray-300 px-4 py-2 md:py-6 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-black"
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Provide a catchy name for your product that will be shown
                  publicly.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description Field */}
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold text-gray-800">
                  Product Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                    rows={4}
                    className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none text-black"
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Please provide a detailed description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="w-fit  md:w-fit px-6 py-3 md:py-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Submit & Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
