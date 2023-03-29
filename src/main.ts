import { createApp } from "vue";
import ElementPlus from "element-plus";
import * as ElIcons from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "@/assets/less/index.less";
import App from "./App.vue";
const app = createApp(App);
// for (const i in ElIcons) {
// 	app.component(i, ElIcons[i]);
// }

app.use(ElementPlus).mount("#app");
