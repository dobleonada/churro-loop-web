import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // Strapi stores its uploads on Cloudinary; every CMS image is served
    // from this account's delivery URL.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dyxcs4jyl/**",
        search: "",
      },
    ],
    qualities: [75, 90],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
