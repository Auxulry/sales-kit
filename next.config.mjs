/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co'
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000'
            },
            {
                protocol: 'https',
                hostname: 'saleskit.havidmohamad.com'
            }
        ]
    }
};

export default nextConfig;
