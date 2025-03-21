"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/state/features/productApi";
import { formatPrice } from "@/utils/helper";
import { toast } from "@/hooks/use-toast";
interface Product {
  id: string;
  productName: string;
  productDescription: string;
  productType: string;
  status: string;
  priceDetails?: {
    salePrice?: number;
    rentalPricePerDay?: number;
  };
  videoUploaded?: object;
  reviews?: object[];
  uploadedCoverImage?: string;
  availableForSale?: number;
  availableForRent?: number;
  views?: number;
  salesCount?: number;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const pathName = usePathname();
  const currentPath = pathName.split("/").slice(0, 2).join("/");
  const { data } = useGetAllProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();

  const formatProductData = (products: Product[] | undefined) =>
    products?.map((product: Product) => ({
      ...product,
      priceDetails: product.priceDetails || {},
      videoUploaded: product.videoUploaded || {},
      reviews: product.reviews || [],
    })) || [];
  const allProducts = formatProductData(data?.products);
  console.log("all products...", allProducts);
  // Filter products based on search term and filters
  const filteredProducts = (allProducts ?? []).filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "ALL" || product.productType === filterType;
    const matchesStatus =
      filterStatus === "ALL" || product.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);
  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id).unwrap();
    toast({
      title: "Product Deleted",
      description: "Your product has been successfully Deleted!",
      style: {
        backgroundColor: "red",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
      },
    });
  };
  // Handle page changes
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-400">
            Products Management
          </h1>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => router.push(`${currentPath}/dashboard/createpost`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        <Card className="mb-6 bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-400">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 bg-gray-800 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="RENT">Rent Only</SelectItem>
                    <SelectItem value="SALE">Sale Only</SelectItem>
                    <SelectItem value="BOTH">Rent & Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 w-full overflow-x-auto">
          <CardContent className="p-0">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow className="border-gray-700 hover:bg-gray-800">
                    <TableHead className="w-[80px] text-gray-400">
                      Image
                    </TableHead>
                    <TableHead className="w-[250px] text-gray-400">
                      <div className="flex items-center">
                        Product
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-gray-400">
                      Type
                    </TableHead>
                    <TableHead className="w-[120px] text-gray-400">
                      Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[150px] text-gray-400">
                      Price
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[150px] text-gray-400">
                      Inventory
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[100px] text-gray-400">
                      <div className="flex items-center">
                        Views
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[100px] text-gray-400">
                      Sales
                    </TableHead>
                    <TableHead className="w-[100px] text-right text-gray-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableCell
                        colSpan={9}
                        className="text-center py-16 text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-gray-500 mb-2" />
                          <p>No products found. Try adjusting your filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={
                                product.uploadedCoverImage || "/placeholder.svg"
                              }
                              alt={product.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="font-medium text-white">
                            {product.productName}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[230px]">
                            {product.productDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.productType === "BOTH"
                                ? "default"
                                : product.productType === "RENT"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {product.productType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "AVAILABLE"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-300">
                          {product?.priceDetails?.salePrice !== undefined && (
                            <div>
                              Sale:{" "}
                              {formatPrice(product.priceDetails.salePrice)}
                            </div>
                          )}
                          {product?.priceDetails?.rentalPricePerDay !==
                            undefined && (
                            <div>
                              Rent:{" "}
                              {formatPrice(
                                product.priceDetails.rentalPricePerDay
                              )}
                              /day
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-gray-300">
                          <div>Sale: {product.availableForSale}</div>
                          <div>Rent: {product.availableForRent}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-300">
                          {product.views}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-300">
                          {product.salesCount}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-gray-800 border-gray-700 text-white"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="hover:bg-gray-700 focus:bg-gray-700"
                                onClick={() =>
                                  router.push(
                                    `${currentPath}/product/${product.id}`
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4 text-green-400" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-gray-700 focus:bg-gray-700"
                                onClick={() =>
                                  router.push(
                                    `${currentPath}/dashboard/update/${product.id}`
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4 text-green-400" />
                                Edit product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                className="text-red-400 hover:bg-gray-700 focus:bg-gray-700"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between py-4 px-4 bg-gray-900 border-t border-gray-800">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-sm text-gray-400 mr-4">
                  Showing {startIndex + 1}-{endIndex} of {totalItems} products
                </span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">
                    {itemsPerPage}
                  </span>
                  <span className="text-sm text-gray-400 mr-2">per page</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="h-8 w-[70px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
