const BASE_PATH = "/app/stock";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;