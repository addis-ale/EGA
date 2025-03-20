"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Download,
  FilterIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, ClockIcon } from "@radix-ui/react-icons";
import Image from "next/image";

// Add this right after all the imports
const GlobalStyles = () => {
  return (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #374151;
        border-radius: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #4b5563;
      }
    `}</style>
  );
};

// Types
interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userImage?: string;
  totalPrice: number;
  paymentMethod: "Telebirr" | "Pay at Pickup";
  status: "Pending" | "Paid" | "Cancelled" | "Delivered" | "Processing";
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  deliveryAddress?: string;
  phoneNumber?: string;
  notes?: string;
}

// Mock API function to simulate fetching orders
const fetchOrders = (
  page: number,
  limit: number,
  search: string,
  status: string,
  sortBy: string,
  sortOrder: "asc" | "desc"
): Promise<{ orders: Order[]; total: number }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Generate 100 mock orders
      const allOrders: Order[] = Array.from({ length: 100 }, (_, i) => {
        const id = `ORD${(1000 + i).toString()}`;
        const randomStatus = [
          "Pending",
          "Paid",
          "Cancelled",
          "Delivered",
          "Processing",
        ][Math.floor(Math.random() * 5)] as Order["status"];
        const randomPayment = ["Telebirr", "Pay at Pickup"][
          Math.floor(Math.random() * 2)
        ] as Order["paymentMethod"];

        // Random customer names
        const customers = [
          {
            name: "Abebe Kebede",
            email: "abebe@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Tigist Haile",
            email: "tigist@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Dawit Mekonnen",
            email: "dawit@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Solomon Tadesse",
            email: "solomon@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Hanna Girma",
            email: "hanna@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Kidus Alemu",
            email: "kidus@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Meron Tesfaye",
            email: "meron@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            name: "Yonas Bekele",
            email: "yonas@example.com",
            image: "/placeholder.svg?height=40&width=40",
          },
        ];
        const customer =
          customers[Math.floor(Math.random() * customers.length)];

        // Random products
        const products = [
          {
            id: "prod1",
            name: "FIFA 25",
            image: "/placeholder.svg?height=40&width=40",
            price: 1299.99,
          },
          {
            id: "prod2",
            name: "Call of Duty: Modern Warfare 4",
            image: "/placeholder.svg?height=40&width=40",
            price: 2499.99,
          },
          {
            id: "prod3",
            name: "Assassin's Creed: Ethiopia",
            image: "/placeholder.svg?height=40&width=40",
            price: 1999.99,
          },
          {
            id: "prod4",
            name: "NBA 2K25",
            image: "/placeholder.svg?height=40&width=40",
            price: 1599.99,
          },
          {
            id: "prod5",
            name: "Grand Theft Auto VI",
            image: "/placeholder.svg?height=40&width=40",
            price: 1799.99,
          },
          {
            id: "prod6",
            name: "Madden NFL 25",
            image: "/placeholder.svg?height=40&width=40",
            price: 1499.99,
          },
          {
            id: "prod7",
            name: "Spider-Man 2",
            image: "/placeholder.svg?height=40&width=40",
            price: 1899.99,
          },
          {
            id: "prod8",
            name: "Final Fantasy XVI",
            image: "/placeholder.svg?height=40&width=40",
            price: 1699.99,
          },
        ];

        // Generate 1-3 random items per order
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const orderItems: OrderItem[] = Array.from(
          { length: itemCount },
          () => {
            const product =
              products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            return {
              productId: product.id,
              productName: product.name,
              productImage: product.image,
              quantity,
              price: product.price,
            };
          }
        );

        // Calculate total price
        const totalPrice = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Generate random date within the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        return {
          id,
          userId: `user${i}`,
          userName: customer.name,
          userEmail: customer.email,
          userImage: customer.image,
          totalPrice,
          paymentMethod: randomPayment,
          status: randomStatus,
          items: orderItems,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
          deliveryAddress: "Bole, Addis Ababa, Ethiopia",
          phoneNumber: "+251 91 234 5678",
          notes: Math.random() > 0.7 ? "Please deliver after 5 PM" : undefined,
        };
      });

      // Filter by search term
      let filteredOrders = allOrders;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.id.toLowerCase().includes(searchLower) ||
            order.userName.toLowerCase().includes(searchLower) ||
            order.items.some((item) =>
              item.productName.toLowerCase().includes(searchLower)
            )
        );
      }

      // Filter by status
      if (status && status !== "All") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === status
        );
      }

      // Sort orders
      if (sortBy) {
        filteredOrders.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "date":
              comparison =
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();
              break;
            case "amount":
              comparison = a.totalPrice - b.totalPrice;
              break;
            case "status":
              comparison = a.status.localeCompare(b.status);
              break;
            default:
              comparison = a.id.localeCompare(b.id);
          }

          return sortOrder === "desc" ? -comparison : comparison;
        });
      }

      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(
        startIndex,
        startIndex + limit
      );

      resolve({
        orders: paginatedOrders,
        total: filteredOrders.length,
      });
    }, 800);
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

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Helper function to get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      );
    case "Delivered":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "Pending":
    case "Processing":
      return (
        <Badge variant="outline" className="border-green-500 text-green-500">
          {status}
        </Badge>
      );
    case "Cancelled":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersPage() {
  // State for orders data and loading
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for pagination, filtering, and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch orders data
  const loadOrders = async () => {
    try {
      setLoading(true);
      const { orders: fetchedOrders, total } = await fetchOrders(
        currentPage,
        itemsPerPage,
        searchTerm,
        statusFilter,
        sortBy,
        sortOrder
      );
      setOrders(fetchedOrders);
      setTotalOrders(total);
      setError(null);
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when dependencies change
  useEffect(() => {
    loadOrders();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle row selection
  const toggleRowSelection = (orderId: string) => {
    setSelectedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map((order) => order.id));
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6 p-6 bg-black text-white">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64 bg-gray-800" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 bg-gray-800" />
            <Skeleton className="h-9 w-36 bg-gray-800" />
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 bg-gray-800" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-32 bg-gray-800" />
                <Skeleton className="h-9 w-32 bg-gray-800" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-gray-800" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full bg-gray-800" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            onClick={() => loadOrders()}
            className="bg-green-500 hover:bg-green-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-black text-white">
      <GlobalStyles />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-500">Orders</h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => loadOrders()}
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <form
                onSubmit={handleSearch}
                className="relative w-full sm:w-auto"
              >
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 bg-gray-800 border-gray-700 text-white w-full sm:w-[260px] focus-visible:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full sm:w-[180px] focus:ring-green-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white bg-gray-800"
                    >
                      <FilterIcon className="mr-2 h-4 w-4" />
                      Sort
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      className={sortBy === "date" ? "bg-gray-700" : ""}
                      onClick={() => {
                        setSortBy("date");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      Date
                      {sortBy === "date" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={sortBy === "amount" ? "bg-gray-700" : ""}
                      onClick={() => {
                        setSortBy("amount");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      Amount
                      {sortBy === "amount" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={sortBy === "status" ? "bg-gray-700" : ""}
                      onClick={() => {
                        setSortBy("status");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                    >
                      Status
                      {sortBy === "status" &&
                        (sortOrder === "asc" ? (
                          <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {selectedRows.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => setSelectedRows([])}
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Actions
                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Delivered</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="text-red-500">
                      Cancel Orders
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        selectedRows.length === orders.length &&
                        orders.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                      className="border-gray-600"
                    />
                  </TableHead>
                  <TableHead className="text-green-500">Order ID</TableHead>
                  <TableHead className="text-green-500">Customer</TableHead>
                  <TableHead className="text-green-500">Products</TableHead>
                  <TableHead className="text-green-500">Date</TableHead>
                  <TableHead className="text-green-500">Amount</TableHead>
                  <TableHead className="text-green-500">Payment</TableHead>
                  <TableHead className="text-green-500">Status</TableHead>
                  <TableHead className="text-green-500 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && orders.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-gray-800">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-6 w-full bg-gray-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : orders.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-400"
                    >
                      No orders found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="border-gray-800">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(order.id)}
                          onCheckedChange={() => toggleRowSelection(order.id)}
                          className="border-gray-600"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-gray-800 border border-gray-700">
                            <AvatarImage
                              src={order.userImage}
                              alt={order.userName}
                            />
                            <AvatarFallback className="bg-green-900 text-green-100">
                              {order.userName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-white">
                              {order.userName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {order.userEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white">
                            {order.items[0].productName}
                          </span>
                          {order.items.length > 1 && (
                            <span className="text-xs text-gray-400">
                              +{order.items.length - 1} more items
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-white">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {formatCurrency(order.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                            <DialogHeader className="border-b border-gray-800 pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <DialogTitle className="text-xl text-green-500">
                                    Order #{order.id}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400 mt-1">
                                    Placed on {formatDate(order.createdAt)}
                                  </DialogDescription>
                                </div>
                                <Badge
                                  className="ml-auto"
                                  variant={
                                    order.status === "Paid" ||
                                    order.status === "Delivered"
                                      ? "default"
                                      : order.status === "Cancelled"
                                      ? "destructive"
                                      : "outline"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto py-4 pr-2 custom-scrollbar">
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="bg-gray-800 border-gray-700 w-full grid grid-cols-3 mb-6">
                                  <TabsTrigger
                                    value="details"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                  >
                                    Order Details
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="customer"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                  >
                                    Customer
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="products"
                                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                                  >
                                    Products
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                  value="details"
                                  className="space-y-6 mt-0 focus:outline-none"
                                >
                                  <div className="grid grid-cols-2 gap-6">
                                    <Card className="bg-gray-800/50 border-gray-700">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-green-400">
                                          Payment Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">
                                            Method:
                                          </span>
                                          <span className="text-white font-medium">
                                            {order.paymentMethod}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">
                                            Status:
                                          </span>
                                          <span className="text-white font-medium">
                                            {order.status}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">
                                            Total Amount:
                                          </span>
                                          <span className="text-green-400 font-medium">
                                            {formatCurrency(order.totalPrice)}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-gray-800/50 border-gray-700">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-green-400">
                                          Shipping Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">
                                            Address:
                                          </span>
                                          <span className="text-white font-medium text-right">
                                            {order.deliveryAddress}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">
                                            Phone:
                                          </span>
                                          <span className="text-white font-medium">
                                            {order.phoneNumber}
                                          </span>
                                        </div>
                                        {order.notes && (
                                          <div className="pt-2 border-t border-gray-700">
                                            <span className="text-gray-400 block mb-1">
                                              Notes:
                                            </span>
                                            <span className="text-white">
                                              {order.notes}
                                            </span>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card className="bg-gray-800/50 border-gray-700">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm text-green-400">
                                        Order Timeline
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="relative pl-6 space-y-6">
                                        {/* Vertical line */}
                                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-700"></div>

                                        <div className="relative">
                                          <div className="absolute left-[-24px] top-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                            <CheckIcon className="h-3 w-3 text-white" />
                                          </div>
                                          <div>
                                            <h4 className="text-white font-medium">
                                              Order Placed
                                            </h4>
                                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                              <ClockIcon className="h-3 w-3 mr-1" />
                                              {formatDate(order.createdAt)}
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                              Order was placed by{" "}
                                              {order.userName}
                                            </p>
                                          </div>
                                        </div>

                                        {order.status !== "Pending" && (
                                          <div className="relative">
                                            <div className="absolute left-[-24px] top-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                              <CheckIcon className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                              <h4 className="text-white font-medium">
                                                Payment{" "}
                                                {order.status === "Paid" ||
                                                order.status === "Delivered"
                                                  ? "Completed"
                                                  : "Processing"}
                                              </h4>
                                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                {formatDate(
                                                  order.updatedAt ||
                                                    order.createdAt
                                                )}
                                              </div>
                                              <p className="text-sm text-gray-400 mt-1">
                                                Payment was{" "}
                                                {order.status === "Paid" ||
                                                order.status === "Delivered"
                                                  ? "confirmed"
                                                  : "initiated"}{" "}
                                                via {order.paymentMethod}
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {order.status === "Processing" && (
                                          <div className="relative">
                                            <div className="absolute left-[-24px] top-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                              <CheckIcon className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                              <h4 className="text-white font-medium">
                                                Order Processing
                                              </h4>
                                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                {formatDate(
                                                  order.updatedAt ||
                                                    order.createdAt
                                                )}
                                              </div>
                                              <p className="text-sm text-gray-400 mt-1">
                                                Order is being prepared for
                                                delivery
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {order.status === "Delivered" && (
                                          <div className="relative">
                                            <div className="absolute left-[-24px] top-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                              <CheckIcon className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                              <h4 className="text-white font-medium">
                                                Order Delivered
                                              </h4>
                                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                {formatDate(
                                                  order.updatedAt ||
                                                    order.createdAt
                                                )}
                                              </div>
                                              <p className="text-sm text-gray-400 mt-1">
                                                Order was successfully delivered
                                                to the customer
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        {order.status === "Cancelled" && (
                                          <div className="relative">
                                            <div className="absolute left-[-24px] top-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                                              <XIcon className="h-3 w-3 text-white" />
                                            </div>
                                            <div>
                                              <h4 className="text-white font-medium">
                                                Order Cancelled
                                              </h4>
                                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                {formatDate(
                                                  order.updatedAt ||
                                                    order.createdAt
                                                )}
                                              </div>
                                              <p className="text-sm text-gray-400 mt-1">
                                                Order was cancelled
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent
                                  value="customer"
                                  className="space-y-6 mt-0 focus:outline-none"
                                >
                                  <Card className="bg-gray-800/50 border-gray-700">
                                    <CardContent className="pt-6">
                                      <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="h-16 w-16 bg-gray-700 border border-gray-600">
                                          <AvatarImage
                                            src={order.userImage}
                                            alt={order.userName}
                                          />
                                          <AvatarFallback className="bg-green-900 text-green-100 text-xl">
                                            {order.userName.substring(0, 2)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="text-xl font-medium text-white">
                                            {order.userName}
                                          </h3>
                                          <p className="text-gray-400">
                                            {order.userEmail}
                                          </p>
                                          <div className="flex items-center gap-3 mt-2">
                                            <Badge
                                              variant="outline"
                                              className="border-green-500 text-green-400"
                                            >
                                              Regular Customer
                                            </Badge>
                                            <span className="text-xs text-gray-400">
                                              Customer ID: {order.userId}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <h4 className="text-sm font-medium text-green-400 mb-2">
                                            Contact Information
                                          </h4>
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-green-400"
                                                >
                                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-sm text-gray-400">
                                                  Phone Number
                                                </p>
                                                <p className="text-white">
                                                  {order.phoneNumber}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-green-400"
                                                >
                                                  <rect
                                                    x="2"
                                                    y="4"
                                                    width="20"
                                                    height="16"
                                                    rx="2"
                                                  ></rect>
                                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-sm text-gray-400">
                                                  Email
                                                </p>
                                                <p className="text-white">
                                                  {order.userEmail}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h4 className="text-sm font-medium text-green-400 mb-2">
                                            Delivery Information
                                          </h4>
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-green-400"
                                                >
                                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                                  <circle
                                                    cx="12"
                                                    cy="10"
                                                    r="3"
                                                  ></circle>
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-sm text-gray-400">
                                                  Address
                                                </p>
                                                <p className="text-white">
                                                  {order.deliveryAddress}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-6 pt-6 border-t border-gray-700">
                                        <h4 className="text-sm font-medium text-green-400 mb-4">
                                          Order History
                                        </h4>
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                            <div className="flex items-center gap-3">
                                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-green-400"
                                                >
                                                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                                  <path d="M3 6h18"></path>
                                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-white font-medium">
                                                  Previous Order #ORD1001
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                  March 15, 2025
                                                </p>
                                              </div>
                                            </div>
                                            <Badge className="bg-green-500">
                                              Delivered
                                            </Badge>
                                          </div>
                                          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                                            <div className="flex items-center gap-3">
                                              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="text-green-400"
                                                >
                                                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                                                  <path d="M3 6h18"></path>
                                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-white font-medium">
                                                  Previous Order #ORD998
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                  March 2, 2025
                                                </p>
                                              </div>
                                            </div>
                                            <Badge className="bg-green-500">
                                              Delivered
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>

                                <TabsContent
                                  value="products"
                                  className="space-y-6 mt-0 focus:outline-none"
                                >
                                  <Card className="bg-gray-800/50 border-gray-700">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm text-green-400">
                                        Order Items
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                          <div
                                            key={index}
                                            className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                                          >
                                            <div className="h-16 w-16 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                                              {item.productImage ? (
                                                <Image
                                                  fill
                                                  src={
                                                    item.productImage ||
                                                    "/placeholder.svg"
                                                  }
                                                  alt={item.productName}
                                                  className="h-full w-full object-cover"
                                                />
                                              ) : (
                                                <div className="text-xs text-center text-gray-400">
                                                  No image
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex justify-between">
                                                <h4 className="font-medium text-white">
                                                  {item.productName}
                                                </h4>
                                                <span className="font-medium text-green-400">
                                                  {formatCurrency(
                                                    item.quantity * item.price
                                                  )}
                                                </span>
                                              </div>
                                              <div className="flex items-center mt-1">
                                                <span className="text-sm text-gray-400">
                                                  Product ID: {item.productId}
                                                </span>
                                              </div>
                                              <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center">
                                                  <Badge
                                                    variant="outline"
                                                    className="border-gray-600 text-white"
                                                  >
                                                    Qty: {item.quantity}
                                                  </Badge>
                                                  <span className="mx-2 text-gray-500">
                                                    ×
                                                  </span>
                                                  <span className="text-gray-400">
                                                    {formatCurrency(item.price)}
                                                  </span>
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                                >
                                                  View Product
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card className="bg-gray-800/50 border-gray-700">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm text-green-400">
                                        Order Summary
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-400">
                                            Subtotal
                                          </span>
                                          <span className="text-white">
                                            {formatCurrency(order.totalPrice)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-400">
                                            Delivery Fee
                                          </span>
                                          <span className="text-white">
                                            ETB 0
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-gray-400">
                                            Discount
                                          </span>
                                          <span className="text-white">
                                            ETB 0
                                          </span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-700">
                                          <div className="flex items-center justify-between font-medium">
                                            <span className="text-white">
                                              Total
                                            </span>
                                            <span className="text-green-400 text-lg">
                                              {formatCurrency(order.totalPrice)}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-400">
                                              Payment Method
                                            </span>
                                            <span className="text-xs text-gray-400">
                                              {order.paymentMethod}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center border-t border-gray-800 pt-4 mt-auto">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="border-green-500 text-green-500 hover:bg-green-500/10"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Invoice
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-gray-700 text-white hover:bg-gray-800"
                                >
                                  Edit Order
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                {order.status === "Pending" && (
                                  <Button variant="destructive" size="sm">
                                    Cancel Order
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      className="bg-green-500 hover:bg-green-600"
                                      size="sm"
                                    >
                                      Update Status
                                      <ChevronDownIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                    <DropdownMenuItem className="hover:bg-gray-700">
                                      Mark as Processing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-700">
                                      Mark as Paid
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-700">
                                      Mark as Delivered
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                                      Mark as Cancelled
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-medium text-white">{orders.length}</span> of{" "}
              <span className="font-medium text-white">{totalOrders}</span>{" "}
              orders
            </p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number.parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-[80px] h-8 focus:ring-green-500">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400">per page</p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-white bg-gray-800 disabled:opacity-50"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <ChevronLeftIcon className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-white bg-gray-800 disabled:opacity-50"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 ${
                      currentPage === pageNum
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "border-gray-700 text-white bg-gray-800"
                    }`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-white bg-gray-800 disabled:opacity-50"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-700 text-white bg-gray-800 disabled:opacity-50"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <ChevronRightIcon className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
