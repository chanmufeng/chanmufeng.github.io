import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";import{o as s,c as a,e}from"./app.b10ce930.js";const o={},t=e(`<p>\u5F53\u4F60\u521B\u5EFA\u4E86socket\u4E4B\u540E\uFF0C\u4F60\u4F1A\u60F3\u8981\u628A\u8FD9\u4E2Asocket\u548C\u4F60\u672C\u673A\u4E0A\u7684\u67D0\u4E2A\u7AEF\u53E3\u53F7\uFF08port\uFF09\u8FDB\u884C\u5173\u8054\u3002</p><p>\u7AEF\u53E3\u53F7\u662F\u5185\u6838\u7528\u6765\u786E\u8BA4\u5C06\u6536\u5230\u7684\u6570\u636E\u5305\u4EA4\u7ED9\u54EA\u4E2A\u5177\u4F53\u8FDB\u7A0B\u7684<code>socket descriptor</code>\u7684\u4F9D\u636E\u3002</p><blockquote><p>\u901A\u5E38\u5728\u5199\u670D\u52A1\u7AEF\u7A0B\u5E8F\u7684\u65F6\u5019\u6211\u4EEC\u624D\u9700\u8981\u8FDB\u884C\u5173\u8054\uFF0C\u5BA2\u6237\u7AEF\u7A0B\u5E8F\u4E0D\u9700\u8981\u6211\u4EEC\u624B\u52A8\u7ED1\u5B9A\u7AEF\u53E3\uFF0C\u76F4\u63A5<code>connect()</code>\u5C31\u597D\u4E86\u3002</p></blockquote><p>\u6765\u770B\u770B\u7AEF\u53E3\u53F7\u5177\u4F53\u662F\u600E\u4E48\u7ED1\u5B9A\u7684\u5427\uFF1A</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;sys/types.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;sys/socket.h&gt;</span></span>

<span class="token keyword">int</span> <span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">int</span> sockfd<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">sockaddr</span> <span class="token operator">*</span>my_addr<span class="token punctuation">,</span> <span class="token keyword">int</span> addrlen<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>sockfd</code>\u662F<code>socket()</code>\u8FD4\u56DE\u7684\u4E00\u4E2A<code>socket file descriptor</code>\uFF1B<code>my_addr</code>\u662F\u4E00\u4E2A\u6307\u5411\u5305\u542B\u4E86\u4F60\u7684\u7AEF\u53E3\u53F7\u548CIP\u5730\u5740\u4FE1\u606F\u7684<code>struct sockaddr</code>\u6307\u9488\uFF1B<code>addrlen</code>\u662F\u4EE5\u5B57\u8282\u4E3A\u5355\u4F4D\u7684\u5730\u5740\u957F\u5EA6\u3002</p><p>\u63A5\u4E0B\u6765\uFF0C\u6211\u4EEC\u7ED9\u51FA\u4E00\u4E2A\u4F8B\u5B50\uFF0C\u5B83\u5C06socket\u548C\u6211\u672C\u673A\u7684<code>3490</code>\u7AEF\u53E3\u8FDB\u884C\u7ED1\u5B9A\uFF1A</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">addrinfo</span> hints<span class="token punctuation">,</span> <span class="token operator">*</span>res<span class="token punctuation">;</span>
<span class="token keyword">int</span> sockfd<span class="token punctuation">;</span>

<span class="token comment">// first, load up address structs with getaddrinfo():</span>

<span class="token function">memset</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>hints<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">sizeof</span> hints<span class="token punctuation">)</span><span class="token punctuation">;</span>
hints<span class="token punctuation">.</span>ai_family <span class="token operator">=</span> AF_UNSPEC<span class="token punctuation">;</span>  <span class="token comment">// use IPv4 or IPv6, whichever</span>
hints<span class="token punctuation">.</span>ai_socktype <span class="token operator">=</span> SOCK_STREAM<span class="token punctuation">;</span>
hints<span class="token punctuation">.</span>ai_flags <span class="token operator">=</span> AI_PASSIVE<span class="token punctuation">;</span>     <span class="token comment">// fill in my IP for me</span>

