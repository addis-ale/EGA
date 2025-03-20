"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  DollarSignIcon,
  InfoIcon,
  LayersIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types based on the provided schema
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface Product {
  id: string;
  productName: string;
  productDescription: string;
  uploadedCoverImage: string;
  discountPercentage: number;
  ageRestriction: string;
  gameType: string;
  availableForSale: number;
  availableForRent: number;
  views: number;
  salesCount: number;
  productType: "SALE" | "RENT" | "BOTH";
  status: "AVAILABLE" | "RENTED_OUT" | "OUT_OF_STOCK";
  priceDetails?: {
    salePrice?: number;
    rentalPricePerDay?: number;
  };
  createdAt: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  totalPrice: number;
  paymentMethod: "Telebirr" | "Pay at Pickup";
  status: "Pending" | "Paid" | "Cancelled";
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
}

interface Rental {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rentalStart: string;
  rentalEnd: string;
  status: "Active" | "Returned" | "Overdue";
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
}

interface MonthlyData {
  month: string;
  value: number;
  label: string;
}

interface DashboardData {
  users: {
    total: number;
    admins: number;
    regularUsers: number;
    growth: number;
    recentUsers: User[];
  };
  products: {
    total: number;
    forSale: number;
    forRent: number;
    forBoth: number;
    available: number;
    rentedOut: number;
    outOfStock: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    paid: number;
    cancelled: number;
    growth: number;
    recentOrders: Order[];
  };
  rentals: {
    total: number;
    active: number;
    returned: number;
    overdue: number;
    growth: number;
    pendingReturns: Rental[];
  };
  revenue: {
    total: number;
    fromSales: number;
    fromRentals: number;
    growth: number;
    monthly: MonthlyData[];
  };
  topProducts: {
    id: string;
    productName: string;
    uploadedCoverImage: string;
    salesCount: number;
    rentalCount: number;
    revenue: number;
    views: number;
    trend: number;
  }[];
}

