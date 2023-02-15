import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/home",
  // { text: "使用指南", icon: "creative", link: "/guide/" },
  {
    text: "技术博文",
    icon: "xieboke",
    prefix: "/posts",
    children: [
      {
        text: "内功心法",
        icon: "edit",
        prefix: "/basic",
        children: [
          { text: "设计模式", icon: "design", link: "/design-pattern/" },
          { text: "设计原则", icon: "design", link: "/design-principle/开闭原则" },
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
            icon: "redis",
            link: "/Redis",
          },
          {
            text: "ElasticSearch",
            icon: "elasticsearch-Elasticsearch",
            link: "/ElasticSearch",
          },
        ],
      },
      { text: "并发篇", icon: "CPU", link: "/concurrency" },
      { text: "JVM", icon: "PCxuniji", link: "/JVM" },
      { text: "Linux", icon: "linux", link: "/os" },
    ],
  },
  {
    text: "开发工具",
    icon: "keyboard",
    prefix: "/posts/tools",
    children: [
      { text: "IDEA", icon: "jetbrains", link: "/IDEA" },
      { text: "VSCode", icon: "VsCode", link: "/VSCode" },
      { text: "Mac", icon: "mac", link: "/Mac" },
    ],
  },
  {
    text: "socket编程",
    icon: "wangluojiekou",
    link: "/posts/network-programming",
  },
  {
    text: "最近更新",
    icon: "Update",
    link: "/update.md",
  },
  {
    text: "友链",
    icon: "lianjie",
    link: "/myFriends.md",
  },
  {
    text: "",
    icon: "bilibili",
    link: "https://space.bilibili.com/519360358",
  },
]);

