import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
			{
				protocol: "https",
				hostname: "images.clerk.dev",
			},
		],
	},
	webpack: (config, { isServer }) => {
		// Ensure @clerk/clerk-react is properly resolved
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
			};
		}
		return config;
	},
};

export default nextConfig;
