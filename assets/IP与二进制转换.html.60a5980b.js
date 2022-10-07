import{_ as t}from"./plugin-vue_export-helper.21dcd24c.js";import{o as e,c as o,a as s,b as p,e as c,d as n,r as i}from"./app.9fa542ef.js";const l={},u=c(`<p>\u4E0D\u5F97\u4E0D\u8BF4\uFF0C\u6211\u4EEC\u771F\u7684\u5F88\u5E78\u8FD0\uFF0C\u5982\u4ECA\u5DF2\u7ECF\u6709\u4E86\u5F88\u591A\u51FD\u6570\u53EF\u4EE5\u8BA9\u6211\u4EEC\u64CD\u4F5CIP\u5730\u5740\uFF0C\u800C\u4E0D\u9700\u8981\u6211\u4EEC\u81EA\u5DF1\u7528<code>long</code>\u7C7B\u578B\u6570\u636E\u4EE5\u53CA<code>&lt;&lt;</code>\u8FD0\u7B97\u7B26\u6765\u5904\u7406\u5B83\u4EEC\u3002</p><p>\u5047\u5982\u4F60\u58F0\u660E\u4E86\u4E00\u4E2A\u6570\u636E\u7ED3\u6784<code>struct sockaddr_in ina</code>\uFF0C\u4F60\u8FD8\u6709\u4E00\u4E2A\u201C<code>10.12.110.57</code>\u201D\u6216\u201C<code>2001:db8:63b3:1::3490</code>\u201D\u8FD9\u6837\u7684IP\u5730\u5740\uFF0C\u8BE5\u600E\u4E48\u628AIP\u5730\u5740\u5B58\u5165<code>ina</code>\u5462\u3002</p><h2 id="ip\u8F6C\u4E8C\u8FDB\u5236" tabindex="-1"><a class="header-anchor" href="#ip\u8F6C\u4E8C\u8FDB\u5236" aria-hidden="true">#</a> IP\u8F6C\u4E8C\u8FDB\u5236</h2><p>\u4F60\u53EF\u4EE5\u4F7F\u7528<code>inet_pton()</code>\u5C06\u70B9\u5206\u5341\u8FDB\u5236\u5F62\u5F0F\u7684IPv4\u5730\u5740\u4FDD\u5B58\u5728<code>ina</code>\u4E2D\uFF0C\u4F46\u5982\u679C\u8981\u4FDD\u5B58IPv6\u5730\u5740\u7684\u8BDD\uFF0C\u6211\u4EEC\u5C31\u9700\u8981<code>struct sockaddr_in6 ina6</code>\u4E86\u3002</p><blockquote><p>\u201C<code>pton</code>\u201D\u7684\u5168\u79F0\u662F\u201Cpresentation to network\u201D\uFF0C\u4E5F\u53EF\u4EE5\u662F\u201Cprintable to network\u201D\uFF0C\u9009\u4E00\u4E2A\u80FD\u5E2E\u52A9\u4F60\u8BB0\u5FC6\u7684\u5C31\u884C\u3002</p></blockquote><p>\u5177\u4F53\u7684\u8F6C\u6362\u5982\u4E0B\u4EE3\u7801\u6240\u793A\uFF1A</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">sockaddr_in</span> sa<span class="token punctuation">;</span> <span class="token comment">// IPv4</span>
<span class="token keyword">struct</span> <span class="token class-name">sockaddr_in6</span> sa6<span class="token punctuation">;</span> <span class="token comment">// IPv6</span>
    
<span class="token function">inet_pton</span><span class="token punctuation">(</span>AF_INET<span class="token punctuation">,</span> <span class="token string">&quot;10.12.110.57&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token punctuation">(</span>sa<span class="token punctuation">.</span>sin_addr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// IPv4</span>
<span class="token function">inet_pton</span><span class="token punctuation">(</span>AF_INET6<span class="token punctuation">,</span> <span class="token string">&quot;2001:db8:63b3:1::3490&quot;</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token punctuation">(</span>sa6<span class="token punctuation">.</span>sin6_addr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// IPv6</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>\u5C0F\u8BB0\uFF1A\u539F\u672C\u7684\u8001\u65B9\u6CD5\u662F\u4F7F\u7528\u540D\u4E3A<code>inet_addr()</code>\u6216\u662F <code>inet_aton() </code>\u7684\u51FD\u6570\uFF1B\u8FD9\u4E9B\u51FD\u6570\u5DF2\u7ECF\u8FC7\u65F6\u4E86\uFF0C\u800C\u4E14\u4E0D\u9002\u7528\u4E8E IPv6</p></blockquote><p>\u4E0A\u9762\u7684\u7A0B\u5E8F\u5199\u7684\u6BD4\u8F83\u7B80\u5355\uFF0C\u800C\u4E14\u4E0D\u591F\u5065\u58EE\uFF0C\u56E0\u4E3A\u6CA1\u6709\u8FDB\u884C\u9519\u8BEF\u68C0\u67E5\u3002<code>inet_pton() </code>\u5728\u53D1\u751F\u9519\u8BEF\u65F6\u4F1A\u8FD4\u56DE<code>-1</code>\uFF0C\u800C\u82E5\u5730\u5740\u65E0\u6548\u5219\u8FD4\u56DE<code>0</code>\u3002\u6240\u4EE5\u5728\u4F7F\u7528\u4E4B\u524D\u8981\u68C0\u67E5\u8FD4\u56DE\u503C\uFF0C\u5E76\u4FDD\u8BC1\u8FD4\u56DE\u7ED3\u679C\u662F\u5927\u4E8E 0 \u7684\u3002</p><p>\u73B0\u5728\u6211\u4EEC\u53EF\u4EE5\u5C06\u5B57\u7B26\u4E32\u683C\u5F0F\u7684IP\u5730\u5740\u8F6C\u6362\u4E3A\u4E8C\u8FDB\u5236\u5F62\u5F0F\u4E86\u3002\u90A3\u4E48\u53CD\u8FC7\u6765\u9700\u8981\u600E\u4E48\u505A\uFF1F</p><h2 id="\u4E8C\u8FDB\u5236\u8F6Cip" tabindex="-1"><a class="header-anchor" href="#\u4E8C\u8FDB\u5236\u8F6Cip" aria-hidden="true">#</a> \u4E8C\u8FDB\u5236\u8F6CIP</h2><p>\u5982\u679C\u6211\u4EEC\u5DF2\u7ECF\u6709\u4E86<code>struct in_addr</code>\uFF0C\u600E\u4E48\u5C06\u70B9\u5206\u5341\u8FDB\u5236\u7684IP\u6253\u5370\u51FA\u6765\uFF1F\uFF08\u6216\u8005\u6211\u4EEC\u6709<code>struct in6_addr</code>\uFF0C\u600E\u4E48\u6253\u5370\u5B57\u7B26\u4E32\u7C7B\u578B\u7684IPv6\u5730\u5740\u5462\uFF1F\uFF09</p><p>\u6211\u4EEC\u53EF\u4EE5\u4F7F\u7528<code>inet_ntop()</code>\u51FD\u6570\uFF0C\u770B\u4EE3\u7801\uFF1A</p><blockquote><p>\u201C<code>ntop</code>\u201D\u7684\u5168\u79F0\u662F\u201Cnetwork to presentation\u201D\uFF0C\u4E5F\u53EF\u4EE5\u662F\u201Cnetwork to printable\u201D\uFF0C\u9009\u4E00\u4E2A\u80FD\u5E2E\u52A9\u4F60\u8BB0\u5FC6\u7684\u5C31\u884C\u3002</p></blockquote><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token comment">// IPv4:</span>
<span class="token keyword">char</span> ip4<span class="token punctuation">[</span>INET_ADDRSTRLEN<span class="token punctuation">]</span><span class="token punctuation">;</span>  <span class="token comment">// space to hold the IPv4 string</span>
<span class="token keyword">struct</span> <span class="token class-name">sockaddr_in</span> sa<span class="token punctuation">;</span>      <span class="token comment">// \u5047\u8BBEsa\u4E2D\u4FDD\u5B58\u4E86ip\u4FE1\u606F</span>
<span class="token function">inet_ntop</span><span class="token punctuation">(</span>AF_INET<span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token punctuation">(</span>sa<span class="token punctuation">.</span>sin_addr<span class="token punctuation">)</span><span class="token punctuation">,</span> ip4<span class="token punctuation">,</span> INET_ADDRSTRLEN<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;The IPv4 address is: %s\\n&quot;</span><span class="token punctuation">,</span> ip4<span class="token punctuation">)</span><span class="token punctuation">;</span>


<span class="token comment">// IPv6:</span>
<span class="token keyword">char</span> ip6<span class="token punctuation">[</span>INET6_ADDRSTRLEN<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// space to hold the IPv6 string</span>
<span class="token keyword">struct</span> <span class="token class-name">sockaddr_in6</span> sa6<span class="token punctuation">;</span>    <span class="token comment">// \u5047\u8BBEsa6\u79CD\u4FDD\u5B58\u4E86ip\u4FE1\u606F</span>
<span class="token function">inet_ntop</span><span class="token punctuation">(</span>AF_INET6<span class="token punctuation">,</span> <span class="token operator">&amp;</span><span class="token punctuation">(</span>sa6<span class="token punctuation">.</span>sin6_addr<span class="token punctuation">)</span><span class="token punctuation">,</span> ip6<span class="token punctuation">,</span> INET6_ADDRSTRLEN<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;The address is: %s\\n&quot;</span><span class="token punctuation">,</span> ip6<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u5F53\u6211\u4EEC\u8C03\u7528<code>inet_ntop()</code>\uFF0C\u4F60\u9700\u8981\u4F20\u9012IP\u5730\u5740\u7C7B\u578B\uFF08IPv4 \u6216\u8005 IPv6\uFF09\uFF0C\u4E00\u4E2A\u6307\u5411\u4FDD\u5B58\u5B57\u7B26\u4E32\u7ED3\u679C\u7684\u6307\u9488\u4EE5\u53CA\u8BE5\u5B57\u7B26\u4E32\u7684\u6700\u5927\u957F\u5EA6\u3002\u6709\u4E24\u4E2A\u5B8F\uFF08\u53EF\u4EE5\u7406\u89E3\u4E3A\u5E38\u91CF\uFF09\u53EF\u4EE5\u5F88\u65B9\u4FBF\u5730\u5E2E\u52A9\u6211\u4EEC\u8868\u793A\u8981\u5B58\u50A8\u7684IPv4\u6216\u8005IPv6\u5730\u5740\u5B57\u7B26\u4E32\u7684\u6700\u5927\u957F\u5EA6\uFF0C\u5206\u522B\u662F<code>INET_ADDRSTRLEN</code> \u548C <code>INET6_ADDRSTRLEN</code>\u3002</p><blockquote><p>\u5C0F\u8BB0\uFF1A\u539F\u672C\u7684\u8001\u65B9\u6CD5\u662F\u4F7F\u7528\u540D\u4E3A<code>inet_ntoa()</code>\u7684\u51FD\u6570\uFF0C\u8FD9\u4E2A\u51FD\u6570\u5DF2\u7ECF\u8FC7\u65F6\u4E86\uFF0C\u800C\u4E14\u4E0D\u9002\u7528\u4E8E IPv6</p></blockquote>`,17),d=n("\u6700\u540E\uFF0C\u672C\u6587\u8BB2\u5230\u7684\u51FD\u6570\u53EA\u80FD\u7528\u4E8E\u6570\u503C\u578B\u7684IP\u5730\u5740\u4E0A\uFF0C\u5B83\u4EEC\u4E0D\u4F1A\u7528DNS\u505A\u57DF\u540D\u89E3\u6790\uFF0C\u6240\u4EE5\u4F60\u4F20\u5165\u201C"),r={href:"http://www.example.com",target:"_blank",rel:"noopener noreferrer"},k=n("www.example.com"),_=n("\u201D\u8FD9\u6837\u7684\u57DF\u540D\u662F\u6CA1\u6709\u7528\u7684\u3002"),m=s("p",null,[n("\u5173\u4E8E\u57DF\u540D\u67E5\u8BE2\uFF0C\u6211\u4EEC\u5C06\u4F1A\u4F7F\u7528"),s("code",null,"getaddrinfo()"),n("\u51FD\u6570\uFF0C\u4E4B\u524D\u7684\u6587\u7AE0\u63D0\u8FC7\u4E00\u5634\uFF0C\u540E\u6587\u5C06\u4F1A\u8BE6\u7EC6\u8BB2\u8FF0\uFF0C\u656C\u8BF7\u671F\u5F85\u3002")],-1);function v(I,b){const a=i("ExternalLinkIcon");return e(),o("div",null,[u,s("p",null,[d,s("a",r,[k,p(a)]),_]),m])}var f=t(l,[["render",v],["__file","IP\u4E0E\u4E8C\u8FDB\u5236\u8F6C\u6362.html.vue"]]);export{f as default};
