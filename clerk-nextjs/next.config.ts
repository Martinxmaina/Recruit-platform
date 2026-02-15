import type { NextConfig } from "next";
import path from "path";

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
	transpilePackages: ["@clerk/nextjs", "@clerk/clerk-react"],
	outputFileTracingRoot: path.join(__dirname),
	webpack: (config, { isServer, webpack, nextRuntime }) => {
		// Ensure @clerk/clerk-react and subpath exports are properly resolved
		const clerkReactPath = require.resolve("@clerk/clerk-react");
		// Extract package directory (remove /dist/index.js from path)
		const clerkReactDir = path.dirname(clerkReactPath);
		
		// Combine all aliases in one assignment, preserving existing ones
		// Use absolute paths to ensure webpack resolves correctly
		// Use .js files universally - webpack handles ESM/CommonJS distinction internally
		config.resolve.alias = {
			...config.resolve.alias,
			"@clerk/clerk-react": clerkReactPath,
			"@clerk/clerk-react/internal": path.resolve(clerkReactDir, "internal.js"),
			"@clerk/clerk-react/errors": path.resolve(clerkReactDir, "errors.js"),
			"@clerk/clerk-react/experimental": path.resolve(clerkReactDir, "experimental.js"),
		};
		
		// Configure webpack to respect package exports
		config.resolve.conditionNames = ['require', 'node', 'import', 'default'];
		
		// Ensure webpack resolves modules from node_modules correctly
		// This helps with subpath exports resolution
		if (!config.resolve.modules) {
			config.resolve.modules = ['node_modules'];
		}
		
		// Ensure webpack uses our aliases for all module resolution
		config.resolve.fullySpecified = false;
		
		// Handle node: scheme prefix using NormalModuleReplacementPlugin
		// This runs before resolution, so it strips the prefix early
		// Apply to both server and client builds since node: imports can appear in both
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(
				/^node:/,
				(resource: { request: string }) => {
					resource.request = resource.request.replace(/^node:/, '');
				}
			)
		);
		
		// Handle Clerk subpath imports using NormalModuleReplacementPlugin
		// Set both resource.request and resource.createData.request so every resolution path sees the replacement
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(
				/^@clerk\/clerk-react\/(internal|errors|experimental)$/,
				(resource: { request: string; createData?: { request: string } }) => {
					const subpath = resource.request.match(/\/(internal|errors|experimental)$/)?.[1];
					if (subpath) {
						const resolvedPath = path.resolve(clerkReactDir, `${subpath}.js`);
						resource.request = resolvedPath;
						if (resource.createData) {
							resource.createData.request = resolvedPath;
						}
					}
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
