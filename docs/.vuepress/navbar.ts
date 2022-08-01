import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/home",
  { text: "使用指南", icon: "creative", link: "/guide/" },
  {
    text: "技术博文",
    icon: "edit",
    prefix: "/posts/",
    children: [
      {
        text: "内功心法",
        icon: "edit",
        prefix: "article/",
        children: [
          { text: "设计模式", icon: "edit", link: "article1" },
          { text: "设计原则", icon: "edit", link: "article2" },
          "article3",
          "article4",
        ],
      },
      {
        text: "存储篇",
        icon: "edit",
        children: [
          {
            text: "MySQL",
            icon: "edit",
            link: "article/article5",
          },
          {
            text: "Redis",
            icon: "edit",
            link: "article/article6",
          },
          {
            text: "ElasticSearch",
            icon: "edit",
            link: "article/article6",
          },
          "article/article7",
          "article/article8",
        ],
      },
      { text: "并发篇", icon: "edit", link: "article9" },
      { text: "文章 10", icon: "edit", link: "article10" },
      "article11",
      "article12",
    ],
  },
  {
    text: "主题文档",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  },
]);
