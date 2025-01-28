/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    domains: ['marialena-pietri.fr', 'bthmhtzrpzzyvsweybwo.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'marialena-pietri.fr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bthmhtzrpzzyvsweybwo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      constants: false,
    };
    return config;
  },
};

module.exports = nextConfig;
