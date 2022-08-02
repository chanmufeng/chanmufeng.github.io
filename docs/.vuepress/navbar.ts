import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/home",
  { text: "使用指南", icon: "creative", link: "/guide/" },
  {
    text: "技术博文",
    icon: "edit",
    prefix: "/posts",
    children: [
      {
        text: "内功心法",
        icon: "edit",
        prefix: "/basic",
        children: [
          { text: "设计模式", icon: "edit", link: "/design-pattern/" },
          { text: "设计原则", icon: "edit", link: "/design-principle/开闭原则" },
        ],
      },
      {
        text: "存储篇",
        icon: "edit",
        prefix: "/storage",
        children: [
          {
            text: "MySQL",
            icon: "mysql",
            link: "/MySQL",
          },
          {
            text: "Redis",
            icon: "workingDirectory",
            link: "/Redis",
          },
          {
            text: "ElasticSearch",
            icon: "edit",
            link: "/ElasticSearch",
          },
        ],
      },
      { text: "并发篇", icon: "edit", link: "/concurrency" },
    ],
  },
  {
    text: "主题文档",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  },
]);