// Mock API function to simulate fetching data from backend
const fetchDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        users: {
          total: 8742,
          admins: 12,
          regularUsers: 8730,
          growth: 7.8,
          recentUsers: [
            {
              id: "user1",
              name: "Abebe Kebede",
              email: "abebe@example.com",
              image: "/placeholder.svg?height=40&width=40",
              role: "USER",
              createdAt: "2025-03-18T14:30:00Z",
            },
            {
              id: "user2",
              name: "Tigist Haile",
              email: "tigist@example.com",
              image: "/placeholder.svg?height=40&width=40",
              role: "USER",
              createdAt: "2025-03-18T12:15:00Z",
            },
            {
              id: "user3",
              name: "Dawit Mekonnen",
              email: "dawit@example.com",
              image: "/placeholder.svg?height=40&width=40",
              role: "ADMIN",
              createdAt: "2025-03-17T10:45:00Z",
            },
          ],
        },
        products: {
          total: 432,
          forSale: 287,
          forRent: 65,
          forBoth: 80,
          available: 356,
          rentedOut: 42,
          outOfStock: 34,
          growth: 5.2,
        },
        orders: {
          total: 3254,
          pending: 124,
          paid: 2987,
          cancelled: 143,
          growth: 12.5,
          recentOrders: [
            {
              id: "ord1",
              userId: "user1",
              userName: "Abebe Kebede",
              totalPrice: 1299.99,
              paymentMethod: "Telebirr",
              status: "Paid",
              items: [
                {
                  productId: "prod1",
                  productName: "FIFA 25",
                  quantity: 1,
                  price: 1299.99,
                },
              ],
              createdAt: "2025-03-19T14:30:00Z",
            },
            {
              id: "ord2",
              userId: "user2",
              userName: "Tigist Haile",
              totalPrice: 2499.99,
              paymentMethod: "Pay at Pickup",
              status: "Pending",
              items: [
                {
                  productId: "prod2",
                  productName: "Call of Duty: Modern Warfare 4",
                  quantity: 1,
                  price: 2499.99,
                },
              ],
              createdAt: "2025-03-19T12:15:00Z",
            },
            {
              id: "ord3",
              userId: "user4",
              userName: "Solomon Tadesse",
              totalPrice: 3599.98,
              paymentMethod: "Telebirr",
              status: "Paid",
              items: [
                {
                  productId: "prod3",
                  productName: "Assassin's Creed: Ethiopia",
                  quantity: 1,
                  price: 1999.99,
                },
                {
                  productId: "prod4",
                  productName: "NBA 2K25",
                  quantity: 1,
                  price: 1599.99,
                },
              ],
              createdAt: "2025-03-19T10:45:00Z",
            },
            {
              id: "ord4",
              userId: "user5",
              userName: "Hanna Girma",
              totalPrice: 1799.99,
              paymentMethod: "Pay at Pickup",
              status: "Cancelled",
              items: [
                {
                  productId: "prod5",
                  productName: "Grand Theft Auto VI",
                  quantity: 1,
                  price: 1799.99,
                },
              ],
              createdAt: "2025-03-18T16:50:00Z",
            },
          ],
        },
        rentals: {
          total: 876,
          active: 124,
          returned: 698,
          overdue: 54,
          growth: 18.3,
          pendingReturns: [
            {
              id: "rent1",
              userId: "user6",
              userName: "Kidus Alemu",
              productId: "prod6",
              productName: "Madden NFL 25",
              rentalStart: "2025-03-15",
              rentalEnd: "2025-03-22",
              status: "Active",
            },
            {
              id: "rent2",
              userId: "user7",
              userName: "Meron Tesfaye",
              productId: "prod7",
              productName: "Spider-Man 2",
              rentalStart: "2025-03-13",
              rentalEnd: "2025-03-20",
              status: "Overdue",
            },
            {
              id: "rent3",
              userId: "user8",
              userName: "Yonas Bekele",
              productId: "prod8",
              productName: "Final Fantasy XVI",
              rentalStart: "2025-03-18",
              rentalEnd: "2025-03-25",
              status: "Active",
            },
            {
              id: "rent4",
              userId: "user9",
              userName: "Sara Hailu",
              productId: "prod9",
              productName: "Resident Evil 4",
              rentalStart: "2025-03-14",
              rentalEnd: "2025-03-21",
              status: "Active",
            },
            {
              id: "rent5",
              userId: "user10",
              userName: "Bereket Tadesse",
              productId: "prod10",
              productName: "Baldur's Gate 3",
              rentalStart: "2025-03-12",
              rentalEnd: "2025-03-19",
              status: "Overdue",
            },
          ],
        },
        revenue: {
          total: 4567890,
          fromSales: 3987650,
          fromRentals: 580240,
          growth: 15.7,
          monthly: [
            { month: "Jan", value: 65, label: "January: ETB 495,000" },
            { month: "Feb", value: 45, label: "February: ETB 342,000" },
            { month: "Mar", value: 75, label: "March: ETB 570,000" },
            { month: "Apr", value: 60, label: "April: ETB 456,000" },
            { month: "May", value: 80, label: "May: ETB 608,000" },
            { month: "Jun", value: 95, label: "June: ETB 722,000" },
          ],
        },
        topProducts: [
          {
            id: "prod1",
            productName: "FIFA 25",
            uploadedCoverImage: "/placeholder.svg?height=40&width=40",
            salesCount: 245,
            rentalCount: 78,
            revenue: 387500,
            views: 12450,
            trend: 24,
          },
          {
            id: "prod2",
            productName: "Call of Duty: Modern Warfare 4",
            uploadedCoverImage: "/placeholder.svg?height=40&width=40",
            salesCount: 187,
            rentalCount: 42,
            revenue: 512300,
            views: 9870,
            trend: 12,
          },
          {
            id: "prod3",
            productName: "Assassin's Creed: Ethiopia",
            uploadedCoverImage: "/placeholder.svg?height=40&width=40",
            salesCount: 176,
            rentalCount: 65,
            revenue: 421800,
            views: 8760,
            trend: 18,
          },
          {
            id: "prod4",
            productName: "NBA 2K25",
            uploadedCoverImage: "/placeholder.svg?height=40&width=40",
            salesCount: 165,
            rentalCount: 54,
            revenue: 345600,
            views: 7650,
            trend: 15,
          },
          {
            id: "prod5",
            productName: "Grand Theft Auto VI",
            uploadedCoverImage: "/placeholder.svg?height=40&width=40",
            salesCount: 154,
            rentalCount: 32,
            revenue: 329400,
            views: 6540,
            trend: 5,
          },
        ],
      });
    }, 1000);
  });
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
    case "Returned":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      );
    case "Pending":
    case "Active":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          {status}
        </Badge>
      );
    case "Cancelled":
      return <Badge variant="destructive">{status}</Badge>;
    case "Overdue":
      return <Badge className="bg-red-500">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Interactive Bar Chart Component
