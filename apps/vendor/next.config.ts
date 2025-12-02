import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@acme/ui", "@acme/tailwind"],
  output: "standalone",
};

export default nextConfig;
