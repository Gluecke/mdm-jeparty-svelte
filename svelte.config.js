import adapter from '@sveltejs/adapter-static';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: 'index.html' }),
		alias: {
			$components: resolve(__dirname, 'src/components')
		}
	}
};

export default config;
