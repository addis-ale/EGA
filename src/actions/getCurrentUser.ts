import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null; // If no session, return null
  }

  // Extract user details
  const { user } = session;

  return user;
};
