import {defineUserConfig} from "vuepress";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";
import theme from "./theme";
import {path} from "@vuepress/utils";

export default defineUserConfig({
    lang: "zh-CN",
    title: "蝉沐风",
    description: "Chanmufeng's Personal Website",

    base: "/",

    theme,

    alias: {
        // 你可以在这里将别名定向到自己的组件
        // 比如这里我们将主题的主页组件改为用户 .vuepress/components 下的 HomePage.vue
        "@theme-hope/module/blog/components/InfoPanel": path.resolve(
            __dirname,
            "./components/InfoPanel.ts"
        ),
    },

    //配置百度统计
    head: [
        [
            'script', {},
            `
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?dfa689801ccd10bd283b50ea146430f3";
                  var s = document.getElementsByTagName("script")[0]; 
                  s.parentNode.insertBefore(hm, s);
                })();
            `
        ]
    ],

    // 配置 Algolia DocSearch
    plugins: [
        docsearchPlugin({
            appId: "8U6XWIU6A0",
            apiKey: "60e841bc063d8d7514271059f88d4e60",
            indexName: "chanmufeng"
        }),
    ],
});
