import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch all necessary data in parallel
    const [users, products, orders, rentals] = await Promise.all([
      prisma.user.findMany(),
      prisma.product.findMany({
        include: { priceDetails: true },
      }),
      prisma.order.findMany({
        include: { items: true },
      }),
      prisma.rental.findMany(),
    ]);

    // Organizing products for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Revenue Calculations
    let revenueFromSales = 0;
    let revenueFromRentals = 0;
    const monthlyRevenueMap = new Map();

    orders.forEach((order) => {
      if (order.status === "Paid") {
        revenueFromSales += order.totalPrice;
        const monthYear = order.createdAt.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthlyRevenueMap.set(
          monthYear,
          (monthlyRevenueMap.get(monthYear) || 0) + order.totalPrice
        );
      }
    });

    rentals.forEach((rental) => {
      if (rental.status === "Returned") {
        const product = productMap.get(rental.productId);
        if (product?.priceDetails?.rentalPricePerDay) {
          const rentalDays = Math.ceil(
            (new Date(rental.rentalEnd) - new Date(rental.rentalStart)) /
              (1000 * 60 * 60 * 24)
          );
          const rentalRevenue =
            rentalDays * product.priceDetails.rentalPricePerDay;
          revenueFromRentals += rentalRevenue;
          const monthYear = rental.rentalStart.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          monthlyRevenueMap.set(
            monthYear,
            (monthlyRevenueMap.get(monthYear) || 0) + rentalRevenue
          );
        }
      }
    });

    // Total revenue
    const totalRevenue = revenueFromSales + revenueFromRentals;

    // Monthly revenue breakdown
    const monthlyRevenue = Array.from(monthlyRevenueMap).map(
      ([monthYear, revenue]) => ({
        month: monthYear.split(" ")[0],
        value: Math.round(revenue / 1000),
        label: `${monthYear}: ETB ${revenue.toLocaleString()}`,
      })
    );

    // Sorting monthly revenue by date
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
    monthlyRevenue.sort(
      (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
    );

    // Growth Calculation
    const currentMonthRevenue =
      monthlyRevenue[monthlyRevenue.length - 1]?.value || 0;
    const previousMonthRevenue =
      monthlyRevenue[monthlyRevenue.length - 2]?.value || 0;
    const revenueGrowth = previousMonthRevenue
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100
      : 0;

    // Response Data
    const responseData = {
      users: {
        total: users.length,
        admins: users.filter((user) => user.role === "ADMIN").length,
        regularUsers: users.filter((user) => user.role === "USER").length,
        recentUsers: users
          .slice(0, 3)
          .map(({ id, name, email, image, role, createdAt }) => ({
            id,
            name,
            email,
            image: image || "/placeholder.svg?height=40&width=40",
            role,
            createdAt: createdAt.toISOString(),
          })),
      },
      products: {
        total: products.length,
        available: products.filter((p) => p.status === "AVAILABLE").length,
        rentedOut: products.filter((p) => p.status === "RENTED_OUT").length,
      },
      orders: {
        total: orders.length,
        paid: orders.filter((o) => o.status === "Paid").length,
        cancelled: orders.filter((o) => o.status === "Cancelled").length,
        recentOrders: orders.slice(0, 4).map((order) => ({
          id: order.id,
          userName: users.find((u) => u.id === order.userId)?.name || "Unknown",
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
        })),
      },
      rentals: {
        total: rentals.length,
        active: rentals.filter((r) => r.status === "Active").length,
        returned: rentals.filter((r) => r.status === "Returned").length,
        overdue: rentals.filter((r) => r.status === "Overdue").length,
      },
      revenue: {
        total: totalRevenue,
        fromSales: revenueFromSales,
        fromRentals: revenueFromRentals,
        growth: parseFloat(revenueGrowth.toFixed(1)),
        monthly: monthlyRevenue,
      },
    };

    return NextResponse.json({ status: 200, responseData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}
