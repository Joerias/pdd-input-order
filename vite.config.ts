import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), VueSetupExtend()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@comp": resolve(__dirname, "src/components"),
			"@util": resolve(__dirname, "src/utils"),
			"@type": resolve(__dirname, "src/types"),
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
