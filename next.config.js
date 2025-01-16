/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth',
        permanent: true, // Set to true if you want this redirect to be cached by browsers
      },
    ];
  },
};

module.exports = nextConfig;