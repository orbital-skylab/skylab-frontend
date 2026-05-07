/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/public-gallery/",
          destination: "/public-gallery/artemis/page/1/",
        },
      ],
    };
  },
};

module.exports = nextConfig;
