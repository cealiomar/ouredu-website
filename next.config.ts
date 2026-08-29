import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* StrictMode double-invokes effects in development. ScrollTrigger pins create
     a pin-spacer on the first pass; when that pass is torn down the spacer can
     survive while the live trigger measures against it, so scrubbed pins never
     engage. Production renders once, so this only affects the dev experience. */
  reactStrictMode: false,
};

export default nextConfig;
