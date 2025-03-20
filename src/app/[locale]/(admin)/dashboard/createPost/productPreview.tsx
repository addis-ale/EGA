import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Tag, Info, Video, Github } from "lucide-react";
import Image from "next/image";

interface ProductPreviewProps {
  formData: {
    productName?: string;
    productDescription?: string;
    uploadedCoverImage?: string;
    discountPercentage?: number;
    ageRestriction?: string;
    gameType?: string;
    productType?: "SALE" | "RENT" | "BOTH";
    availableForSale?: number;
    availableForRent?: number;
    pricing?: {
      salePrice?: number;
      rentalPricePerDay?: number;
      minimumRentalPeriod?: number;
      maximumRentalPeriod?: number;
    };
    uploadedVideo?: {
      setUp?: string;
      actionCard?: string;
      gamePlay?: string;
    };
  };
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ formData }) => {
  const {
    productName = "",
    productDescription = "",
    uploadedCoverImage = "",
    discountPercentage = 0,
    ageRestriction = "",
    gameType = "",
    productType = "",
    availableForSale = 0,
    availableForRent = 0,
    pricing = {
      salePrice: 0,
      rentalPricePerDay: 0,
      minimumRentalPeriod: 0,
      maximumRentalPeriod: 0,
    },
    uploadedVideo = {
      setUp: "",
      actionCard: "",
      gamePlay: "",
    },
  } = formData || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";

    // Handle different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Check if a URL is a YouTube URL
  const isYouTubeUrl = (url: string) => {
    return (url && url.includes("youtube.com")) || url.includes("youtu.be");
  };

  // GitHub repository URL (replace with actual repo URL)
  const githubRepoUrl = "https://github.com/yourusername/game-marketplace";

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Preview</h1>
        <a
          href={githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            <span>View on GitHub</span>
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Image */}
        <div className="md:col-span-1">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full">
            <div className="relative aspect-square w-full">
              <Image
                fill
                src={
                  uploadedCoverImage || "/placeholder.svg?height=400&width=400"
                }
                alt={productName}
                className="object-cover w-full h-full"
              />
              {discountPercentage > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-teal-500 text-white font-bold">
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-gray-800/80 border-gray-600 text-white"
                  >
                    {gameType}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-800/80 border-gray-600 text-white"
                  >
                    {ageRestriction}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="md:col-span-2">
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {productName}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Tag className="h-4 w-4" />
                    <span>
                      {productType === "BOTH"
                        ? "Available for Sale & Rent"
                        : productType === "SALE"
                        ? "Available for Sale Only"
                        : "Available for Rent Only"}
                    </span>
                  </div>
                </div>
                {(productType === "SALE" || productType === "BOTH") && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-400">
                      {formatCurrency(pricing.salePrice ?? 0)}
                    </div>
                    {discountPercentage > 0 && (
                      <div className="text-sm text-gray-400 line-through">
                        {formatCurrency(
                          (pricing.salePrice ?? 0) /
                            (1 - discountPercentage / 100)
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Description
                </h3>
                <p className="text-gray-300">{productDescription}</p>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-gray-900 text-gray-400 w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-3 rounded-md">
                      <div className="text-sm text-gray-400">Game Type</div>
                      <div className="font-medium">{gameType}</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-md">
                      <div className="text-sm text-gray-400">
                        Age Restriction
                      </div>
                      <div className="font-medium">{ageRestriction}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="availability" className="pt-4 space-y-4">
                  {(productType === "SALE" || productType === "BOTH") && (
                    <div className="bg-gray-900 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2 text-teal-400">
                        <DollarSign className="h-5 w-5" />
                        <h3 className="font-medium">Sale Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="font-medium">
                            {formatCurrency(pricing.salePrice ?? 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Available Units
                          </div>
                          <div className="font-medium">{availableForSale}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(productType === "RENT" || productType === "BOTH") && (
                    <div className="bg-gray-900 p-4 rounded-md">
                      <div className="flex items-center gap-2 mb-2 text-teal-400">
                        <Calendar className="h-5 w-5" />
                        <h3 className="font-medium">Rental Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">
                            Price Per Day
                          </div>
                          <div className="font-medium">
                            {formatCurrency(pricing.rentalPricePerDay ?? 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Available Units
                          </div>
                          <div className="font-medium">{availableForRent}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Rental Period
                          </div>
                          <div className="font-medium">
                            {pricing.minimumRentalPeriod} -{" "}
                            {pricing.maximumRentalPeriod} days
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="videos" className="pt-4">
                  {!uploadedVideo.setUp &&
                  !uploadedVideo.actionCard &&
                  !uploadedVideo.gamePlay ? (
                    <div className="text-center py-6 text-gray-400">
                      <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No videos available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Tabs
                        defaultValue={
                          uploadedVideo.setUp
                            ? "setup"
                            : uploadedVideo.actionCard
                            ? "action"
                            : "gameplay"
                        }
                        className="w-full"
                      >
                        <TabsList className="bg-gray-900/50 text-gray-400 w-full grid grid-cols-3">
                          <TabsTrigger
                            value="setup"
                            disabled={!uploadedVideo.setUp}
                          >
                            Setup
                          </TabsTrigger>
                          <TabsTrigger
                            value="action"
                            disabled={!uploadedVideo.actionCard}
                          >
                            Action Card
                          </TabsTrigger>
                          <TabsTrigger
                            value="gameplay"
                            disabled={!uploadedVideo.gamePlay}
                          >
                            How to Play
                          </TabsTrigger>
                        </TabsList>

                        {uploadedVideo.setUp && (
                          <TabsContent value="setup" className="pt-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-teal-400">
                                Setup Instructions
                              </h4>
                              <p className="text-sm text-gray-300 mb-2">
                                Learn how to set up the game before playing.
                              </p>
                              <div className="aspect-video bg-black rounded-md overflow-hidden">
                                {isYouTubeUrl(uploadedVideo.setUp) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(
                                      uploadedVideo.setUp
                                    )}
                                    title="Setup Video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  <video
                                    src={uploadedVideo.setUp}
                                    controls
                                    className="w-full h-full"
                                  />
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        )}

                        {uploadedVideo.actionCard && (
                          <TabsContent value="action" className="pt-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-teal-400">
                                Action Card Guide
                              </h4>
                              <p className="text-sm text-gray-300 mb-2">
                                Understand how action cards work in the game.
                              </p>
                              <div className="aspect-video bg-black rounded-md overflow-hidden">
                                {isYouTubeUrl(uploadedVideo.actionCard) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(
                                      uploadedVideo.actionCard
                                    )}
                                    title="Action Card Video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  <video
                                    src={uploadedVideo.actionCard}
                                    controls
                                    className="w-full h-full"
                                  />
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        )}

                        {uploadedVideo.gamePlay && (
                          <TabsContent value="gameplay" className="pt-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-teal-400">
                                How to Play
                              </h4>
                              <p className="text-sm text-gray-300 mb-2">
                                Watch a complete gameplay demonstration.
                              </p>
                              <div className="aspect-video bg-black rounded-md overflow-hidden">
                                {isYouTubeUrl(uploadedVideo.gamePlay) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(
                                      uploadedVideo.gamePlay
                                    )}
                                    title="Gameplay Video"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  <video
                                    src={uploadedVideo.gamePlay}
                                    controls
                                    className="w-full h-full"
                                  />
                                )}
                              </div>
                            </div>
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
