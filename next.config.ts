import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com",
      "images.unsplash.com",
      "res.cloudinary.com",
      "private-user-images.githubusercontent.com",
      "raw.githubusercontent.com",
      "github.com",
      "media.istockphoto.com",
    ],
  },
  // next.config.js

  reactStrictMode: false,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
