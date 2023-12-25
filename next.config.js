/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.shareicon.net"
            }
        ]
    }
}

module.exports = nextConfig
