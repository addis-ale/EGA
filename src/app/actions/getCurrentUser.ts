import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Ensure this path is correct

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    // Check if the session contains a valid user email
    if (!session?.user?.email) {
      return null;
    }

    // Fetch the current user from the database using the email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // If no user is found, return null
    if (!currentUser) {
      return null;
    }

    // Return the user object with necessary fields
    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
