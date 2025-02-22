import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  const { user } = session;

  return user;
};
