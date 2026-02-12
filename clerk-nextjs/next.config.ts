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
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": require.resolve("@clerk/clerk-react"),
		};
		
		// Configure webpack to respect package exports
		config.resolve.conditionNames = ['require', 'node', 'import', 'default'];
		
		// Ensure webpack resolves package exports correctly
		if (!config.resolve.extensionAlias) {
			config.resolve.extensionAlias = {};
		}
		
		return config;
	},
	turbopack: {},
};

export default nextConfig;
