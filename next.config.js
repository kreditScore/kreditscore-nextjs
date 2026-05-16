/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Blog: legacy slugs → English URLs (301)
      {
        source: "/blog/credit-score-kya-hai-kaise-sudhare",
        destination: "/blog/what-is-credit-score-and-how-to-improve-it",
        permanent: true,
      },
      {
        source: "/blog/personal-loan-eligibility-documents",
        destination: "/blog/personal-loan-eligibility-and-documents",
        permanent: true,
      },
      {
        source: "/blog/pre-approved-loan-vs-fresh-loan",
        destination: "/blog/pre-approved-vs-fresh-personal-loan",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kreditscore.in" }],
        destination: "https://kreditscore.in/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
