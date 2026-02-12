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
	webpack: (config, { isServer, webpack, nextRuntime }) => {
		// Ensure @clerk/clerk-react and subpath exports are properly resolved
		const clerkReactPath = require.resolve("@clerk/clerk-react");
		// Extract package directory (remove /dist/index.js from path)
		const clerkReactDir = clerkReactPath.substring(0, clerkReactPath.lastIndexOf("/dist"));
		
		// Combine all aliases in one assignment, preserving existing ones
		// Use .js files universally - webpack handles ESM/CommonJS distinction internally
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react/internal": `${clerkReactDir}/dist/internal.js`,
			"@clerk/clerk-react/errors": `${clerkReactDir}/dist/errors.js`,
			"@clerk/clerk-react/experimental": `${clerkReactDir}/dist/experimental.js`,
		};
		
		// Configure webpack to respect package exports
		config.resolve.conditionNames = ['require', 'node', 'import', 'default'];
		
		// Handle node: scheme prefix using NormalModuleReplacementPlugin
		// This runs before resolution, so it strips the prefix early
		// Apply to both server and client builds since node: imports can appear in both
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(
				/^node:/,
				(resource) => {
					resource.request = resource.request.replace(/^node:/, '');
				}
			)
		);
		
		// Handle Node.js built-in modules
		// For Edge runtime (middleware) and client builds, externalize Node.js built-ins
		const isEdgeRuntime = nextRuntime === 'edge';
		if (!isServer || isEdgeRuntime) {
			// For client-side and Edge runtime builds, externalize Node.js built-ins
			// These will work after the node: prefix is stripped by the plugin above
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
			
			// Edge runtime externals are handled by fallbacks above
			// The fallbacks prevent Node.js built-ins from being bundled
		}
		
		return config;
	},
	turbopack: {},
};

export default nextConfig;
