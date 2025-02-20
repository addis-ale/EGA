import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  appDir: true,
  serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;
