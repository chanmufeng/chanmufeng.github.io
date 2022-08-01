import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "蝉沐风",
  description: "vuepress-theme-hope 的演示",

  base: "/",

  theme,
});
