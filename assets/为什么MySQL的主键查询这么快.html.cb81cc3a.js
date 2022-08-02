const e=JSON.parse('{"key":"v-11c604bc","path":"/posts/storage/MySQL/%E4%B8%BA%E4%BB%80%E4%B9%88MySQL%E7%9A%84%E4%B8%BB%E9%94%AE%E6%9F%A5%E8%AF%A2%E8%BF%99%E4%B9%88%E5%BF%AB.html","title":"\u4E3A\u4EC0\u4E48MySQL\u7684\u4E3B\u952E\u67E5\u8BE2\u8FD9\u4E48\u5FEB","lang":"zh-CN","frontmatter":{"title":"\u4E3A\u4EC0\u4E48MySQL\u7684\u4E3B\u952E\u67E5\u8BE2\u8FD9\u4E48\u5FEB","index":false,"icon":"creative","category":["MySQL"],"summary":"\u8FD9\u662F\u56FE\u89E3MySQL\u7684\u7B2C3\u7BC7\u6587\u7AE0\uFF0C\u8FD9\u7BC7\u6587\u7AE0\u4F1A\u8BA9\u5927\u5BB6\u6E05\u695A\u5730\u660E\u767D\uFF1A \u4EC0\u4E48\u662FInnoDB\u884C\u683C\u5F0F\uFF1FInnoDB\u9875\u662F\u4EC0\u4E48\uFF1F; InnoDB\u9875\u548CInnoDB\u884C\u683C\u5F0F\u90FD\u6709\u54EA\u4E9B\u5B57\u6BB5\u4FE1\u606F\uFF1F; \u4E3A\u4EC0\u4E48\u63A8\u8350\u4F7F\u7528\u81EA\u589EID\u4F5C\u4E3A\u4E3B\u952E\uFF0C\u800C\u4E0D\u63A8\u8350\u4F7F\u7528UUID\uFF1F; InnoDB\u8BBE\u8BA1\u8005\u5982\u4F55\u8BBE\u8BA1\u9AD8\u6548\u7B97\u6CD5\uFF0C\u5FEB\u901F\u5728\u4E00\u4E2A\u9875\u4E2D\u641C\u7D22\u8BB0\u5F55\u3002; \u6B63\u6587\u5F00\u59CB\uFF01 ------ \\" \u6CE8\uFF1A\u6211\u4EEC\u63A5\u4E0B\u6765\u7684\u6240\u6709\u63CF\u8FF0\uFF0C\u9488\u5BF9\u7684\u90FD\u662FI","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-v2-demo.mrhope.site/posts/storage/MySQL/%E4%B8%BA%E4%BB%80%E4%B9%88MySQL%E7%9A%84%E4%B8%BB%E9%94%AE%E6%9F%A5%E8%AF%A2%E8%BF%99%E4%B9%88%E5%BF%AB.html"}],["meta",{"property":"og:site_name","content":"\u8749\u6C90\u98CE\u7684\u4E2A\u4EBA\u7F51\u7AD9"}],["meta",{"property":"og:title","content":"\u4E3A\u4EC0\u4E48MySQL\u7684\u4E3B\u952E\u67E5\u8BE2\u8FD9\u4E48\u5FEB"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-08-02T06:32:31.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:modified_time","content":"2022-08-02T06:32:31.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"1. \u521D\u63A2InnoDB\u884C\u683C\u5F0F\uFF08ROW_FORMAT\uFF09","slug":"_1-\u521D\u63A2innodb\u884C\u683C\u5F0F-row-format","children":[]},{"level":2,"title":"2. \u5F15\u5165InnoDB\u9875","slug":"_2-\u5F15\u5165innodb\u9875","children":[]},{"level":2,"title":"3. \u6570\u636E\u9875\u7684\u7ED3\u6784","slug":"_3-\u6570\u636E\u9875\u7684\u7ED3\u6784","children":[{"level":3,"title":"3.1 \u7528\u6237\u8BB0\u5F55\u662F\u5982\u4F55\u5B58\u653E\u7684","slug":"_3-1-\u7528\u6237\u8BB0\u5F55\u662F\u5982\u4F55\u5B58\u653E\u7684","children":[]},{"level":3,"title":"3.2 \u756A\u5916\uFF1A\u4E3A\u4EC0\u4E48\u63A8\u8350\u4F7F\u7528\u81EA\u589EID\u4F5C\u4E3A\u4E3B\u952E\uFF0C\u800C\u4E0D\u63A8\u8350\u4F7F\u7528UUID\uFF1F","slug":"_3-2-\u756A\u5916-\u4E3A\u4EC0\u4E48\u63A8\u8350\u4F7F\u7528\u81EA\u589Eid\u4F5C\u4E3A\u4E3B\u952E-\u800C\u4E0D\u63A8\u8350\u4F7F\u7528uuid","children":[]},{"level":3,"title":"3.3 \u6570\u636E\u9875\u81EA\u5E26\u7684\u4E24\u6761\u4F2A\u8BB0\u5F55","slug":"_3-3-\u6570\u636E\u9875\u81EA\u5E26\u7684\u4E24\u6761\u4F2A\u8BB0\u5F55","children":[]},{"level":3,"title":"3.4 \u6570\u636E\u9875\u4E2D\u4E3B\u952E\u7684\u9AD8\u6548\u67E5\u8BE2\u65B9\u6848","slug":"_3-4-\u6570\u636E\u9875\u4E2D\u4E3B\u952E\u7684\u9AD8\u6548\u67E5\u8BE2\u65B9\u6848","children":[]}]},{"level":2,"title":"4. \u91CD\u8981\uFF01\u6570\u636E\u9875\u7684\u5176\u4ED6\u5B57\u6BB5","slug":"_4-\u91CD\u8981-\u6570\u636E\u9875\u7684\u5176\u4ED6\u5B57\u6BB5","children":[]},{"level":2,"title":"5. \u63A8\u8350\u9605\u8BFB","slug":"_5-\u63A8\u8350\u9605\u8BFB","children":[]}],"git":{"createdTime":1659421951000,"updatedTime":1659421951000,"contributors":[{"name":"chanmufeng","email":"zhaoxaolong@163.com","commits":1}]},"readingTime":{"minutes":15.18,"words":4555},"filePathRelative":"posts/storage/MySQL/\u4E3A\u4EC0\u4E48MySQL\u7684\u4E3B\u952E\u67E5\u8BE2\u8FD9\u4E48\u5FEB.md","localizedDate":"2022\u5E748\u67082\u65E5"}');export{e as data};
