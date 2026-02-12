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
		// Ensure @clerk/clerk-react and subpath exports are properly resolved
		const clerkReactPath = require.resolve("@clerk/clerk-react");
		// Extract package directory (remove /dist/index.js from path)
		const clerkReactDir = clerkReactPath.substring(0, clerkReactPath.lastIndexOf("/dist"));
		
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": clerkReactPath,
			"@clerk/clerk-react/internal": `${clerkReactDir}/dist/internal.js`,
			"@clerk/clerk-react/errors": `${clerkReactDir}/dist/errors.js`,
			"@clerk/clerk-react/experimental": `${clerkReactDir}/dist/experimental.js`,
		};
		
		// Configure webpack to respect package exports
		config.resolve.conditionNames = ['require', 'node', 'import', 'default'];
		
		// Handle Node.js built-in modules (node:fs, node:crypto, etc.)
		if (!isServer) {
			// For client-side builds, externalize Node.js built-ins
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				stream: false,
				url: false,
				zlib: false,
				http: false,
				https: false,
				assert: false,
				os: false,
				path: false,
				util: false,
				buffer: false,
				process: false,
			};
			
			// Handle node: scheme prefix by normalizing imports
			config.resolve.alias = {
				...config.resolve.alias,
				"node:fs": false,
				"node:path": false,
				"node:crypto": false,
				"node:stream": false,
				"node:util": false,
				"node:buffer": false,
				"node:os": false,
				"node:net": false,
				"node:tls": false,
				"node:http": false,
				"node:https": false,
				"node:zlib": false,
				"node:url": false,
			};
		}
		
		return config;
	},
	turbopack: {},
};

export default nextConfig;
