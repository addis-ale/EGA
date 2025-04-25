"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
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
import Image from "next/image";
import { useUpdateProductMutation } from "@/state/features/productApi";
import { useToast } from "@/hooks/use-toast";
import ProductPreview from "../../createpost/productPreview";
import { productSchema } from "@/schemas/productSchema";
import type {
  PriceDetails,
  Product,
  Review,
  VideoUploaded,
} from "@prisma/client";
import { formatPrice } from "@/utils/helper";

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
interface GameProduct extends Product {
  priceDetails: PriceDetails;
  uploadedVideo: VideoUploaded[];
  reviews: Review[];
}
export interface ProductProp {
  singleProduct: GameProduct;
}
export default function ProductUpdateForm({ singleProduct }: ProductProp) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [ageOpen, setAgeOpen] = useState(false);
  const [gameTypeOpen, setGameTypeOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<z.infer<
    typeof productSchema
  > | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: singleProduct.productName || "",
      productDescription: singleProduct.productDescription || "",
      uploadedCoverImage: singleProduct.uploadedCoverImage || "",
      discountPercentage: Number(singleProduct.discountPercentage) || 0,
      ageRestriction: singleProduct.ageRestriction || "",
      gameType: singleProduct.gameType || "",
      productType: singleProduct.productType || "BOTH",
      availableForRent: Number(singleProduct.availableForRent) || 0,
      availableForSale: Number(singleProduct.availableForSale) || 0,
      pricing: {
        rentalPricePerDay:
          Number(singleProduct.priceDetails?.rentalPricePerDay) || 0,
        minimumRentalPeriod:
          Number(singleProduct.priceDetails?.minimumRentalPeriod) || 0,
        maximumRentalPeriod:
          Number(singleProduct.priceDetails?.maximumRentalPeriod) || 0,
        salePrice: Number(singleProduct.priceDetails?.salePrice) || 0,
      },
      uploadedVideo: {
        setUp: singleProduct.uploadedVideo?.[0]?.setUp || "",
        actionCard: singleProduct.uploadedVideo?.[0]?.actionCard || "",
        gamePlay: singleProduct.uploadedVideo?.[0]?.gamePlay || "",
      },
    },
  });

  const productType = form.watch("productType");
  const [updateProduct] = useUpdateProductMutation();
  const { toast } = useToast();

  // This effect will run when formValues changes
  useEffect(() => {
    if (formValues) {
      console.log("FORM SUBMITTED via useEffect");
      console.log("Form values:", formValues);

      const submitForm = async () => {
        try {
          setIsSubmitting(true);

          // Get the product type to determine which fields to include
          const productType = formValues.productType;

          // Create a formatted object based on product type
          const formattedValues: any = {
            ...formValues,
            discountPercentage: Number(formValues.discountPercentage),
            pricing: { ...formValues.pricing },
          };

          // For SALE only products
          if (productType === "SALE") {
            formattedValues.availableForSale = Number(
              formValues.availableForSale
            );
            formattedValues.availableForRent = 0;
            formattedValues.pricing = {
              salePrice: Number(formValues.pricing.salePrice),
              // Include minimal valid values for rental fields
              rentalPricePerDay: 0,
              minimumRentalPeriod: 1,
              maximumRentalPeriod: 1,
            };
          }
          // For RENT only products
          else if (productType === "RENT") {
            formattedValues.availableForRent = Number(
              formValues.availableForRent
            );
            formattedValues.availableForSale = 0;
            formattedValues.pricing = {
              salePrice: 0,
              rentalPricePerDay: Number(formValues.pricing.rentalPricePerDay),
              minimumRentalPeriod: Number(
                formValues.pricing.minimumRentalPeriod
              ),
              maximumRentalPeriod: Number(
                formValues.pricing.maximumRentalPeriod
              ),
            };
          }
          // For BOTH products
          else {
            formattedValues.availableForSale = Number(
              formValues.availableForSale
            );
            formattedValues.availableForRent = Number(
              formValues.availableForRent
            );
            formattedValues.pricing = {
              salePrice: Number(formValues.pricing.salePrice),
              rentalPricePerDay: Number(formValues.pricing.rentalPricePerDay),
              minimumRentalPeriod: Number(
                formValues.pricing.minimumRentalPeriod
              ),
              maximumRentalPeriod: Number(
                formValues.pricing.maximumRentalPeriod
              ),
            };
          }

          console.log("Formatted values for API:", formattedValues);
          console.log("API request payload:", {
            id: singleProduct.id,
            product: formattedValues,
          });

          const result = await updateProduct({
            id: singleProduct.id,
            product: formattedValues,
          }).unwrap();

          console.log("API response:", result);

          toast({
            title: "Product updated",
            description: "Your product has been successfully updated!",
            style: {
              backgroundColor: "green",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            },
          });
        } catch (err) {
          console.error("Error updating product:", err);
          toast({
            title: "Update failed",
            description:
              "There was a problem updating your product. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
          setFormValues(null); // Reset form values after submission
        }
      };

      submitForm();
    }
  }, [formValues, singleProduct.id, updateProduct, toast]);

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log("onSubmit function called");
    console.log("Form values in onSubmit:", values);
    setFormValues(values); // This will trigger the useEffect
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
      let filteredFields: (keyof z.infer<typeof productSchema>)[] =
        fieldsToValidate
          ? [...(fieldsToValidate as (keyof z.infer<typeof productSchema>)[])]
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

  // Function to manually submit the form
  const handleManualSubmit = async () => {
    console.log("Manual submit triggered");

    // Get the current product type
    const currentProductType = form.getValues("productType");
    console.log("Current product type:", currentProductType);

    // Prepare the form data with conditional validation
    const formData = form.getValues();

    // Create a copy of the form data that we'll modify based on product type
    const validatedData = { ...formData };

    // For SALE only products, set rental fields to valid defaults
    if (currentProductType === "SALE") {
      validatedData.pricing = {
        ...validatedData.pricing,
        rentalPricePerDay: 0,
        minimumRentalPeriod: 1, // Set to minimum valid value
        maximumRentalPeriod: 1, // Set to minimum valid value
      };
      validatedData.availableForRent = 0;
    }

    // For RENT only products, set sale fields to valid defaults
    if (currentProductType === "RENT") {
      validatedData.pricing = {
        ...validatedData.pricing,
        salePrice: 0,
      };
      validatedData.availableForSale = 0;
    }

    // Set the modified values back to the form
    Object.entries(validatedData).forEach(([key, value]) => {
      if (key === "pricing") {
        Object.entries(value).forEach(([pricingKey, pricingValue]) => {
          form.setValue(`pricing.${pricingKey}` as any, pricingValue);
        });
      } else {
        form.setValue(key as any, value);
      }
    });

    // Now trigger validation with our modified values
    const isValid = await form.trigger();
    console.log("Form validation result:", isValid);

    if (isValid) {
      // Get the values after our modifications
      const values = form.getValues();
      console.log("All form values:", values);
      onSubmit(values);
    } else {
      console.log("Form validation failed:", form.formState.errors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
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
                                onChange={(e) =>
                                  field.onChange(+e.target.value)
                                }
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
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
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
                                  onChange={(e) =>
                                    field.onChange(+e.target.value)
                                  }
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
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
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
                                {formatPrice(
                                  form.getValues("pricing.salePrice") ?? 0
                                )}
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
                                {formatPrice(
                                  form.getValues("pricing.rentalPricePerDay") ??
                                    0
                                )}
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
                      onClick={handleManualSubmit}
                      disabled={isSubmitting}
                      className="bg-teal hover:bg-teal text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Product"
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
