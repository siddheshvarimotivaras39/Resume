const path = require("path");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? "/Resume/" : "",
  basePath: isProd ? "/Resume" : "",
  output: "export",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.dev.to",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media2.dev.to",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "**",
      },
    ],
  },
};