const InteractiveBarChart = ({ data }: { data: MonthlyData[] }) => {
  // Calculate the maximum value for proper scaling
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <TooltipProvider>
      <div className="grid grid-cols-6 gap-2 h-32 md:h-40 lg:h-48  p-4 rounded-lg border">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col h-full">
            <div className="flex-grow relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-0 w-full group cursor-pointer">
                    <div
                      className="w-full bg-green-400 rounded-t-md transition-all duration-200 group-hover:brightness-110"
                      style={{
                        height: `${Math.max(
                          5,
                          (item.value / maxValue) * 100
                        )}%`,
                        minHeight: "4px",
                      }}
                    >
                      <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-30 transition-opacity rounded-t-md"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black border-green-500 text-white font-medium"
                >
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-green-400 font-bold">
                      {item.value}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-xs text-center mt-2 text-gray-600 font-medium">
              {item.month}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-black text-white">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64 bg-gray-800" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 bg-gray-800" />
            <Skeleton className="h-9 w-36 bg-gray-800" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-24 mt-4 bg-gray-800" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-gray-900 border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-64 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-gray-800" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3 bg-gray-900 border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2 bg-gray-800" />
              <Skeleton className="h-4 w-56 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full bg-gray-800" />
                <Skeleton className="h-24 w-full bg-gray-800" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-gray-400 mb-4">
            There is no dashboard data to display at this time.
          </p>
        </div>
      </div>
    );
  }

  // Calculate revenue percentages
  const salesPercentage = (data.revenue.fromSales / data.revenue.total) * 100;
  const rentalsPercentage =
    (data.revenue.fromRentals / data.revenue.total) * 100;

  return (
    <div className="space-y-6 p-6 bg-black text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-500">
          Dashboard Overview
        </h1>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Total Users
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.users.total.toLocaleString()}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Admins: {data.users.admins.toLocaleString()}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Regular Users: {data.users.regularUsers.toLocaleString()}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-white">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{data.users.growth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Total Products
            </CardTitle>
            <LayersIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.products.total.toLocaleString()}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                For Sale: {data.products.forSale.toLocaleString()}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                For Rent: {data.products.forRent.toLocaleString()}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                For Both: {data.products.forBoth.toLocaleString()}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-white">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{data.products.growth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Total Orders
            </CardTitle>
            <ShoppingCartIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.orders.total.toLocaleString()}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Pending: {data.orders.pending.toLocaleString()}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Paid: {data.orders.paid.toLocaleString()}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Cancelled: {data.orders.cancelled.toLocaleString()}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-white">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{data.orders.growth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Total Revenue
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(data.revenue.total)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Sales: {formatCurrency(data.revenue.fromSales)}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                Rentals: {formatCurrency(data.revenue.fromRentals)}
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-white">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{data.revenue.growth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-Selling Products and Revenue Breakdown */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-green-500">
              Top-Selling Products
            </CardTitle>
            <CardDescription className="text-white">
              The most popular games by sales and rentals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-green-500">Game</TableHead>
                    <TableHead className="text-green-500">Sales</TableHead>
                    <TableHead className="text-green-500">Rentals</TableHead>
                    <TableHead className="text-green-500">Revenue</TableHead>
                    <TableHead className="text-green-500">Views</TableHead>
                    <TableHead className="text-green-500">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topProducts.map((product) => (
                    <TableRow key={product.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-gray-800 border border-gray-700">
                            <AvatarImage
                              src={product.uploadedCoverImage}
                              alt={product.productName}
                            />
                            <AvatarFallback className="bg-green-900 text-green-100">
                              {product.productName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{product.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {product.salesCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {product.rentalCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {formatCurrency(product.revenue)}
                      </TableCell>
                      <TableCell className="text-white">
                        {product.views.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.trend > 10
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-amber-500"
                          }
                        >
                          +{product.trend}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
            >
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-3 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-green-500">Revenue Breakdown</CardTitle>
            <CardDescription className="text-white">
              Sales vs Rentals revenue distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span>Sales Revenue</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(data.revenue.fromSales)} (
                    {salesPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                    style={{ width: `${salesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-emerald-400"></div>
                    <span>Rental Revenue</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(data.revenue.fromRentals)} (
                    {rentalsPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
                    style={{ width: `${rentalsPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-green-500">
                    Monthly Revenue Trend
                  </h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-white"
                        >
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black border-green-500 text-white">
                        Hover over bars to see detailed revenue
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <InteractiveBarChart data={data.revenue.monthly} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Pending Returns */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-green-500">Recent Orders</CardTitle>
            <CardDescription className="text-white">
              Latest orders across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-green-500">Order ID</TableHead>
                    <TableHead className="text-green-500">Customer</TableHead>
                    <TableHead className="text-green-500">Game</TableHead>
                    <TableHead className="text-green-500">Amount</TableHead>
                    <TableHead className="text-green-500">Payment</TableHead>
                    <TableHead className="text-green-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.recentOrders.map((order) => (
                    <TableRow key={order.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        #{order.id}
                      </TableCell>
                      <TableCell className="text-white">
                        {order.userName}
                      </TableCell>
                      <TableCell className="text-white">
                        {order.items.length > 1
                          ? `${order.items[0].productName} +${
                              order.items.length - 1
                            }`
                          : order.items[0].productName}
                      </TableCell>
                      <TableCell className="text-white">
                        {formatCurrency(order.totalPrice)}
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {getStatusBadge(order.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
            >
              View All Orders
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-green-500">Pending Returns</CardTitle>
            <CardDescription className="text-white">
              Games that need to be returned from rentals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-green-500">Rental ID</TableHead>
                    <TableHead className="text-green-500">Customer</TableHead>
                    <TableHead className="text-green-500">Game</TableHead>
                    <TableHead className="text-green-500">Due Date</TableHead>
                    <TableHead className="text-green-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rentals.pendingReturns.map((rental) => (
                    <TableRow key={rental.id} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        #{rental.id}
                      </TableCell>
                      <TableCell className="text-white">
                        {rental.userName}
                      </TableCell>
                      <TableCell className="text-white">
                        {rental.productName}
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(rental.rentalEnd).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {getStatusBadge(rental.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
            >
              View All Returns
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
