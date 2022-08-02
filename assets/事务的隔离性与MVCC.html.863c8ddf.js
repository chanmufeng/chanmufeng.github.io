const e=JSON.parse('{"key":"v-308e392a","path":"/posts/storage/MySQL/%E4%BA%8B%E5%8A%A1%E7%9A%84%E9%9A%94%E7%A6%BB%E6%80%A7%E4%B8%8EMVCC.html","title":"\u4E8B\u52A1\u7684\u9694\u79BB\u6027\u4E0EMVCC","lang":"zh-CN","frontmatter":{"title":"\u4E8B\u52A1\u7684\u9694\u79BB\u6027\u4E0EMVCC","index":false,"icon":"creative","category":["MySQL"],"summary":"\u63D0\u5230\u6570\u636E\u5E93\uFF0C\u4F60\u591A\u534A\u4F1A\u8054\u60F3\u5230\u4E8B\u52A1\uFF0C\u8FDB\u800C\u8FD8\u53EF\u80FD\u60F3\u8D77\u66FE\u7ECF\u80CC\u5F97\u6EDA\u74DC\u4E71\u719F\u7684ACID\uFF0C\u4E0D\u77E5\u9053\u4F60\u6709\u6CA1\u6709\u60F3\u8FC7\u8FD9\u4E2A\u95EE\u9898\uFF0C\u4E8B\u52A1\u6709\u539F\u5B50\u6027\u3001\u9694\u79BB\u6027\u3001\u4E00\u81F4\u6027\u548C\u6301\u4E45\u6027\u56DB\u5927\u7279\u6027\uFF0C\u4E3A\u4EC0\u4E48\u504F\u504F\u7ED9\u9694\u79BB\u6027\u8BBE\u7F6E\u4E86\u7EA7\u522B\uFF1F \u4E00\u5207\u8FD8\u5F97\u4ECE\u4E8B\u52A1\u8BF4\u8D77\u3002 1. \u4E8B\u52A1\uFF08transaction\uFF09\u7684\u8D77\u6E90 \u5B66\u4E60\u6570\u636E\u5E93\u4E8B\u52A1\u7684\u65F6\u5019\uFF0C\u4E00\u4E2A\u5178\u578B\u7684\u6848\u4F8B\u5C31\u662F\u300C\u8F6C\u8D26\u300D\uFF0C\u8FD9\u7BC7\u6587\u7AE0\u4E5F\u4E0D\u80FD\u514D\u4FD7\uFF0C\u6545\u4E8B\u5C31\u4ECE\u62DB\u8D22\u5411\u9640\u87BA\u501F100\u5757\u94B1\u5F00\u59CB\u5427\u3002 \u4E00\u4E2A","head":[["meta",{"property":"og:url","content":"https://www.chanmufeng.com/posts/storage/MySQL/%E4%BA%8B%E5%8A%A1%E7%9A%84%E9%9A%94%E7%A6%BB%E6%80%A7%E4%B8%8EMVCC.html"}],["meta",{"property":"og:site_name","content":"\u8749\u6C90\u98CE"}],["meta",{"property":"og:title","content":"\u4E8B\u52A1\u7684\u9694\u79BB\u6027\u4E0EMVCC"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-08-02T06:32:31.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:modified_time","content":"2022-08-02T06:32:31.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"1. \u4E8B\u52A1\uFF08transaction\uFF09\u7684\u8D77\u6E90","slug":"_1-\u4E8B\u52A1-transaction-\u7684\u8D77\u6E90","children":[{"level":3,"title":"1.1. \u4E8B\u52A1\u7684\u5B9A\u4E49","slug":"_1-1-\u4E8B\u52A1\u7684\u5B9A\u4E49","children":[]},{"level":3,"title":"1.2. \u54EA\u4E9B\u5B58\u50A8\u5F15\u64CE\u652F\u6301\u4E8B\u52A1","slug":"_1-2-\u54EA\u4E9B\u5B58\u50A8\u5F15\u64CE\u652F\u6301\u4E8B\u52A1","children":[]}]},{"level":2,"title":"2. MySQL\u7684\u4E8B\u52A1\u8BED\u6CD5","slug":"_2-mysql\u7684\u4E8B\u52A1\u8BED\u6CD5","children":[{"level":3,"title":"2.1. \u81EA\u52A8\u63D0\u4EA4","slug":"_2-1-\u81EA\u52A8\u63D0\u4EA4","children":[]},{"level":3,"title":"2.2. \u624B\u52A8\u64CD\u4F5C\u4E8B\u52A1","slug":"_2-2-\u624B\u52A8\u64CD\u4F5C\u4E8B\u52A1","children":[]},{"level":3,"title":"2.3. autocommit\u7CFB\u7EDF\u53D8\u91CF","slug":"_2-3-autocommit\u7CFB\u7EDF\u53D8\u91CF","children":[]}]},{"level":2,"title":"3. \u4E8B\u52A1\u5E76\u53D1\u6267\u884C\u5BFC\u81F4\u7684\u8BFB\u95EE\u9898","slug":"_3-\u4E8B\u52A1\u5E76\u53D1\u6267\u884C\u5BFC\u81F4\u7684\u8BFB\u95EE\u9898","children":[{"level":3,"title":"3.1. \u810F\u8BFB","slug":"_3-1-\u810F\u8BFB","children":[]},{"level":3,"title":"3.2. \u4E0D\u53EF\u91CD\u590D\u8BFB","slug":"_3-2-\u4E0D\u53EF\u91CD\u590D\u8BFB","children":[]},{"level":3,"title":"3.3. \u5E7B\u8BFB","slug":"_3-3-\u5E7B\u8BFB","children":[]}]},{"level":2,"title":"4. \u56DE\u7B54\u4E00\u4E9B\u53EF\u80FD\u5B58\u5728\u7684\u95EE\u9898","slug":"_4-\u56DE\u7B54\u4E00\u4E9B\u53EF\u80FD\u5B58\u5728\u7684\u95EE\u9898","children":[]},{"level":2,"title":"5. SQL\u6807\u51C6\u4E0E4\u79CD\u9694\u79BB\u7EA7\u522B","slug":"_5-sql\u6807\u51C6\u4E0E4\u79CD\u9694\u79BB\u7EA7\u522B","children":[{"level":3,"title":"5.1. \u4E3A\u4EC0\u4E48\u8981\u8BBE\u7F6E\u9694\u79BB\u7EA7\u522B\uFF1F","slug":"_5-1-\u4E3A\u4EC0\u4E48\u8981\u8BBE\u7F6E\u9694\u79BB\u7EA7\u522B","children":[]},{"level":3,"title":"5.2. \u8E69\u811A\u7684\u4E2D\u6587\u7FFB\u8BD1","slug":"_5-2-\u8E69\u811A\u7684\u4E2D\u6587\u7FFB\u8BD1","children":[]},{"level":3,"title":"5.3. \u4E3A\u4EC0\u4E48\u5355\u5355\u7ED9\u9694\u79BB\u6027\u8BBE\u7F6E\u4E86\u7EA7\u522B\uFF1F","slug":"_5-3-\u4E3A\u4EC0\u4E48\u5355\u5355\u7ED9\u9694\u79BB\u6027\u8BBE\u7F6E\u4E86\u7EA7\u522B","children":[]}]},{"level":2,"title":"6. MySQL\u652F\u6301\u76844\u79CD\u9694\u79BB\u7EA7\u522B","slug":"_6-mysql\u652F\u6301\u76844\u79CD\u9694\u79BB\u7EA7\u522B","children":[]},{"level":2,"title":"7. \u518D\u804A\u884C\u683C\u5F0F","slug":"_7-\u518D\u804A\u884C\u683C\u5F0F","children":[{"level":3,"title":"7.1. \u7B80\u6613\u7248\u884C\u683C\u5F0F","slug":"_7-1-\u7B80\u6613\u7248\u884C\u683C\u5F0F","children":[]},{"level":3,"title":"7.2. \u5206\u914D\u4E8B\u52A1id\u7684\u65F6\u673A","slug":"_7-2-\u5206\u914D\u4E8B\u52A1id\u7684\u65F6\u673A","children":[]}]},{"level":2,"title":"8. MVCC\u767B\u573A","slug":"_8-mvcc\u767B\u573A","children":[{"level":3,"title":"8.1. \u7248\u672C\u94FE","slug":"_8-1-\u7248\u672C\u94FE","children":[]},{"level":3,"title":"8.2. ReadView","slug":"_8-2-readview","children":[]}]}],"git":{"createdTime":1659421951000,"updatedTime":1659421951000,"contributors":[{"name":"chanmufeng","email":"zhaoxaolong@163.com","commits":1}]},"readingTime":{"minutes":31.78,"words":9534},"filePathRelative":"posts/storage/MySQL/\u4E8B\u52A1\u7684\u9694\u79BB\u6027\u4E0EMVCC.md","localizedDate":"2022\u5E748\u67082\u65E5"}');export{e as data};
