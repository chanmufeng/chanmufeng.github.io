import {withBase} from "@vuepress/client";
import {computed, defineComponent, h} from "vue";

import {useThemeLocaleData} from "vuepress-theme-hope/src/client/composables";

import {
    useBlogOptions,
} from "vuepress-theme-hope/src/client/module/blog/composables";

import type {VNode} from "vue";

import "../styles/wechat-info.scss";

export default defineComponent({
    name: "WechatInfo",

    setup() {
        const blogOptions = useBlogOptions();
        const themeLocale = useThemeLocaleData();


        const bloggerAvatar = computed(
            () => "../public/wechat.png"
        );

        const locale = computed(() => themeLocale.value.blogLocales);

        const intro = computed(() => blogOptions.value.intro);

        return (): VNode =>
            h(
                "div",
                {
                    class: "wechat-info",
                    vocab: "https://schema.org/",
                    typeof: "Person",
                },
                [
                    h(
                        "div",
                        {
                            class: "blogger",
                            ...(intro.value
                                ? {
                                    style: {cursor: "pointer"},
                                    "aria-label": "微信公众号",
                                    "data-balloon-pos": "down",
                                    role: "navigation",
                                }
                                : {}),
                        },
                        [
                            h("img", {
                                class: [
                                    "wechat-img",
                                ],
                                // src: withBase("wechat.png"),
                                src: "http://qiniu.chanmufeng.com/2022-08-04-022629.png",
                                property: "image",
                                alt: "Wechat Img",
                            })

                        ]
                    ),

                ]
            );
    },
});
