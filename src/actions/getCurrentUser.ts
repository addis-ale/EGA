import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth/next";

export interface CurrentUser {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return null;

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
      select: { id: true, role: true, name: true, email: true, image: true },
    });

    return currentUser ?? null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};
