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
	webpack: (config) => {
		// Ensure @clerk/clerk-react is properly resolved
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": require.resolve("@clerk/clerk-react"),
		};
		return config;
	},
};

export default nextConfig;
