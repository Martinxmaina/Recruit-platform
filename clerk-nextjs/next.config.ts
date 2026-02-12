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
		// The internal module should resolve automatically via package exports
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": require.resolve("@clerk/clerk-react"),
		};
		// Ensure proper module resolution for Clerk packages
		config.resolve.modules = [...(config.resolve.modules || []), "node_modules"];
		return config;
	},
	turbopack: {},
};

export default nextConfig;
