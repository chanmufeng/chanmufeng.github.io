import { h } from "vue";

import DropTransition from "vuepress-theme-hope/src/client/components/transitions/DropTransition";
import BloggerInfo from "vuepress-theme-hope/src/client/module/blog/components/BloggerInfo";
import WechatInfo from "./WechatInfo";
import InfoList from "vuepress-theme-hope/src/client/module/blog/components/InfoList";

import type { FunctionalComponent, VNode } from "vue";

import "vuepress-theme-hope/src/client/module/blog/styles/info-panel.scss";

const InfoPanel: FunctionalComponent = (): VNode =>
    h("aside", { class: "blog-info-wrapper" }, [
        h(DropTransition, () => h(WechatInfo)),
        h(DropTransition, () => h(BloggerInfo)),
        h(DropTransition, { delay: 0.04 }, () => h(InfoList)),
    ]);

InfoPanel.displayName = "InfoPanel";

export default InfoPanel;
