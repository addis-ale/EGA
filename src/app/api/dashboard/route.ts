import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, res: Response) {
  if (req.method === "GET") {
    try {
      // Fetch necessary data from the database using Prisma
      const users = await prisma.user.findMany();
      const products = await prisma.product.findMany({
        include: {
          priceDetails: true, // Include the related priceDetails
        },
      });
      const orders = await prisma.order.findMany({
        include: {
          items: true,
        },
      });
      const rentals = await prisma.rental.findMany();

      // Calculate revenue from sales (orders)
      const revenueFromSales = orders
        .filter((order) => order.status === "Paid")
        .reduce((total, order) => total + order.totalPrice, 0);

      // Calculate revenue from rentals
      const revenueFromRentals = rentals
        .filter((rental) => rental.status === "Returned")
        .reduce((total, rental) => {
          const product = products.find((p) => p.id === rental.productId);
          if (product && product.priceDetails?.rentalPricePerDay) {
            const rentalDays = Math.ceil(
              (new Date(rental.rentalEnd).getTime() -
                new Date(rental.rentalStart).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return total + rentalDays * product.priceDetails.rentalPricePerDay;
          }
          return total;
        }, 0);

      // Total revenue
      const totalRevenue = revenueFromSales + revenueFromRentals;

      // Calculate monthly revenue
      const monthlyRevenueMap = new Map();

      // Process orders for monthly revenue
      orders.forEach((order) => {
        if (order.status === "Paid") {
          const monthYear = new Date(order.createdAt).toLocaleString(
            "default",
            { month: "short", year: "numeric" }
          );
          const revenue = order.totalPrice;
          if (monthlyRevenueMap.has(monthYear)) {
            monthlyRevenueMap.set(
              monthYear,
              monthlyRevenueMap.get(monthYear) + revenue
            );
          } else {
            monthlyRevenueMap.set(monthYear, revenue);
          }
        }
      });

      // Process rentals for monthly revenue
      rentals.forEach((rental) => {
        if (rental.status === "Returned") {
          const product = products.find((p) => p.id === rental.productId);
          if (product && product.priceDetails?.rentalPricePerDay) {
            const rentalDays = Math.ceil(
              (new Date(rental.rentalEnd).getTime() -
                new Date(rental.rentalStart).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            const revenue = rentalDays * product.priceDetails.rentalPricePerDay;
            const monthYear = new Date(rental.rentalStart).toLocaleString(
              "default",
              { month: "short", year: "numeric" }
            );
            if (monthlyRevenueMap.has(monthYear)) {
              monthlyRevenueMap.set(
                monthYear,
                monthlyRevenueMap.get(monthYear) + revenue
              );
            } else {
              monthlyRevenueMap.set(monthYear, revenue);
            }
          }
        }
      });

      // Convert monthly revenue map to an array of objects
      const monthlyRevenue = Array.from(monthlyRevenueMap).map(
        ([monthYear, revenue]) => ({
          month: monthYear.split(" ")[0], // Extract month (e.g., "Jan")
          value: Math.round(revenue / 1000), // Convert to thousands for the chart
          label: `${monthYear}: ETB ${revenue.toLocaleString()}`,
        })
      );

      // Sort monthly revenue by date
      monthlyRevenue.sort((a, b) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });

      // Calculate revenue growth
      const currentMonthRevenue =
        monthlyRevenue[monthlyRevenue.length - 1]?.value || 0;
      const previousMonthRevenue =
        monthlyRevenue[monthlyRevenue.length - 2]?.value || 0;
      const revenueGrowth =
        previousMonthRevenue === 0
          ? 0
          : ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100;

      // Calculate rentalCount for each product
      const productsWithRentalCount = products.map((product) => {
        const rentalCount = rentals.filter(
          (rental) => rental.productId === product.id
        ).length;
        return {
          ...product,
          rentalCount,
        };
      });

      // Construct the revenue object
      const revenue = {
        total: totalRevenue,
        fromSales: revenueFromSales,
        fromRentals: revenueFromRentals,
        growth: parseFloat(revenueGrowth.toFixed(1)), // Round to 1 decimal place
        monthly: monthlyRevenue,
      };

      // Construct the full response
      const responseData = {
        users: {
          total: users.length,
          admins: users.filter((user) => user.role === "ADMIN").length,
          regularUsers: users.filter((user) => user.role === "USER").length,
          growth: 7.8,
          recentUsers: users.slice(0, 3).map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || "/placeholder.svg?height=40&width=40",
            role: user.role,
            createdAt: user.createdAt.toISOString(),
          })),
        },
        products: {
          total: products.length,
          forSale: products.filter((product) => product.productType === "SALE")
            .length,
          forRent: products.filter((product) => product.productType === "RENT")
            .length,
          forBoth: products.filter((product) => product.productType === "BOTH")
            .length,
          available: products.filter(
            (product) => product.status === "AVAILABLE"
          ).length,
          rentedOut: products.filter(
            (product) => product.status === "RENTED_OUT"
          ).length,
          outOfStock: products.filter(
            (product) => product.status === "OUT_OF_STOCK"
          ).length,
          growth: 5.2,
        },
        orders: {
          total: orders.length,
          pending: orders.filter((order) => order.status === "Pending").length,
          paid: orders.filter((order) => order.status === "Paid").length,
          cancelled: orders.filter((order) => order.status === "Cancelled")
            .length,
          growth: 12.5,
          recentOrders: orders.slice(0, 4).map((order) => ({
            id: order.id,
            userId: order.userId,
            userName:
              users.find((user) => user.id === order.userId)?.name || "Unknown",
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod,
            status: order.status,
            items: order.items.map((item) => ({
              productId: item.productId,
              productName:
                products.find((product) => product.id === item.productId)
                  ?.productName || "Unknown",
              quantity: item.quantity,
              price: item.price,
            })),
            createdAt: order.createdAt.toISOString(),
          })),
        },
        rentals: {
          total: rentals.length,
          active: rentals.filter((rental) => rental.status === "Active").length,
          returned: rentals.filter((rental) => rental.status === "Returned")
            .length,
          overdue: rentals.filter((rental) => rental.status === "Overdue")
            .length,
          growth: 18.3,
          pendingReturns: rentals.slice(0, 5).map((rental) => ({
            id: rental.id,
            userId: rental.userId,
            userName:
              users.find((user) => user.id === rental.userId)?.name ||
              "Unknown",
            productId: rental.productId,
            productName:
              products.find((product) => product.id === rental.productId)
                ?.productName || "Unknown",
            rentalStart: rental.rentalStart.toISOString(),
            rentalEnd: rental.rentalEnd.toISOString(),
            status: rental.status,
          })),
        },
        revenue, // Include the calculated revenue object
        topProducts: productsWithRentalCount.slice(0, 5).map((product) => ({
          id: product.id,
          productName: product.productName,
          uploadedCoverImage:
            product.uploadedCoverImage || "/placeholder.svg?height=40&width=40",
          salesCount: product.salesCount,
          rentalCount: product.rentalCount, // Dynamically calculated rentalCount
          revenue: product.salesCount * (product.priceDetails?.salePrice || 0),
          views: product.views,
          trend: 24, // Placeholder value
        })),
      };
      return NextResponse.json({
        status: 200,
        responseData,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json({
        status: 500,
        error: "Internal Server Error",
      });
    }
  } else {
    return NextResponse.json({
      status: 405,
      msg: `Method ${req.method} Not Allowed`,
    });
  }
}
