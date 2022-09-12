import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

const MODE = process.env.NODE_ENV;
const development = MODE === 'development';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		development &&
			NodeGlobalsPolyfillPlugin({
				process: true,
				buffer: true
			}),
		development &&
			rollupNodePolyFill({
				include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
				http: true,
				crypto: true
			})
	],
	resolve: {
		alias: {
			$components: path.resolve('./src/lib/components'),
			$stores: path.resolve('./src/lib/stores'),
			$icons: path.resolve('./src/lib/icons'),
			stream: 'stream-browserify',
			crypto: 'crypto-browserify',
			assert: 'assert'
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},
	server: {
		fs: {
			allow: [path.resolve('../../../kit')]
		}
	},
	build: {
		rollupOptions: {
			plugins: [
				// Enable rollup polyfills plugin - used during production bundling
				rollupNodePolyFill()
			]
		}
	}
};

export default config;
