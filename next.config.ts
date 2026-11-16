import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /api/mcp and the journal pages read content/journal with fs at request time; ship the files with the functions.
  outputFileTracingIncludes: { "/api/mcp": ["./content/journal/**"], "/journal": ["./content/journal/**"], "/journal/[slug]": ["./content/journal/**"] },
  // The old portfolio link page now lives on the main site.
  async redirects() {
    return [{ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true }];
  },
};

export default nextConfig;
