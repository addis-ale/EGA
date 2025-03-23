import prisma from "@/lib/prismadb";
import { getAuthenticatedUser } from "../wishlist/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the authenticated user's ID
    const userId = await getAuthenticatedUser(); // Ensure this function returns the authenticated user's ID.

    // Parse the request body for the search keyword
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json(
        { message: "Search keyword is required." },
        { status: 401 }
      );
    }

    // Check if search history exists for the user
    let searchHistory = await prisma.searchHistory.findFirst({
      where: { userId },
    });

    // If no search history, create a new one
    if (!searchHistory) {
      searchHistory = await prisma.searchHistory.create({
        data: { userId },
      });
    }

    // Create a new search record
    const newSearch = await prisma.search.create({
      data: {
        searchQuery: keyword,
        searchId: searchHistory.id, // Linking the search record to the search history
      },
    });

    // Return the response with the new search
    return NextResponse.json({
      message: "Search query recorded successfully.",
      search: newSearch,
    });
  } catch (error) {
    console.error("Error creating search history:", error);
    return NextResponse.json({
      message: "Internal server error while saving search history.",
    });
  }
}
