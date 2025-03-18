"use client";

import { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "@/state/features/productApi";
import type { PriceDetails, Product, Review } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TrendingCard from "@/components/productCards/trendingCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Star,
  TrendingUp,
  PercentIcon,
  Loader2,
  ShoppingCart,
  Search,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProductProps {
  product: Product & {
    priceDetails: PriceDetails;
    reviews: Review[];
  };
}

export default function FilterPage() {
  const formatProductData = (products: any) =>
    products?.map((product: any) => ({
      ...product,
      priceDetails: product.priceDetails || {},
      videoUploaded: product.videoUploaded || {},
      reviews: product.reviews || [],
    })) || [];

  const { data, isLoading } = useGetAllProductsQuery({});
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedGameTypes, setSelectedGameTypes] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(
    []
  );
  const [selectedAgeRestrictions, setSelectedAgeRestrictions] = useState<
    string[]
  >([]);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showTopRated, setShowTopRated] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  // Define price ranges
  const priceRanges = [
    { id: "price-0-50", label: "Under $50", min: 0, max: 50 },
    { id: "price-50-100", label: "$50 - $100", min: 50, max: 100 },
    { id: "price-100-200", label: "$100 - $200", min: 100, max: 200 },
    {
      id: "price-200-plus",
      label: "$200+",
      min: 200,
      max: Number.POSITIVE_INFINITY,
    },
  ];

  // Define game types
  const predefinedGameTypes = [
    "Digital Game",
    "Table Top Game",
    "Physical Games",
  ];

  // Define age restrictions
  const predefinedAgeRestrictions = ["13+", "15+", "18+", "All"];

  // Define sort options
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  useEffect(() => {
    if (data?.products) {
      const formattedProducts = formatProductData(data.products);
      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    }
  }, [data]);

  useEffect(() => {
    if (products.length > 0) {
      setIsFiltering(true);

      // Use setTimeout to show the filtering state for at least a short moment
      const timeoutId = setTimeout(() => {
        applyFilters();
        setIsFiltering(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [
    selectedPriceRanges,
    selectedGameTypes,
    selectedProductTypes,
    selectedAgeRestrictions,
    showDiscounted,
    showTopRated,
    showTrending,
    sortOption,
    products,
  ]);

  // Helper function to calculate the actual price after discount
  const calculateDiscountedPrice = (
    rawPrice: number,
    discountPercentage: number
  ) => {
    if (!discountPercentage) return rawPrice;
    return rawPrice - rawPrice * (discountPercentage / 100);
  };

  // Update the applyFilters function to handle different price fields based on product type
  // and apply discount percentages
  const applyFilters = () => {
    if (!products.length) return;

    let result = [...products];

    // Apply price range filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((product) => {
        // Determine which raw price to use based on product type
        let rawPrice = 0;
        if (product.productType === "RENT") {
          rawPrice = product.priceDetails?.rentalPricePerDay || 0;
        } else if (product.productType === "SALE") {
          rawPrice = product.priceDetails?.salePrice || 0;
        } else if (product.productType === "BOTH") {
          rawPrice = product.priceDetails?.salePrice || 0;
        }

        // Apply discount to get the actual price
        const discountPercentage = product.discountPercentage || 0;
        const actualPrice = calculateDiscountedPrice(
          rawPrice,
          discountPercentage
        );

        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          return range && actualPrice >= range.min && actualPrice <= range.max;
        });
      });
    }

    // Apply game type filter
    if (selectedGameTypes.length > 0) {
      result = result.filter(
        (product) =>
          product.gameType && selectedGameTypes.includes(product.gameType)
      );
    }

    // Apply product type filter
    if (selectedProductTypes.length > 0) {
      result = result.filter(
        (product) =>
          product.productType &&
          selectedProductTypes.includes(product.productType)
      );
    }

    // Apply age restriction filter
    if (selectedAgeRestrictions.length > 0) {
      result = result.filter(
        (product) =>
          product.ageRestriction &&
          selectedAgeRestrictions.includes(product.ageRestriction)
      );
    }

    // Apply discount filter
    if (showDiscounted) {
      result = result.filter(
        (product) => (product.discountPercentage || 0) > 0
      );
      // Sort by discount percentage (highest first)
      result.sort(
        (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
      );
    }

    // Apply top rated filter
    if (showTopRated) {
      // Sort by number of reviews (most first)
      result.sort(
        (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
      );
    }

    // Apply trending filter
    if (showTrending) {
      // Sort by views (most first)
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    // Apply sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => {
        const aPrice = a.priceDetails?.salePrice || 0;
        const bPrice = b.priceDetails?.salePrice || 0;
        return aPrice - bPrice;
      });
    } else if (sortOption === "price-high") {
      result.sort((a, b) => {
        const aPrice = a.priceDetails?.salePrice || 0;
        const bPrice = b.priceDetails?.salePrice || 0;
        return bPrice - aPrice;
      });
    } else if (sortOption === "popular") {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    // "newest" is default, no additional sorting needed

    setFilteredProducts(result);
  };

  const resetFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedGameTypes([]);
    setSelectedProductTypes([]);
    setSelectedAgeRestrictions([]);
    setShowDiscounted(false);
    setShowTopRated(false);
    setShowTrending(false);
    setSortOption("newest");
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const toggleGameType = (type: string) => {
    setSelectedGameTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleProductType = (type: string) => {
    setSelectedProductTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAgeRestriction = (restriction: string) => {
    setSelectedAgeRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  // Check if any filters are applied
  const hasActiveFilters =
    selectedPriceRanges.length > 0 ||
    selectedGameTypes.length > 0 ||
    selectedProductTypes.length > 0 ||
    selectedAgeRestrictions.length > 0 ||
    showDiscounted ||
    showTopRated ||
    showTrending;

  // Filter component for both desktop and mobile
  const FilterComponent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className={!hasActiveFilters ? "opacity-50 cursor-not-allowed" : ""}
        >
          Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["price", "game-type", "product-type", "age", "special"]}
        className="space-y-3"
        disabled={isLoading || isFiltering}
      >
        {/* Price Range Filter */}
        <AccordionItem
          value="price"
          className="border rounded-md px-2 bg-card/50"
        >
          <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={range.id}
                    checked={selectedPriceRanges.includes(range.id)}
                    onCheckedChange={() => togglePriceRange(range.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={range.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Note: Price ranges reflect discounted prices when applicable
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Game Type Filter */}
        <AccordionItem
          value="game-type"
          className="border rounded-md px-2 bg-card/50"
        >
          <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
            Game Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {predefinedGameTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`game-${type}`}
                    checked={selectedGameTypes.includes(type)}
                    onCheckedChange={() => toggleGameType(type)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`game-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Product Type Filter */}
        <AccordionItem
          value="product-type"
          className="border rounded-md px-2 bg-card/50"
        >
          <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
            Product Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {["RENT", "SALE", "BOTH"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${type}`}
                    checked={selectedProductTypes.includes(type)}
                    onCheckedChange={() => toggleProductType(type)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`product-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Age Restriction Filter */}
        <AccordionItem
          value="age"
          className="border rounded-md px-2 bg-card/50"
        >
          <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
            Age Restriction
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {predefinedAgeRestrictions.map((restriction) => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${restriction}`}
                    checked={selectedAgeRestrictions.includes(restriction)}
                    onCheckedChange={() => toggleAgeRestriction(restriction)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`age-${restriction}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {restriction}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Special Filters */}
        <AccordionItem
          value="special"
          className="border rounded-md px-2 bg-card/50"
        >
          <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
            Special Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="discounted"
                  checked={showDiscounted}
                  onCheckedChange={() => setShowDiscounted(!showDiscounted)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="flex items-center gap-1.5">
                  <PercentIcon className="h-4 w-4 text-red-400" />
                  <label
                    htmlFor="discounted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Highest Discounts
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="top-rated"
                  checked={showTopRated}
                  onCheckedChange={() => setShowTopRated(!showTopRated)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <label
                    htmlFor="top-rated"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Top Rated
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={showTrending}
                  onCheckedChange={() => setShowTrending(!showTrending)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <label
                    htmlFor="trending"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trending
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPriceRanges.map((rangeId) => {
              const range = priceRanges.find((r) => r.id === rangeId);
              return range ? (
                <Badge
                  key={rangeId}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/20 text-primary-foreground"
                >
                  {range.label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => togglePriceRange(rangeId)}
                  />
                </Badge>
              ) : null;
            })}

            {selectedGameTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1 bg-primary/20 text-primary-foreground"
              >
                {type}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleGameType(type)}
                />
              </Badge>
            ))}

            {selectedProductTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1 bg-primary/20 text-primary-foreground"
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleProductType(type)}
                />
              </Badge>
            ))}

            {selectedAgeRestrictions.map((restriction) => {
              return (
                <Badge
                  key={restriction}
                  variant="secondary"
                  className="flex items-center gap-1 bg-primary/20 text-primary-foreground"
                >
                  {restriction}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => toggleAgeRestriction(restriction)}
                  />
                </Badge>
              );
            })}

            {showDiscounted && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-red-500/20 text-red-400"
              >
                <PercentIcon className="h-3 w-3 mr-1" />
                Discounted
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setShowDiscounted(false)}
                />
              </Badge>
            )}

            {showTopRated && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400"
              >
                <Star className="h-3 w-3 mr-1" />
                Top Rated
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setShowTopRated(false)}
                />
              </Badge>
            )}

            {showTrending && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-blue-500/20 text-blue-400"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setShowTrending(false)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Container>
      <div className="min-h-screen mt-20 text-primary bg-background rounded-lg p-4 md:p-6 w-full dark">
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Products</h1>

            {/* Mobile Filter Button - Sheet Component */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden flex items-center gap-2"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <SheetHeader className="mb-4">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>
                <FilterComponent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results count and sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/30 p-4 rounded-lg border border-border">
            <div className="flex items-center">
              {isFiltering ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
              )}
              <p className="text-sm">
                Showing{" "}
                <span className="font-medium text-primary">
                  {filteredProducts.length}
                </span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                products
              </p>
            </div>
            <div className="flex w-full sm:w-auto">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-center gap-6">
          {/* Desktop Filter sidebar */}
          <div className="hidden md:block w-full md:w-1/4 lg:w-1/5 bg-card rounded-lg p-4 border border-border h-fit md:sticky md:top-24">
            <FilterComponent />
          </div>

          {/* Main content */}
          <div className="w-full ">
            {/* Products grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border border-border bg-card/50"
                  >
                    <Skeleton className="h-48 rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isFiltering ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border border-border bg-card/50"
                  >
                    <Skeleton className="h-48 rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your current filter
                  criteria. Try adjusting your filters or browse our full
                  collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={resetFilters}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" /> Clear All Filters
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Search className="h-4 w-4" /> Browse All Products
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
                {filteredProducts.map((product) => (
                  <TrendingCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
