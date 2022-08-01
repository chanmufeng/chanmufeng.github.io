import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "蝉沐风的个人网站",
  description: "Chanmufeng's Personal Website",

  base: "/",

  theme,
});
