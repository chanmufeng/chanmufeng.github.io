const e=JSON.parse('{"key":"v-0822c486","path":"/posts/storage/MySQL/%E4%B8%80%E6%9D%A1Update%E8%AF%AD%E5%8F%A5%E6%98%AF%E5%A6%82%E4%BD%95%E6%89%A7%E8%A1%8C%E7%9A%84.html","title":"\u4E00\u6761UPDATE\u8BED\u53E5\u662F\u5982\u4F55\u6267\u884C\u7684","lang":"zh-CN","frontmatter":{"title":"\u4E00\u6761UPDATE\u8BED\u53E5\u662F\u5982\u4F55\u6267\u884C\u7684","index":false,"icon":"creative","category":["MySQL"],"summary":"\\" \\" \\" \u6587\u7AE0\u9996\u53D1\u4E8E\u516C\u4F17\u53F7\u300C\u8749\u6C90\u98CE\u300D\uFF0C\u8BA4\u771F\u5199\u597D\u6BCF\u4E00\u7BC7\u6587\u7AE0\uFF0C\u6B22\u8FCE\u5927\u5BB6\u5173\u6CE8\u4EA4\u6D41\\" \u8FD9\u662F\u56FE\u89E3MySQL\u7684\u7B2C2\u7BC7\u6587\u7AE0\uFF0C\u8FD9\u7BC7\u6587\u7AE0\u4F1A\u901A\u8FC7\u4E00\u6761SQL\u66F4\u65B0\u8BED\u53E5\u7684\u6267\u884C\u6D41\u7A0B\u8BA9\u5927\u5BB6\u6E05\u695A\u5730\u660E\u767D\uFF1A \u4EC0\u4E48\u662FInnoDB\u9875\uFF1F\u7F13\u5B58\u9875\u53C8\u662F\u4EC0\u4E48\uFF1F\u4E3A\u4EC0\u4E48\u8FD9\u4E48\u8BBE\u8BA1\uFF1F; \u4EC0\u4E48\u662F\u8868\u7A7A\u95F4\uFF1F\u4E0D\u540C\u5B58\u50A8\u5F15\u64CE\u7684\u8868\u5728\u6587\u4EF6\u7CFB\u7EDF\u7684\u5E95\u5C42\u8868\u793A\u4E0A\u6709\u4EC0\u4E48\u533A\u522B\uFF1F; Buffer Pool\u662F\u4EC0\u4E48\uFF1F\u4E3A\u4EC0\u4E48\u9700\u8981\uFF1F\u6709\u54EA\u4E9B\u6211\u4EEC\u9700\u8981\u638C\u63E1","head":[["meta",{"property":"og:url","content":"https://www.chanmufeng.com/posts/storage/MySQL/%E4%B8%80%E6%9D%A1Update%E8%AF%AD%E5%8F%A5%E6%98%AF%E5%A6%82%E4%BD%95%E6%89%A7%E8%A1%8C%E7%9A%84.html"}],["meta",{"property":"og:site_name","content":"\u8749\u6C90\u98CE"}],["meta",{"property":"og:title","content":"\u4E00\u6761UPDATE\u8BED\u53E5\u662F\u5982\u4F55\u6267\u884C\u7684"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-08-02T06:32:31.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:modified_time","content":"2022-08-02T06:32:31.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"1. \u4E00\u4E9B\u9700\u8981\u77E5\u9053\u7684\u6982\u5FF5","slug":"_1-\u4E00\u4E9B\u9700\u8981\u77E5\u9053\u7684\u6982\u5FF5","children":[{"level":3,"title":"1.1 InnoDB\u9875","slug":"_1-1-innodb\u9875","children":[]},{"level":3,"title":"1.2 \u8868\u7A7A\u95F4","slug":"_1-2-\u8868\u7A7A\u95F4","children":[]}]},{"level":2,"title":"2. \u7F13\u51B2\u6C60Buffer Pool","slug":"_2-\u7F13\u51B2\u6C60buffer-pool","children":[]},{"level":2,"title":"3. redo\u65E5\u5FD7","slug":"_3-redo\u65E5\u5FD7","children":[{"level":3,"title":"3.1 \u4E3A\u4EC0\u4E48\u9700\u8981redo\u65E5\u5FD7","slug":"_3-1-\u4E3A\u4EC0\u4E48\u9700\u8981redo\u65E5\u5FD7","children":[]},{"level":3,"title":"3.2 \u78C1\u9053\u5BFB\u5740","slug":"_3-2-\u78C1\u9053\u5BFB\u5740","children":[]},{"level":3,"title":"3.3 redo\u65E5\u5FD7\u7684\u7CFB\u7EDF\u53D8\u91CF","slug":"_3-3-redo\u65E5\u5FD7\u7684\u7CFB\u7EDF\u53D8\u91CF","children":[]}]},{"level":2,"title":"4. undo\u65E5\u5FD7","slug":"_4-undo\u65E5\u5FD7","children":[]},{"level":2,"title":"5. SQL\u66F4\u65B0\u8BED\u53E5\u7684\u6267\u884C\u603B\u7ED3\u2014\u2014\u521D\u7248","slug":"_5-sql\u66F4\u65B0\u8BED\u53E5\u7684\u6267\u884C\u603B\u7ED3\u2014\u2014\u521D\u7248","children":[]},{"level":2,"title":"6. binlog\u65E5\u5FD7","slug":"_6-binlog\u65E5\u5FD7","children":[{"level":3,"title":"6.1 \u4E3A\u4EC0\u4E48\u6709\u4E86redo\u65E5\u5FD7\u8FD8\u9700\u8981 binlog\uFF1F","slug":"_6-1-\u4E3A\u4EC0\u4E48\u6709\u4E86redo\u65E5\u5FD7\u8FD8\u9700\u8981-binlog","children":[]},{"level":3,"title":"6.2 binlog\u65E5\u5FD7\u7684\u4F5C\u7528","slug":"_6-2-binlog\u65E5\u5FD7\u7684\u4F5C\u7528","children":[]},{"level":3,"title":"6.3 \u4E24\u9636\u6BB5\u63D0\u4EA4","slug":"_6-3-\u4E24\u9636\u6BB5\u63D0\u4EA4","children":[]}]},{"level":2,"title":"7. SQL\u66F4\u65B0\u8BED\u53E5\u7684\u6267\u884C\u603B\u7ED3\u2014\u2014\u7EC8\u7248","slug":"_7-sql\u66F4\u65B0\u8BED\u53E5\u7684\u6267\u884C\u603B\u7ED3\u2014\u2014\u7EC8\u7248","children":[]},{"level":2,"title":"\u63A8\u8350\u9605\u8BFB","slug":"\u63A8\u8350\u9605\u8BFB","children":[]},{"level":2,"title":"\u53C2\u8003\u8D44\u6599","slug":"\u53C2\u8003\u8D44\u6599","children":[]}],"git":{"createdTime":1659421951000,"updatedTime":1659421951000,"contributors":[{"name":"chanmufeng","email":"zhaoxaolong@163.com","commits":1}]},"readingTime":{"minutes":17.2,"words":5159},"filePathRelative":"posts/storage/MySQL/\u4E00\u6761Update\u8BED\u53E5\u662F\u5982\u4F55\u6267\u884C\u7684.md","localizedDate":"2022\u5E748\u67082\u65E5"}');export{e as data};
