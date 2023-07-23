/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true
    },
    images: {
        domains: [
            'avatars.githubusercontent.com',
            'lhe.googleusercontent.com',
            'res.cloudinary.com'
        ]
    }
}

module.exports = nextConfig
