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
  webpack: (config, { isServer })  => {
    if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,  
      net: false,
      tls: false,
      path: false,
      yaml: false,
      stream: false,
      constants: false,
    }
  };
    return config;
  },
    // Ajoutez ceci pour gérer le CSS de swagger-ui-react
    transpilePackages: ['swagger-ui-react']
};

module.exports = nextConfig;
