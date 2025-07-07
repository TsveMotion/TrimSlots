/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Add security headers including CSP
  async headers() {
    console.log(`Next.js config: Development mode - disabling CSP for Stripe testing`);
    
    // In development, we'll disable CSP to allow Stripe.js to load properly
    // For production, you should re-enable CSP with proper Stripe domains
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    
    // Production CSP settings
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://*.stripe.com; img-src 'self' data: blob: https://*.stripe.com; font-src 'self' data:; connect-src 'self' https://*.stripe.com https://*;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
