/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://" + process.env.API_HOST_PORT + "/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig
