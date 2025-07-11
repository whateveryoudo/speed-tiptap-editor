import { createApp } from "vue";
import App from "./App.vue";
import router from "./src/router";
import SpeedTiptapEditor from "../src/main";
import "uno.css";

createApp(App)
  .use(router)
  .use(
    SpeedTiptapEditor
  )
  .mount("#app");
