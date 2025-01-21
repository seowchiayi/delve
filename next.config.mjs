/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
      return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://delve-fysb.vercel.app" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true, // Set to true if you want this redirect to be cached by browsers
      }
    ];
  },
};

export default nextConfig;