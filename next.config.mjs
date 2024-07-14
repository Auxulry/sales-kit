import * as pwa from "@ducanh2912/next-pwa"
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

const withPWA = pwa.default({
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    dest: "public",
    workboxOptions: {
        disableDevLogs: true,
    },
});

export default withPWA(nextConfig);