<span class="token function">getaddrinfo</span><span class="token punctuation">(</span><span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token string">&quot;3490&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>hints<span class="token punctuation">,</span> <span class="token operator">&amp;</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// make a socket:</span>

sockfd <span class="token operator">=</span> <span class="token function">socket</span><span class="token punctuation">(</span>res<span class="token operator">-&gt;</span>ai_family<span class="token punctuation">,</span> res<span class="token operator">-&gt;</span>ai_socktype<span class="token punctuation">,</span> res<span class="token operator">-&gt;</span>ai_protocol<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// bind it to the port we passed in to getaddrinfo():</span>

<span class="token function">bind</span><span class="token punctuation">(</span>sockfd<span class="token punctuation">,</span> res<span class="token operator">-&gt;</span>ai_addr<span class="token punctuation">,</span> res<span class="token operator">-&gt;</span>ai_addrlen<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u901A\u8FC7\u4F7F\u7528<code>AI_PASSIVE</code>\u6807\u8BC6\uFF0C\u7A0B\u5E8F\u4F1A\u81EA\u52A8\u7ED1\u5B9A\u5B83\u6240\u5728\u7684\u7A0B\u5E8F\u7684IP\u3002\u5982\u679C\u4F60\u60F3\u7CBE\u786E\u7ED1\u5B9A\u5230\u672C\u673A\u7684\u67D0\u4E00\u4E2AIP\u5730\u5740\uFF0C\u4F60\u5C31\u4E0D\u80FD\u7528<code>AI_PASSIVE</code>\u4E86\uFF0C\u800C\u4E14\u4F60\u8FD8\u5F97\u628A<code>getaddrinfo()</code>\u7684\u7B2C\u4E00\u4E2A\u53C2\u6570\u4ECE<code>NULL</code>\u6539\u4E3A\u4F60\u60F3\u7ED1\u5B9A\u7684\u90A3\u4E2AIP\u5730\u5740\u3002</p><p><code>bind()</code>\u548C\u5176\u4ED6\u7CFB\u7EDF\u8C03\u7528\u4E00\u6837\uFF0C\u53D1\u751F\u9519\u8BEF\u7684\u65F6\u5019\u8FD4\u56DE<code>-1</code>\uFF0C\u5E76\u4E14\u4F1A\u8BBE\u7F6E\u5168\u5C40\u53D8\u91CF<code>errno</code>\u7684\u503C\u3002</p><p>\u5F88\u591A\u8001\u4EE3\u7801\u90FD\u4F1A\u5728\u8C03\u7528<code>bind()</code>\u4E4B\u524D\u624B\u52A8\u5C01\u88C5 <code>struct sockaddr_in</code> \u3002\u5F53\u7136\uFF0C\u8FD9\u91CC\u7ED1\u5B9A\u7684\u80AF\u5B9A\u662FIPv4\u7684\u5730\u5740\uFF0C\u5982\u679C\u4F60\u60F3\u4F7F\u7528IPv6\uFF0C\u4F60\u7167\u6837\u53EF\u4EE5\u624B\u52A8\u5C01\u88C5<code>struct sockaddr_in6</code> \uFF0C\u4F46\u662F\u6781\u529B\u4E0D\u63A8\u8350\u4F60\u8FD9\u4E48\u505A\u3002\u4F60\u8FD8\u662F\u5E94\u8BE5\u8001\u8001\u5B9E\u5B9E\u7528 <code>getaddrinfo()</code> \uFF0C\u8FD9\u6837\u66F4\u4F18\u96C5\u3001\u66F4\u7B80\u5355\u3002</p><p>\u7ED9\u4F60\u770B\u770B\u8001\u4EE3\u7801\u957F\u4EC0\u4E48\u6837\u5B50\u5427\uFF1A</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token comment">// !!! THIS IS THE OLD WAY !!!</span>

<span class="token keyword">int</span> sockfd<span class="token punctuation">;</span>
<span class="token keyword">struct</span> <span class="token class-name">sockaddr_in</span> my_addr<span class="token punctuation">;</span>

sockfd <span class="token operator">=</span> <span class="token function">socket</span><span class="token punctuation">(</span>PF_INET<span class="token punctuation">,</span> SOCK_STREAM<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

my_addr<span class="token punctuation">.</span>sin_family <span class="token operator">=</span> AF_INET<span class="token punctuation">;</span>
my_addr<span class="token punctuation">.</span>sin_port <span class="token operator">=</span> <span class="token function">htons</span><span class="token punctuation">(</span>MYPORT<span class="token punctuation">)</span><span class="token punctuation">;</span>     <span class="token comment">// short, network byte order</span>
my_addr<span class="token punctuation">.</span>sin_addr<span class="token punctuation">.</span>s_addr <span class="token operator">=</span> <span class="token function">inet_addr</span><span class="token punctuation">(</span><span class="token string">&quot;10.12.110.57&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">memset</span><span class="token punctuation">(</span>my_addr<span class="token punctuation">.</span>sin_zero<span class="token punctuation">,</span> <span class="token char">&#39;\\0&#39;</span><span class="token punctuation">,</span> <span class="token keyword">sizeof</span> my_addr<span class="token punctuation">.</span>sin_zero<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">bind</span><span class="token punctuation">(</span>sockfd<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">sockaddr</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token operator">&amp;</span>my_addr<span class="token punctuation">,</span> <span class="token keyword">sizeof</span> my_addr<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4E0A\u9762\u8FD9\u4E2A\u4EE3\u7801\u4E2D\uFF0C\u4F60\u4F9D\u7136\u53EF\u4EE5\u628A<code>my_addr.sin_addr.s_addr</code>\u8BBE\u7F6E\u4E3A <code>INADDR_ANY</code> \uFF0C\u5B83\u7684\u4F5C\u7528\u4E0A\u6587\u63D0\u5230\u7684<code>AI_PASSIVE</code>\u4E00\u6837\uFF0C\u90FD\u4F1A\u8BA9\u4EE3\u7801\u81EA\u52A8\u7ED1\u5B9A\u5230\u672C\u673AIP\u3002 <code>INADDR_ANY</code> \u7684IPv6\u7248\u672C\u662F\u4E00\u4E2A\u5168\u5C40\u53D8\u91CF\uFF0C\u53EB<code>in6addr_any</code>\uFF0C\u8FD9\u4E2A\u53D8\u91CF\u4F1A\u88AB\u6307\u5B9A\u7ED9\u4F60\u7684 <code>struct sockaddr_in6</code> \u7684<code>sin6_addr</code>\u5B57\u6BB5\u3002</p><blockquote><p>\u4F60\u4E5F\u53EF\u4EE5\u4F7F\u7528<code>IN6ADDR_ANY_INIT</code>\u8FD9\u4E2A\u5B8F\u6765\u521D\u59CB\u5316\u53D8\u91CF</p></blockquote><p>\u8C03\u7528<code>bind()</code>\u65F6\u6709\u4E00\u4EF6\u4E8B\u9700\u8981\u4F60\u7279\u522B\u6CE8\u610F\uFF1A\u4E0D\u8981\u4F7F\u7528<code>1024</code>\u4EE5\u4E0B\u7684\u7AEF\u53E3\u53F7\uFF0C\u56E0\u4E3A\u8FD9\u4E9B\u7AEF\u53E3\u53F7\u662F\u88AB\u4FDD\u7559\u4F7F\u7528\u7684\uFF0C\u9664\u975E\u4F60\u662F\u8D85\u7EA7\u7BA1\u7406\u5458\u3002\u9664\u4E86<code>1024</code>\u4EE5\u4E0B\u7684\uFF0C<code>1025\uFF5E65535</code>\u4E4B\u95F4\u7684\u968F\u4FBF\u7528\uFF08\u5176\u4ED6\u7A0B\u5E8F\u5360\u7528\u7684\u9664\u5916\uFF09\u3002</p><p>\u6709\u65F6\u5019\uFF0C\u4F60\u660E\u660E\u91CD\u65B0\u8FD0\u884C\u4E86\u4F60\u7684\u670D\u52A1\u7AEF\u7A0B\u5E8F\uFF0C\u4F46\u662F<code>bind()</code>\u62A5\u9519\u4E86\uFF0C\u63D0\u793A\u4F60\u201CAddress already in use\u201D\u3002\u8FD9\u662F\u4E3A\u4EC0\u4E48\uFF1F\u7406\u8BBA\u4E0A\u91CD\u542F\u4E4B\u540E\u7AEF\u53E3\u5C31\u4F1A\u88AB\u91CA\u653E\u554A\uFF01\u597D\u5427\uFF0C\u8FD9\u662F\u56E0\u4E3A\u6709\u4E00\u4E9B\u8FDE\u63A5\u5230socket\u7684\u8FDE\u63A5\u8FD8\u60AC\u5728\u5185\u6838\u4E2D\uFF0C\u5C31\u662F\u5B83\u4EEC\u5360\u7528\u4E86\u8FD9\u4E2A\u7AEF\u53E3\u53F7\u3002\u4F60\u53EF\u4EE5\u7B49\u4E00\u5206\u949F\u5DE6\u53F3\u8BA9\u5B83\u4EEC\u81EA\u884C\u6D88\u5931\uFF0C\u6216\u8005\u5728\u4F60\u7684\u4EE3\u7801\u52A0\u8FD9\u4E48\u51E0\u884C\uFF1A</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">int</span> yes<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">//char yes=&#39;1&#39;; // Solaris people use this</span>

<span class="token comment">// lose the pesky &quot;Address already in use&quot; error message</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">setsockopt</span><span class="token punctuation">(</span>listener<span class="token punctuation">,</span>SOL_SOCKET<span class="token punctuation">,</span>SO_REUSEADDR<span class="token punctuation">,</span><span class="token operator">&amp;</span>yes<span class="token punctuation">,</span><span class="token keyword">sizeof</span> yes<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">perror</span><span class="token punctuation">(</span><span class="token string">&quot;setsockopt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u8FD9\u6837\u5C31\u4E0D\u4F1A\u518D\u51FA\u73B0\u7AEF\u53E3\u88AB\u5360\u7528\u7684\u95EE\u9898\u4E86\u3002</p>`,19),p=[t];function c(i,l){return s(),a("div",null,p)}var r=n(o,[["render",c],["__file","bind.html.vue"]]);export{r as default};
