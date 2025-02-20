import { z } from "zod";
import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypjs";
const requestSchema = z.object({
  token: z.string().min(6, "invalid token"),
  password: z.string().min(8, "the password must be greater than 8"),
});

export default async function resetpassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const validation = requestSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.format });
  }

  const { token, password } = req.body;
  const VerificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!VerificationToken) {
    return res.status(400).json({ message: "token expire" });
  }

  const hashedPassword = await bcrypt.hash(password);
  const user = await prisma.user.findUnique({
    where: { UserEmail: VerificationToken.identifier },
  });
  if (!user) {
    res.status(200).json({ error: "user not found" });
  }

  await prisma.user.update({
    where: { UserEmail: user?.UserEmail },
    data: { password: hashedPassword },
  });
  await prisma.verificationToken.delete({ where: token });
  res.status(200).json({ message: "Password Change successfully" });
}
