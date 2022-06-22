/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/sign-in",
        destination: "https://skylab-backend.herokuapp.com/api/auth/sign-in",
      },
      {
        source: "/api/auth/info",
        destination: "https://skylab-backend.herokuapp.com/api/auth/info",
      },
      {
        source: "/api/auth/sign-out",
        destination: "https://skylab-backend.herokuapp.com/api/auth/sign-out",
      },
    ];
  },
};

module.exports = nextConfig;
