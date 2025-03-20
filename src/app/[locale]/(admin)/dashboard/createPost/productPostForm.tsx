"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ProductPreview from "./productPreview";
import Image from "next/image";
import { useCreateProductMutation } from "@/state/features/productApi";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    productName: z.string().min(1, "Product name is required"),
    productDescription: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    uploadedCoverImage: z.string().url("Invalid image URL"),
    discountPercentage: z
      .number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%")
      .optional(),
    ageRestriction: z.string().min(0, "Age restriction is required"),
    gameType: z.string().min(1, "Game type is required"),
    availableForSale: z
      .number()
      .min(0, "Available products for sale cannot be negative")
      .optional(),
    availableForRent: z
      .number()
      .min(0, "Available products for rent cannot be negative")
      .optional(),
    productType: z.enum(["SALE", "RENT", "BOTH"]).default("SALE"),
    pricing: z.object({
      salePrice: z
        .number()
        .min(0, "Sale price must be a positive number")
        .optional(),
      rentalPricePerDay: z
        .number()
        .min(0, "Rental price per hour must be a positive number")
        .optional(),
      minimumRentalPeriod: z
        .number()
        .min(1, "Minimum rental period must be at least 1 hour/day")
        .optional(),
      maximumRentalPeriod: z
        .number()
        .min(1, "Maximum rental period must be at least 1 hour/day")
        .optional(),
    }),
    uploadedVideo: z.object({
      setUp: z.string().url("Invalid video URL"),
      actionCard: z.string().url("Invalid video URL"),
      gamePlay: z.string().url("Invalid video URL"),
    }),
  })
  .refine(
    (data) => {
      if (
        data.pricing.salePrice === undefined &&
        data.pricing.rentalPricePerDay === undefined
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Either salePrice or rentalPricePerDay must be provided",
      path: ["pricing"],
    }
  )
  .refine(
    (data) => {
      if (
        data.availableForRent &&
        data.pricing.minimumRentalPeriod !== undefined &&
        data.pricing.maximumRentalPeriod !== undefined &&
        data.pricing.minimumRentalPeriod > data.pricing.maximumRentalPeriod
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Minimum rental period cannot be greater than the maximum rental period",
      path: ["pricing"],
    }
  );

const ageRestrictions = ["None", "13+", "15+", "18+"];

const gameTypes = [
  "Table Top Game",
  "Card Game",
  "Board Game",
  "Role Playing Game",
  "Dice Game",
  "Strategy Game",
  "Party Game",
  "Educational Game",
  "Puzzle Game",
  "Other",
];

// Define the steps for the form wizard
const formSteps = [
  { id: "basic", title: "Basic Information" },
  { id: "pricing", title: "Pricing & Availability" },
  { id: "media", title: "Media & Videos" },
  { id: "review", title: "Review & Submit" },
];

export default function ProductPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [ageOpen, setAgeOpen] = useState(false);
  const [gameTypeOpen, setGameTypeOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "Dart",
      productDescription:
        "The ultimate Chess game experience, featuring AI opponents and multiplayer support.",
      uploadedCoverImage:
        "https://images.unsplash.com/photo-1580894328141-6f3421a182a8?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      discountPercentage: 50,
      ageRestriction: "All",
      gameType: "Table Top Game",
      productType: "BOTH",
      availableForRent: 50,
      availableForSale: 100,
      pricing: {
        rentalPricePerDay: 189,
        minimumRentalPeriod: 1,
        maximumRentalPeriod: 24,
        salePrice: 100,
      },
      uploadedVideo: {
        setUp: "https://youtu.be/RulCHZylVck?si=cY-jJL3lH9rSGUuf",
        actionCard: "https://youtu.be/RulCHZylVck?si=cY-jJL3lH9rSGUuf",
        gamePlay: "https://youtu.be/RulCHZylVck?si=cY-jJL3lH9rSGUuf",
      },
    },
  });

  const productType = form.watch("productType");
  const [createProduct] = useCreateProductMutation();
  const { toast } = useToast();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true); // Show loading state
      console.log("Submitting:", values);

      await createProduct(values).unwrap(); // Await API call

      toast({
        title: "Product Created",
        description: "Your product has been successfully listed!",
        style: {
          backgroundColor: "green",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
        },
      });
    } catch (err) {
      console.log("Error:", err);
      // Handle API error (e.g., show toast notification)
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  }

  const nextStep = async () => {
    if (currentStep < formSteps.length - 1) {
      // Define which fields to validate for each step
      const fieldsToValidate = {
        0: [
          "productName",
          "productDescription",
          "gameType",
          "ageRestriction",
          "discountPercentage",
        ],
        1: [
          "productType",
          "availableForSale",
          "availableForRent",
          "pricing.salePrice",
          "pricing.rentalPricePerDay",
          "pricing.minimumRentalPeriod",
          "pricing.maximumRentalPeriod",
        ],
        2: [
          "uploadedCoverImage",
          "uploadedVideo.setUp",
          "uploadedVideo.actionCard",
          "uploadedVideo.gamePlay",
        ],
      }[currentStep];

      // Get only the fields that need validation based on product type
      let filteredFields: (keyof z.infer<typeof formSchema>)[] =
        fieldsToValidate
          ? [...(fieldsToValidate as (keyof z.infer<typeof formSchema>)[])]
          : [];
      const productTypeValue = form.getValues("productType");

      if (currentStep === 1) {
        if (productTypeValue === "SALE") {
          filteredFields = filteredFields.filter(
            (field) =>
              !field.includes("rentalPrice") &&
              !field.includes("availableForRent") &&
              !field.includes("RentalPeriod")
          );
        } else if (productTypeValue === "RENT") {
          filteredFields = filteredFields.filter(
            (field) =>
              !field.includes("salePrice") &&
              !field.includes("availableForSale")
          );
        }
      }

      // Trigger validation only for the fields in the current step
      const result = await form.trigger(filteredFields);

      if (result) {
        setCurrentStep(currentStep + 1);
      } else {
        // Focus on the first invalid field
        const firstError = form.formState.errors;
        if (firstError) {
          const errorKeys = Object.keys(firstError);
          if (errorKeys.length > 0) {
            const firstErrorKey = errorKeys[0];
            const element = document.getElementsByName(firstErrorKey)[0];
            if (element) {
              element.focus();
            }
          }
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="dark bg-black text-white min-h-screen p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-gray-900 text-gray-300">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-3xl mx-auto"
            >
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {formSteps.map((step, index) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={cn(
                        "text-sm font-medium",
                        currentStep >= index ? "text-teal" : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </button>
                  ))}
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal h-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${((currentStep + 1) / formSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <Card className="bg-gray-900 border-gray-800">
                {/* Step 1: Basic Information */}
                {currentStep === 0 && (
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-xl font-semibold">Basic Information</h2>

                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter product name"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter product description"
                              className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                {...field}
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ageRestriction"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Age Restriction</FormLabel>
                            <Popover open={ageOpen} onOpenChange={setAgeOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={ageOpen}
                                    className="w-full justify-between border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                                  >
                                    {field.value
                                      ? field.value
                                      : "Select age restriction"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0 bg-gray-800 border border-gray-700 text-white">
                                <Command className="bg-gray-800">
                                  <CommandInput
                                    placeholder="Search age restriction..."
                                    className="text-white"
                                  />
                                  <CommandList className="text-white">
                                    <CommandEmpty className="text-gray-400">
                                      No age restriction found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {ageRestrictions.map((age) => (
                                        <CommandItem
                                          key={age}
                                          value={age}
                                          onSelect={() => {
                                            form.setValue(
                                              "ageRestriction",
                                              age
                                            );
                                            setAgeOpen(false);
                                          }}
                                          className="hover:bg-gray-700"
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4 text-teal",
                                              field.value === age
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {age}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="gameType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Game Type</FormLabel>
                          <Popover
                            open={gameTypeOpen}
                            onOpenChange={setGameTypeOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={gameTypeOpen}
                                  className="w-full justify-between border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                                >
                                  {field.value
                                    ? field.value
                                    : "Select game type"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-gray-800 border border-gray-700 text-white">
                              <Command className="bg-gray-800">
                                <CommandInput
                                  placeholder="Search game type..."
                                  className="text-white"
                                />
                                <CommandList className="text-white">
                                  <CommandEmpty className="text-gray-400">
                                    No game type found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {gameTypes.map((type) => (
                                      <CommandItem
                                        key={type}
                                        value={type}
                                        onSelect={() => {
                                          form.setValue("gameType", type);
                                          setGameTypeOpen(false);
                                        }}
                                        className="hover:bg-gray-700"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 text-teal",
                                            field.value === type
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {type}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                )}

                {/* Step 2: Pricing & Availability */}
                {currentStep === 1 && (
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-xl font-semibold">
                      Pricing & Availability
                    </h2>

                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Product Type</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-3">
                              <label
                                htmlFor="sale-option"
                                className={cn(
                                  "flex items-center justify-center px-4 py-3 rounded-md border border-gray-700 bg-gray-800 cursor-pointer transition-colors hover:bg-gray-700",
                                  field.value === "SALE" &&
                                    "border-teal bg-gray-700 ring-2 ring-teal/20"
                                )}
                              >
                                <input
                                  type="radio"
                                  id="sale-option"
                                  value="SALE"
                                  checked={field.value === "SALE"}
                                  className="sr-only"
                                  onChange={() => field.onChange("SALE")}
                                />
                                <span className="font-medium">Sale Only</span>
                              </label>

                              <label
                                htmlFor="rent-option"
                                className={cn(
                                  "flex items-center justify-center px-4 py-3 rounded-md border border-gray-700 bg-gray-800 cursor-pointer transition-colors hover:bg-gray-700",
                                  field.value === "RENT" &&
                                    "border-teal bg-gray-700 ring-2 ring-teal/20"
                                )}
                              >
                                <input
                                  type="radio"
                                  id="rent-option"
                                  value="RENT"
                                  checked={field.value === "RENT"}
                                  className="sr-only"
                                  onChange={() => field.onChange("RENT")}
                                />
                                <span className="font-medium">Rent Only</span>
                              </label>

                              <label
                                htmlFor="both-option"
                                className={cn(
                                  "flex items-center justify-center px-4 py-3 rounded-md border border-gray-700 bg-gray-800 cursor-pointer transition-colors hover:bg-gray-700",
                                  field.value === "BOTH" &&
                                    "border-teal bg-gray-700 ring-2 ring-teal/20"
                                )}
                              >
                                <input
                                  type="radio"
                                  id="both-option"
                                  value="BOTH"
                                  checked={field.value === "BOTH"}
                                  className="sr-only"
                                  onChange={() => field.onChange("BOTH")}
                                />
                                <span className="font-medium">
                                  Both Rent & Sale
                                </span>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(productType === "SALE" || productType === "BOTH") && (
                      <div className="space-y-4 border border-gray-800 rounded-lg p-4">
                        <h3 className="font-medium text-teal">
                          Sale Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="availableForSale"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Available Units for Sale</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pricing.salePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sale Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {(productType === "RENT" || productType === "BOTH") && (
                      <div className="space-y-4 border border-gray-800 rounded-lg p-4">
                        <h3 className="font-medium text-teal">
                          Rental Information
                        </h3>
                        <FormField
                          control={form.control}
                          name="availableForRent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Available Units for Rent</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  {...field}
                                  className="bg-gray-800 border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="pricing.rentalPricePerDay"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rental Price Per Day</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pricing.minimumRentalPeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Minimum Rental Period (Days)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pricing.maximumRentalPeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Maximum Rental Period (Days)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}

                {/* Step 3: Media & Videos */}
                {currentStep === 2 && (
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-xl font-semibold">Media & Videos</h2>

                    <FormField
                      control={form.control}
                      name="uploadedCoverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter image URL"
                              className="bg-gray-800 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value && (
                              <span className="mt-2">
                                <span className="block mb-2 text-sm">
                                  Preview:
                                </span>
                                <span className="relative w-[400px] h-[200px]">
                                  <Image
                                    fill
                                    src={field.value || "/placeholder.svg"}
                                    alt="Cover preview"
                                    className="w-full max-w-xs h-40 object-cover rounded-md"
                                  />
                                </span>
                              </span>
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="uploadedVideo.setUp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Set Up Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube URL"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="uploadedVideo.actionCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action Card Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube URL"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="uploadedVideo.gamePlay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Game Play Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter YouTube URL"
                              {...field}
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 3 && (
                  <CardContent className="pt-6 space-y-6">
                    <h2 className="text-xl font-semibold">Review & Submit</h2>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-400">
                              Product Name
                            </span>
                            <span>{form.getValues("productName")}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">
                              Game Type
                            </span>
                            <span>{form.getValues("gameType")}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">
                              Age Restriction
                            </span>
                            <span>{form.getValues("ageRestriction")}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400">
                              Discount
                            </span>
                            <span>{form.getValues("discountPercentage")}%</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="block text-gray-400">
                            Description
                          </span>
                          <p className="text-sm">
                            {form.getValues("productDescription")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">
                          Product Type
                        </h3>
                        <p className="text-sm">
                          {form.getValues("productType") === "BOTH"
                            ? "Both Rent & Sale"
                            : form.getValues("productType") === "RENT"
                            ? "Rent Only"
                            : "Sale Only"}
                        </p>
                      </div>

                      {(productType === "SALE" || productType === "BOTH") && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-400">
                            Sale Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="block text-gray-400">
                                Sale Price
                              </span>
                              <span>
                                ${form.getValues("pricing.salePrice")}
                              </span>
                            </div>
                            <div>
                              <span className="block text-gray-400">
                                Available Units
                              </span>
                              <span>{form.getValues("availableForSale")}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {(productType === "RENT" || productType === "BOTH") && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-400">
                            Rental Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="block text-gray-400">
                                Rental Price Per Day
                              </span>
                              <span>
                                ${form.getValues("pricing.rentalPricePerDay")}
                              </span>
                            </div>
                            <div>
                              <span className="block text-gray-400">
                                Available Units
                              </span>
                              <span>{form.getValues("availableForRent")}</span>
                            </div>
                            <div>
                              <span className="block text-gray-400">
                                Rental Period
                              </span>
                              <span>
                                {form.getValues("pricing.minimumRentalPeriod")}{" "}
                                -{" "}
                                {form.getValues("pricing.maximumRentalPeriod")}{" "}
                                days
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-400">
                          Media
                        </h3>
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-400">
                              Cover Image
                            </span>
                            <div className="relative w-[400px] h-[200px]">
                              <Image
                                fill
                                src={
                                  form.getValues("uploadedCoverImage") ||
                                  "/placeholder.svg"
                                }
                                alt="Cover preview"
                                className="w-full max-w-xs h-40 object-cover rounded-md mt-2"
                              />
                            </div>
                          </div>
                          <div>
                            <span className="block text-gray-400">
                              Video Links
                            </span>
                            <ul className="list-disc list-inside mt-1">
                              <li>
                                Setup: {form.getValues("uploadedVideo.setUp")}
                              </li>
                              <li>
                                Action Card:{" "}
                                {form.getValues("uploadedVideo.actionCard")}
                              </li>
                              <li>
                                Gameplay:{" "}
                                {form.getValues("uploadedVideo.gamePlay")}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}

                <CardFooter className="flex justify-between pt-2 pb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="border-gray-700 text-white hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < formSteps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-teal hover:bg-teal text-white"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="bg-teal hover:bg-teal text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Product Post"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => setActiveTab("form")}
              className="border-teal text-teal hover:bg-teal"
            >
              Back to Form
            </Button>
          </div>
          <ProductPreview formData={form.getValues()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
