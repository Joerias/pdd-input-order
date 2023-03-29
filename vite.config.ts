import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@comp": resolve(__dirname, "src/components"),
			"@utils": resolve(__dirname, "src/utils"),
		},
		extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
	},
	css: {
		preprocessorOptions: {
			less: {
				additionalData: '@import "./src/assets/less/index.less";',
			},
		},
	},
	server: {
		open: true,
	},
});
