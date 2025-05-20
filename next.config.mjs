/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    images: {
        domains: ['github.com'],
        unoptimized: true,
    },
};

export default nextConfig;
