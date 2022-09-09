import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const config: UserConfig = {
	plugins: [
		sveltekit(),
		NodeGlobalsPolyfillPlugin({
			process: true,
			buffer: true
		})
	],
	resolve: {
		alias: {
			stream: 'stream-browserify',
			crypto: 'crypto-browserify',
			assert: 'assert'
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		}
	}
};

export default config;
