import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = new URL(".", import.meta.url).pathname;

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer, webpack, nextRuntime }) => {
		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(
				/^node:/,
				(resource) => {
					resource.request = resource.request.replace(/^node:/, "");
				}
			)
		);

		const isEdgeRuntime = nextRuntime === "edge";
		if (!isServer || isEdgeRuntime) {
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
		}

		return config;
	},
};

export default nextConfig;
