import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@lib/prismadb";

const userSchema = z.object({
  id: z.string().uuid().optional(),
  userName: z.string().min(1, "username is required"),
  userEmail: z.string().email("email is reuired"),
  password: z.string().min(8, "password must be at least 8 character"),
  review: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  cart: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  order: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  search: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { userEmail, password, userName } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { UserEmail: userEmail },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          UserEmail: userEmail,
          password: hashedPassword,
          userName: userName,
        },
      });

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          userName: user.userName,
          userEmail: user.UserEmail,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
