import { h, type App } from "vue";
import DefaultTheme from "vitepress/theme";
import Demo from "./components/Demo.vue";
import "ant-design-vue/dist/reset.css";
import "uno.css";
import "./style.css";
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default {
  ...DefaultTheme,
  async enhanceApp({ app }: { app: App }) {
    
    app.component("Demo", Demo);
  },
  Layout: () => {
    // return h(DefaultTheme.Layout);
    return h(
      ConfigProvider,
      {
        locale: zhCN,
        theme: {
          token: {
            colorPrimary: '#00b69b'
          }
        }
      },
      () => h(DefaultTheme.Layout)
    );
  },
};
