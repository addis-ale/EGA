import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (
    params.model === "Review" &&
    ["create", "update"].includes(params.action)
  ) {
    const rating = params.args.data.rating;
    if (rating < 1 && rating > 5) {
      throw new Error("The Rating Must be between 1 and 5");
    }
  }
  return next(params);
});
