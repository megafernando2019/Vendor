import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./public/assets/scss"],
  },
};

export default nextConfig;
