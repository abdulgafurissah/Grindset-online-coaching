/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**', // Allow all for now as user R2 domain is placeholder
            }
        ],
    },
};

export default nextConfig;
