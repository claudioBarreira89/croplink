/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const redirects = [];

    if (isDev) {
      return [
        ...redirects,
        {
          source: "/api/:path*",
          destination: "http://localhost:" + process.env.PORT + "/:path*",
        },
      ];
    }

    return redirects;
  },
};

module.exports = nextConfig;
