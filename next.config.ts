import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /api/mcp and the journal pages read content/journal with fs at request time; ship the files with the functions.
  outputFileTracingIncludes: { "/api/mcp": ["./content/journal/**"], "/journal": ["./content/journal/**"], "/journal/[slug]": ["./content/journal/**"] },
};

export default nextConfig;
