import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"], // Add the required domain here
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
