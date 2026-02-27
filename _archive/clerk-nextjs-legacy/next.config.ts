import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	outputFileTracingRoot: path.join(__dirname),
	webpack: (config, { isServer, webpack, nextRuntime }) => {
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
