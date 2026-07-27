const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  output: "standalone",
  reactStrictMode: true,
  optimizeFonts: false,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ["i.imgur.com"],
  },
  env: {
    LIMIT_RESULTS: process.env.LIMIT_RESULTS,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ENDPOINT_SERVER: process.env.ENDPOINT_SERVER,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_ACCESSTOKEN_EXPIRED: process.env.JWT_ACCESSTOKEN_EXPIRED,
    JWT_REFRESHTOKEN_EXPIRED: process.env.JWT_REFRESHTOKEN_EXPIRED,
    MEMO_PREFIX_DEPOSIT: process.env.MEMO_PREFIX_DEPOSIT,
    NEXT_PUBLIC_WALLET_ADDRESS: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
    NEXT_PUBLIC_IS_USDT_PAYMENT: process.env.NEXT_PUBLIC_IS_USDT_PAYMENT,
  },
});
