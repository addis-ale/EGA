/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { updateProduct } from "@/state/features/createPostSlice";

const formSchema = z.object({
  price: z.number().min(0, "Price must be a posetive number"),

  discountPercentage: z
    .number()
    .min(0, "Discount must be positive")
    .max(100, "Discount cannot exceed 100%"),

  ageRestriction: z.enum(["all", "13", "15", "18"], {
    required_error: "Please select an age restriction",
  }),
  gameType: z.string().min(1, "Please select a game type"),
  availableProduct: z
    .number()
    .int()
    .min(1, "Available product must be a atleast one"),
});

type GameInfo = z.infer<typeof formSchema>;

const ageRestrictions = [
  { label: "All Ages", value: "all" },
  { label: "13+", value: "13" },
  { label: "15+", value: "15" },
  { label: "18+", value: "18" },
];

const gameTypes = [
  "Table Game",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Puzzle",
  "Other",
];

export default function Step3() {
  const product = useSelector((state: RootState) => state.createPost);
  const {
    price,
    gameType,
    ageRestriction,
    discountPercentage,
    availableProduct,
  } = product;

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GameInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price,
      discountPercentage,
      ageRestriction,
      gameType,
      availableProduct,
    },
  });

  const onSubmit = (data: GameInfo) => {
    console.log(data);
    router.push("/dashboard/createpost/review");
    dispatch(updateProduct({ ...data, ...product }));
    // Handle form submission here
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg text-black">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-black">
          Game Information
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-gray-600">
          Enter details about your game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-base sm:text-lg font-semibold text-black"
              >
                Price (ETB)
              </Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="text-base sm:text-lg transition-all duration-200 focus:ring-2 py-1 sm:py-2 md:py-6 focus:ring-teal"
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="discountPercentage"
                className="text-base sm:text-lg font-semibold text-black"
              >
                Discount (%)
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                {...register("discountPercentage", { valueAsNumber: true })}
                className="text-base sm:text-lg transition-all duration-200 focus:ring-2 focus:ring-teal py-1 sm:py-2 md:py-6"
              />
              {errors.discountPercentage && (
                <p className="text-sm text-red-500">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="availableProduct"
                className="text-base sm:text-lg font-semibold text-black py-1 sm:py-2 md:py-6"
              >
                Available Product
              </Label>
              <Input
                id="availableProduct"
                type="number"
                {...register("availableProduct", { valueAsNumber: true })}
                className="text-base sm:text-lg transition-all duration-200 py-1 sm:py-2 md:py-6 focus:ring-2 focus:ring-teal"
              />
              {errors.availableProduct && (
                <p className="text-sm text-red-500">
                  {errors.availableProduct.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base sm:text-lg font-semibold text-black">
              Age Restriction
            </Label>
            <Controller
              name="ageRestriction"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4  gap-2 sm:gap-4">
                  {ageRestrictions.map((age) => (
                    <motion.div
                      key={age.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 bg-white text-black ${
                          field.value === age.value
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                        onClick={() => field.onChange(age.value)}
                      >
                        <CardContent className="p-2 sm:p-4 text-center">
                          <p className="text-sm sm:text-base font-semibold">
                            {age.label}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            />
            {errors.ageRestriction && (
              <p className="text-sm text-red-500">
                {errors.ageRestriction.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="gameType"
              className="text-base sm:text-lg font-semibold text-black"
            >
              Game Type
            </Label>
            <Controller
              name="gameType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="gameType"
                    className="text-base sm:text-lg transition-all duration-200 focus:ring-2 focus:ring-teal py-1 sm:py-2 md:py-6 max-w-sm  "
                  >
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black ">
                    {gameTypes.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="text-base sm:text-lg hover:bg-gray-600"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gameType && (
              <p className="text-sm text-red-500">{errors.gameType.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          type="button"
          className="w-fit bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-md border py-1 sm:py-2 md:py-6"
          onClick={() => router.push("/dashboard/createpost/step2")}
        >
          Previous
        </Button>
        <Button
          type="submit"
          className="w-fit py-1 sm:py-2 md:py-6  text-base sm:text-lg bg-teal hover:bg-teal/90 text-white transition-colors duration-200"
          onClick={handleSubmit(onSubmit)}
        >
          Submit & Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
