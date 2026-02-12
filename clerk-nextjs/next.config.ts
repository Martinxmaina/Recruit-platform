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
		// Ensure @clerk/clerk-react and its internal modules are properly resolved
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": require.resolve("@clerk/clerk-react"),
			"@clerk/clerk-react/internal": require.resolve("@clerk/clerk-react/dist/internal"),
		};
		return config;
	},
	turbopack: {},
};

export default nextConfig;
