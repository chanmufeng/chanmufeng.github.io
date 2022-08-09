import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";import{o as s,c as a,e}from"./app.339ecc68.js";const i={},c=e(`<p>Redis\u4E4B\u6240\u4EE5\u5FEB\uFF0C\u4E00\u4E2A\u6700\u91CD\u8981\u7684\u539F\u56E0\u5728\u4E8E\u5B83\u662F\u76F4\u63A5\u5C06\u6570\u636E\u5B58\u50A8\u5728\u5185\u5B58\uFF0C\u5E76\u76F4\u63A5\u4ECE\u5185\u5B58\u4E2D\u8BFB\u53D6\u6570\u636E\u7684\uFF0C\u56E0\u6B64\u4E00\u4E2A\u7EDD\u5BF9\u4E0D\u5BB9\u5FFD\u89C6\u7684\u95EE\u9898\u4FBF\u662F\uFF0C\u4E00\u65E6Redis\u670D\u52A1\u5668\u5B95\u673A\uFF0C\u5185\u5B58\u4E2D\u7684\u6570\u636E\u5C06\u4F1A\u5B8C\u5168\u4E22\u5931\u3002</p><p>\u597D\u5728Redis\u5B98\u65B9\u4E3A\u6211\u4EEC\u63D0\u4F9B\u4E86\u4E24\u79CD\u6301\u4E45\u5316\u7684\u673A\u5236\uFF0CRDB\u548CAOF\uFF0C\u4ECA\u5929\u6211\u4EEC\u6765\u804A\u4E00\u4E0BRDB\u3002 <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637494078512-0574d33a-0301-43e6-b5e1-c469513a5506.png" alt="image.png" loading="lazy"></p><h2 id="\u4EC0\u4E48\u662Frdb" tabindex="-1"><a class="header-anchor" href="#\u4EC0\u4E48\u662Frdb" aria-hidden="true">#</a> \u4EC0\u4E48\u662FRDB</h2><p>RDB\u662FRedis\u7684\u4E00\u79CD\u6570\u636E\u6301\u4E45\u5316\u5230\u78C1\u76D8\u7684\u7B56\u7565\uFF0C\u662F\u4E00\u79CD\u4EE5\u5185\u5B58\u5FEB\u7167\u5F62\u5F0F\u4FDD\u5B58Redis\u6570\u636E\u7684\u65B9\u5F0F\u3002\u6240\u8C13\u5FEB\u7167\uFF0C\u5C31\u662F\u628A<strong>\u67D0\u4E00\u65F6\u523B\u7684\u72B6\u6001</strong>\u4EE5\u6587\u4EF6\u7684\u5F62\u5F0F\u8FDB\u884C<strong>\u5168\u91CF\u5907\u4EFD</strong>\u5230\u78C1\u76D8\uFF0C\u8FD9\u4E2A\u5FEB\u7167\u6587\u4EF6\u5C31\u79F0\u4E3ARDB\u6587\u4EF6\uFF0C\u5176\u4E2DRDB\u662FRedis DataBase\u7684\u7F29\u5199\u3002 <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637907145514-f0dd6c1f-6132-4ff7-8e80-4fae241108c4.png" alt="image.png" loading="lazy"></p><h2 id="\u5168\u91CF\u5907\u4EFD\u5E26\u6765\u7684\u601D\u8003" tabindex="-1"><a class="header-anchor" href="#\u5168\u91CF\u5907\u4EFD\u5E26\u6765\u7684\u601D\u8003" aria-hidden="true">#</a> \u5168\u91CF\u5907\u4EFD\u5E26\u6765\u7684\u601D\u8003</h2><h3 id="\u5907\u4EFD\u4F1A\u4E0D\u4F1A\u963B\u585E\u4E3B\u7EBF\u7A0B" tabindex="-1"><a class="header-anchor" href="#\u5907\u4EFD\u4F1A\u4E0D\u4F1A\u963B\u585E\u4E3B\u7EBF\u7A0B" aria-hidden="true">#</a> \u5907\u4EFD\u4F1A\u4E0D\u4F1A\u963B\u585E\u4E3B\u7EBF\u7A0B</h3><p>\u6211\u4EEC\u77E5\u9053Redis\u4E3A\u6240\u6709\u5BA2\u6237\u7AEF\u5904\u7406\u6570\u636E\u65F6\u4F7F\u7528\u7684\u662F\u5355\u7EBF\u7A0B\uFF0C\u8FD9\u4E2A\u6A21\u578B\u5C31\u51B3\u5B9A\u4E86\u4F7F\u7528\u8005\u9700\u8981\u5C3D\u91CF\u907F\u514D\u8FDB\u884C\u4F1A\u963B\u585E\u4E3B\u7EBF\u7A0B\u7684\u64CD\u4F5C\u3002\u90A3\u4E48Redis\u5728\u751F\u6210RDB\u6587\u4EF6\u7684\u65F6\u5019\uFF0C\u4F1A\u4E0D\u4F1A\u963B\u585E\u4E3B\u7EBF\u7A0B\u5462\uFF1F</p><p>\u5BF9\u6B64\uFF0CRedis\u63D0\u4F9B\u4E86\u4E24\u4E2A\u547D\u4EE4\u6765\u751F\u6210RDB\uFF0C\u4E00\u4E2A<code>SAVE</code>\uFF0C\u53E6\u4E00\u4E2A\u662F<code>BGSAVE</code>\u3002 <code>SAVE</code>\u547D\u4EE4\u4F1A\u963B\u585ERedis\u7684\u4E3B\u7EBF\u7A0B\uFF0C\u76F4\u5230RDB\u6587\u4EF6\u521B\u5EFA\u5B8C\u6210\u4E3A\u6B62\uFF0C\u5728\u6B64\u671F\u95F4\uFF0CRedis\u4E0D\u80FD\u5904\u7406\u5BA2\u6237\u7AEF\u7684\u4EFB\u4F55\u8BF7\u6C42\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> SAVE
OK
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4E0E<code>SAVE</code>\u76F4\u63A5\u963B\u585E\u4E3B\u7EBF\u7A0B\u7684\u505A\u6CD5\u4E0D\u540C\uFF0C<code>BGSAVE</code>\u547D\u4EE4\u4F1A\u521B\u5EFA\u4E00\u4E2A\u5B50\u8FDB\u7A0B\uFF0C\u7136\u540E\u7531\u5B50\u8FDB\u7A0B\u8D1F\u8D23\u4E13\u95E8\u5199\u5165RDB\uFF0C\u4E3B\u8FDB\u7A0B\uFF08\u7236\u8FDB\u7A0B\uFF09\u7EE7\u7EED\u5904\u7406\u547D\u4EE4\u8BF7\u6C42\uFF0C\u4E0D\u4F1A\u88AB\u963B\u585E\u3002</p><blockquote><p>\u6CE8\uFF1A\u4E3B\u8FDB\u7A0B\u5176\u5B9E\u4F1A\u963B\u585E\u5728fork()\u8FC7\u7A0B\u4E2D\uFF0C\u901A\u5E38\u60C5\u51B5\u4E0B\u8BE5\u6307\u4EE4\u6267\u884C\u7684\u901F\u5EA6\u6BD4\u8F83\u5FEB\uFF0C\u5BF9\u6027\u80FD\u5F71\u54CD\u4E0D\u5927</p></blockquote><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> BGSAVE
Background saving started
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637816189975-ffc92099-2436-4de1-bd1f-78393df59618.png" alt="image.png" loading="lazy"> RDB\u6587\u4EF6\u5B9E\u9645\u662F\u7531<code>rdb.c/rdbSave</code>\u51FD\u6570\u8FDB\u884C\u521B\u5EFA\u7684\uFF0C<code>SAVE</code>\u547D\u4EE4\u548C<code>BGSAVE</code>\u547D\u4EE4\u4F1A\u4EE5\u4E0D\u540C\u7684\u65B9\u5F0F\u8C03\u7528\u8FD9\u4E2A\u51FD\u6570\uFF0C\u4E0B\u9762\u662F\u4E24\u4E2A\u547D\u4EE4\u7684\u4F2A\u4EE3\u7801</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">SAVE</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    # \u521B\u5EFARDB\u6587\u4EF6
    <span class="token function">rdbSave</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">BGSAVE</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    # \u521B\u5EFA\u5B50\u8FDB\u7A0B
    pid <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>pid<span class="token operator">==</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        
        # \u5B50\u8FDB\u7A0B\u521B\u5EFARDB
        <span class="token function">rdbSave</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        # \u521B\u5EFA\u5B8C\u6210\u4E4B\u540E\u5411\u7236\u8FDB\u7A0B\u53D1\u9001\u4FE1\u606F
        <span class="token function">signal_parent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>pid<span class="token operator">&gt;</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        
        # \u7236\u8FDB\u7A0B\uFF08\u4E3B\u7EBF\u7A0B\uFF09\u7EE7\u7EED\u5904\u7406\u5BA2\u6237\u7AEF\u8BF7\u6C42\uFF0C\u5E76\u901A\u8FC7\u8F6E\u8BE2\u7B49\u5F85\u5B50\u8FDB\u7A0B\u7684\u8FD4\u56DE\u4FE1\u53F7
        <span class="token function">handle_request_and_wait_signal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
        
        # \u5904\u7406\u5F02\u5E38
        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="\u5BF9\u65F6\u523B\u5907\u4EFD\u8FD8\u662F\u5BF9\u65F6\u6BB5\u5907\u4EFD" tabindex="-1"><a class="header-anchor" href="#\u5BF9\u65F6\u523B\u5907\u4EFD\u8FD8\u662F\u5BF9\u65F6\u6BB5\u5907\u4EFD" aria-hidden="true">#</a> \u5BF9\u65F6\u523B\u5907\u4EFD\u8FD8\u662F\u5BF9\u65F6\u6BB5\u5907\u4EFD</h3><p>\u73B0\u5728\u6211\u4EEC\u5DF2\u7ECF\u77E5\u9053\u5982\u4F55\u5BF9Redis\u67D0\u4E00\u65F6\u523B\u7684\u72B6\u6001\u8FDB\u884C\u5168\u91CF\u5907\u4EFD\u4E86\uFF0C\u9700\u8981\u91CD\u7533\u7684\u662F\uFF0CRedis\u4FDD\u5B58\u7684\u662F<strong>\u67D0\u4E00\u65F6\u523B\u7684\u5168\u91CF\u6570\u636E\uFF0C\u800C\u4E0D\u662F\u67D0\u4E00\u65F6\u95F4\u6BB5\u5185\u7684\u5168\u91CF\u6570\u636E</strong>\u3002</p><p>\u4E3A\u4EC0\u4E48\u8981\u6267\u7740\u4E8E\u67D0\u4E00\u65F6\u523B\u7684\u6570\u636E\uFF0C\u4E00\u6BB5\u65F6\u95F4\u5185\u7684\u6570\u636E\u4E0D\u884C\u5417\uFF1F\u8FD8\u771F\u5C31\u4E0D\u884C\uFF01\u56E0\u4E3A\u4E00\u4E2A\u65F6\u523B\u7684\u6570\u636E\u53CD\u6620\u4E86\u7CFB\u7EDF\u7684\u8BE5\u65F6\u523B\u7684\u72B6\u6001\u3002 \u4F8B\u5982\u5728<code>t1</code>\u65F6\u523B\uFF0CRedis\u4FDD\u5B58\u7684\u6570\u636E\u72B6\u6001\u4E3A <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637822188793-070aab0b-da9b-48c5-8678-02f97daf2185.png" alt="image.png" loading="lazy"><code>t2</code>\u65F6\u523B\uFF0CRedis\u65F6\u523B\u7684\u72B6\u6001\u4E3A <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637822208265-f6899670-a60b-40ae-bc4e-65a3f06c5679.png" alt="image.png" loading="lazy"> \u5982\u679CRedis\u4FDD\u5B58\u7684\u662F\u4E00\u6BB5\u65F6\u95F4\u5185\u7684\u5168\u91CF\u6570\u636E\uFF0C\u5219\u5728\u8FD9\u4E00\u6BB5\u65F6\u95F4\u5185\uFF0C\u6570\u636E\u6709\u5982\u4E0B\u51E0\u79CD\u53EF\u80FD <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1637823685601-5f242c04-84f0-498b-b56a-5abe50bf7f86.png" alt="image.png" loading="lazy"> \u53EA\u6709\u7B2C\u4E00\u6761\u80FD\u5B8C\u7F8E\u8868\u5F81t1\u65F6\u523B\u7684\u7CFB\u7EDF\u72B6\u6001\uFF0CRedis\u8FDB\u884C\u6570\u636E\u6062\u590D\u65F6\u81F3\u5C11\u80FD\u6062\u590D\u5230<code>t1</code>\u65F6\u523B\u7684\u72B6\u6001\uFF0C<code>t1</code>\u65F6\u523B\u4E4B\u540E\u7684\u6570\u636E\u53EF\u901A\u8FC7\u5176\u4ED6\u65B9\u5F0F\uFF08\u5982\u4E4B\u540E\u4F1A\u4ECB\u7ECD\u5230\u7684\u6301\u4E45\u5316\u7684\u53E6\u4E00\u79CD\u65B9\u5F0F<code>AOF</code>)\u8FDB\u884C\u8865\u5145\uFF0C\u800C\u5176\u4F593\u79CD\u6570\u636E\u5BF9\u6570\u636E\u6062\u590D\u6CA1\u6709\u4EFB\u4F55\u5B9E\u9645\u610F\u4E49\u3002</p><h3 id="\u5907\u4EFD\u8FC7\u7A0B\u4E2D-\u6570\u636E\u80FD\u5426\u4FEE\u6539" tabindex="-1"><a class="header-anchor" href="#\u5907\u4EFD\u8FC7\u7A0B\u4E2D-\u6570\u636E\u80FD\u5426\u4FEE\u6539" aria-hidden="true">#</a> \u5907\u4EFD\u8FC7\u7A0B\u4E2D\uFF0C\u6570\u636E\u80FD\u5426\u4FEE\u6539</h3><p>\u4E3A\u4E86\u5B9E\u73B0\u5907\u4EFD\u67D0\u4E00\u65F6\u523B\u6570\u636E\u7684\u8FD9\u4E2A\u76EE\u7684\uFF0C\u5982\u679C\u662F\u6211\u4EEC\u6765\u8BBE\u8BA1Redis\uFF0C\u6211\u4EEC\u4F1A\u600E\u4E48\u505A\u5462\uFF1F</p><p>\u4E00\u4E2A\u81EA\u7136\u7684\u60F3\u6CD5\u5C31\u662F\u62F7\u8D1D\u67D0\u4E00\u4E2A\u65F6\u523B\u7684Redis\u5B8C\u6574\u5185\u5B58\u6570\u636E\u3002\u8FD9\u91CC\u81EA\u7136\u5C31\u662F\u5B50\u8FDB\u7A0B\u5BF9\u4E3B\u8FDB\u7A0B\u7684\u5185\u5B58\u8FDB\u884C\u5168\u91CF\u62F7\u8D1D\u4E86\uFF0C\u7136\u800C\u8FD9\u5BF9\u4E8ERedis\u670D\u52A1\u51E0\u4E4E\u662F\u707E\u96BE\u6027\u7684\uFF0C\u8003\u8651\u4EE5\u4E0B\u4E24\u4E2A\u573A\u666F\uFF1A</p><ul><li><p>Redis\u4E2D\u5B58\u50A8\u4E86\u5927\u91CF\u6570\u636E\uFF0C<code>fork()</code>\u65F6\u62F7\u8D1D\u5185\u5B58\u6570\u636E\u4F1A\u6D88\u8017\u5927\u91CF\u65F6\u95F4\u548C\u8D44\u6E90\uFF0C\u4F1A\u5BFC\u81F4\u4E3B\u8FDB\u7A0B\u4E00\u6BB5\u65F6\u95F4\u7684\u4E0D\u53EF\u7528</p></li><li><p>Redis\u5360\u7528\u4E8610G\u5185\u5B58\uFF0C\u800C\u5BBF\u4E3B\u673A\u5185\u5B58\u8D44\u6E90\u4E0A\u9650\u4EC5\u670916G\uFF0C\u6B64\u65F6\u65E0\u6CD5\u5BF9Redis\u7684\u6570\u636E\u8FDB\u884C\u6301\u4E45\u5316</p></li></ul><p>\u56E0\u6B64\u5907\u4EFD\u8FC7\u7A0B\u4E2D\u4E0D\u80FD\u8FDB\u884C\u5185\u5B58\u6570\u636E\u7684\u5168\u91CF\u62F7\u8D1D\u3002</p><p>\u63A5\u4E0B\u6765\u6211\u4EEC\u9700\u8981\u5173\u6CE8\u7684\u95EE\u9898\u662F\uFF0C\u5728\u5BF9\u5185\u5B58\u6570\u636E\u8FDB\u884C\u5FEB\u7167\u7684\u8FC7\u7A0B\u4E2D\uFF0C\u6570\u636E\u8FD8\u80FD\u88AB\u4FEE\u6539\u5417\uFF1F\u8FD9\u4E2A\u95EE\u9898\u81F3\u5173\u91CD\u8981\uFF0C\u56E0\u4E3A\u5173\u7CFB\u5230Redis\u5728\u5FEB\u7167\u8FC7\u7A0B\u4E2D\u662F\u5426\u80FD\u6B63\u5E38\u5904\u7406\u5199\u8BF7\u6C42\u3002</p><p>\u4E3E\u4E2A\u4F8B\u5B50\uFF0C\u6211\u4EEC\u5728\u65F6\u523B<code>t</code>\u4E3ARedis\u8FDB\u884C\u5FEB\u7167\uFF0C\u5047\u8BBE\u88AB\u5185\u5B58\u6570\u636E\u91CF\u662F2GB\uFF0C\u78C1\u76D8\u5199\u5165\u5E26\u5BBD\u662F0.2GB/S\uFF0C\u4E0D\u8003\u8651\u5176\u4ED6\u56E0\u7D20\u7684\u60C5\u51B5\u4E0B\uFF0C\u81F3\u5C11\u9700\u898110S\uFF082/0.2=10\uFF09\u624D\u80FD\u5B8C\u5168\u5907\u4EFD\u3002\u5982\u679C\u5728\u65F6\u523B<code>t+5S</code>\u65F6\uFF0C\u5BA2\u6237\u53D1\u9001\u4E86\u4E00\u4E2A\u4FEE\u6539\u76EE\u524D\u672A\u88AB\u5199\u5165\u5185\u5B58\u7684\u6570\u636E<code>A</code>\u7684\u5199\u8BF7\u6C42\uFF0C\u88AB\u6539\u6210\u4E86<code>A&#39;</code>\uFF0C\u5982\u679C\u6B64\u65F6<code>A&#39;</code>\u88AB\u5199\u5165\u78C1\u76D8\uFF0C\u5C31\u4F1A\u7834\u574F\u5FEB\u7167\u7684\u5B8C\u6574\u6027\uFF0C\u56E0\u4E3A\u6211\u4EEC\u671F\u671B\u83B7\u5F97\u67D0\u4E00\u65F6\u523B\u7684\u5168\u91CF\u5907\u4EFD\u3002</p><p>\u56E0\u6B64\uFF0C\u5FEB\u7167\u8FC7\u7A0B\u4E2D\u6211\u4EEC\u4E0D\u5E0C\u671B\u6709\u6570\u636E\u4FEE\u6539\u7684\u64CD\u4F5C\u3002\u4F46\u8FD9\u610F\u5473\u7740\u5728\u5FEB\u7167\u671F\u95F4Redis\u65E0\u6CD5\u5904\u7406\u5904\u7406\u7684\u5199\u64CD\u4F5C\uFF0C\u65E0\u7591\u4F1A\u7ED9\u4E49\u52A1\u670D\u52A1\u5E26\u6765\u5DE8\u5927\u5F71\u54CD\u3002\u800C\u4E14\u6211\u4EEC\u77E5\u9053Redis\u5728\u5FEB\u7167\u671F\u95F4\u662F\u4F9D\u7136\u53EF\u4EE5\u5904\u7406\u5199\u8BF7\u6C42\u7684\uFF0C\u63A5\u4E0B\u6765\u6211\u4EEC\u6765\u5206\u6790\u4E00\u4E0BRedis\u662F\u5982\u4F55\u89E3\u51B3\u6211\u4EEC\u521A\u521A\u63D0\u51FA\u7684\u4E24\u4E2A\u95EE\u9898\u7684\u3002</p><h2 id="redis\u5199\u65F6\u590D\u5236-cow" tabindex="-1"><a class="header-anchor" href="#redis\u5199\u65F6\u590D\u5236-cow" aria-hidden="true">#</a> Redis\u5199\u65F6\u590D\u5236\uFF08COW\uFF09</h2><p>\u5199\u65F6\u590D\u5236\u542C\u8D77\u6765\u975E\u5E38\u7684\u9AD8\u7AEF\uFF0C\u5413\u9000\u4E86\u4E0D\u5C11\u6280\u672F\u7231\u597D\u8005\uFF0C\u5176\u539F\u7406\u5176\u5B9E\u975E\u5E38\u975E\u5E38\u7B80\u5355\uFF0C\u672C\u8D28\u4E0A\u5C31\u662F\u201C\u6709\u5199\u64CD\u4F5C\u7684\u65F6\u5019\u590D\u5236\u4E00\u4EFD\u201D\uFF0C\u662F\u4E0D\u662F\u5F88\u7B80\u5355\uFF1F</p><blockquote><p>\u6CE8\uFF1A\u5199\u65F6\u590D\u5236\u4E0D\u662FRedis\u81EA\u8EAB\u7684\u7279\u6027\uFF0C\u800C\u662F\u64CD\u4F5C\u7CFB\u7EDF\u63D0\u4F9B\u7684\u6280\u672F\u624B\u6BB5\u3002 \u64CD\u4F5C\u7CFB\u7EDF\u662F\u4E00\u5207\u6280\u672F\u7684\u57FA\u7840\uFF0C\u6240\u6709\u6280\u672F\u7684\u9769\u65B0\u90FD\u5FC5\u987B\u5EFA\u7ACB\u5728\u64CD\u4F5C\u7CFB\u7EDF\u652F\u6301\u7684\u57FA\u7840\u4E0A</p></blockquote><p>Redis\u4E3B\u8FDB\u7A0B<code>fork</code>\u751F\u6210\u7684\u5B50\u8FDB\u7A0B\u53EF\u4EE5\u5171\u4EAB\u4E3B\u8FDB\u7A0B\u7684\u6240\u6709\u5185\u5B58\u6570\u636E\uFF0C<code>fork</code>\u5E76\u4E0D\u4F1A\u5E26\u6765\u660E\u663E\u7684\u6027\u80FD\u5F00\u9500\uFF0C\u56E0\u4E3A\u4E0D\u4F1A\u7ACB\u523B\u5BF9\u5185\u5B58\u8FDB\u884C\u62F7\u8D1D\uFF0C\u5B83\u4F1A\u5C06\u62F7\u8D1D\u5185\u5B58\u7684\u52A8\u4F5C\u63A8\u8FDF\u5230\u771F\u6B63\u9700\u8981\u7684\u65F6\u5019\u3002</p><p>\u60F3\u8C61\u4E00\u4E0B\uFF0C\u5982\u679C\u4E3B\u8FDB\u7A0B\u662F\u8BFB\u53D6\u5185\u5B58\u6570\u636E\uFF0C\u90A3\u4E48\u548C<code>BGSAVE</code>\u5B50\u8FDB\u7A0B\u5E76\u4E0D\u51B2\u7A81\u3002\u5982\u679C\u4E3B\u8FDB\u7A0B\u8981\u4FEE\u6539Redis\u5185\u5B58\u4E2D\u67D0\u4E2A\u6570\u636E\uFF08\u56FE\u4E2D\u6570\u636EC\uFF09\uFF0C\u90A3\u4E48\u64CD\u4F5C\u7CFB\u7EDF\u5185\u6838\u4F1A\u5C06\u88AB\u4FEE\u6539\u7684\u5185\u5B58\u6570\u636E\u590D\u5236\u4E00\u4EFD\uFF08\u590D\u5236\u7684\u662F\u4FEE\u6539\u4E4B\u524D\u7684\u6570\u636E\uFF09\uFF0C\u672A\u88AB\u4FEE\u6539\u7684\u5185\u5B58\u6570\u636E\u4F9D\u7136\u88AB\u7236\u5B50\u4E24\u4E2A\u8FDB\u7A0B\u5171\u4EAB\uFF0C\u88AB\u4E3B\u8FDB\u7A0B\u4FEE\u6539\u7684\u5185\u5B58\u7A7A\u95F4\u5F52\u5C5E\u4E8E\u4E3B\u8FDB\u7A0B\uFF0C\u88AB\u590D\u5236\u51FA\u6765\u7684\u539F\u59CB\u6570\u636E\u5F52\u5C5E\u4E8E\u5B50\u8FDB\u7A0B\u3002\u5982\u6B64\u4E00\u6765\uFF0C\u4E3B\u8FDB\u7A0B\u5C31\u53EF\u4EE5\u5728\u5FEB\u7167\u53D1\u751F\u7684\u8FC7\u7A0B\u4E2D\u8086\u65E0\u5FCC\u60EE\u5730\u63A5\u53D7\u6570\u636E\u5199\u5165\u7684\u8BF7\u6C42\uFF0C\u5B50\u8FDB\u7A0B\u4E5F\u4ECD\u7136\u80FD\u591F\u5BF9\u67D0\u4E00\u65F6\u523B\u7684\u5185\u5BB9\u505A\u5FEB\u7167\u3002 <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1638017965069-0bfda453-6cbc-4a2c-b424-217ce9b9b2a0.png" alt="image.png" loading="lazy"></p><blockquote><p>\u6CE8\uFF1A\u5199\u65F6\u590D\u5236\u662F\u5EFA\u7ACB\u5728\u77ED\u65F6\u95F4\u5185\u5199\u8BF7\u6C42\u4E0D\u591A\u7684\u5047\u8BBE\u4E4B\u4E0B\uFF0C\u5982\u679C\u5199\u8BF7\u6C42\u7684\u91CF\u975E\u5E38\u5DE8\u5927\uFF0C\u90A3\u4E48\u5185\u5B58\u590D\u5236\u7684\u538B\u529B\u81EA\u7136\u4E5F\u4E0D\u4F1A\u5C0F\u3002</p></blockquote><h2 id="\u95F4\u9694\u81EA\u52A8\u5907\u4EFD" tabindex="-1"><a class="header-anchor" href="#\u95F4\u9694\u81EA\u52A8\u5907\u4EFD" aria-hidden="true">#</a> \u95F4\u9694\u81EA\u52A8\u5907\u4EFD</h2><p>\u9664\u4E86\u4E0A\u6587\u4ECB\u7ECD\u7684\u624B\u52A8\u6267\u884C\u7684<code>SAVE</code>\u548C<code>BGSAVE</code>\u65B9\u6CD5\u4E4B\u5916\uFF0CRedis\u8FD8\u63D0\u4F9B\u4E86\u914D\u7F6E\u6587\u4EF6\u7684\u65B9\u5F0F\uFF0C\u53EF\u4EE5\u6BCF\u9694\u4E00\u5B9A\u65F6\u95F4\u81EA\u52A8\u6267\u884C\u4E00\u6B21<code>BGSAVE</code>\u65B9\u6CD5\u3002</p><p>\u4F8B\u5982\uFF0C\u6211\u4EEC\u53EF\u4EE5\u5728Redis\u914D\u7F6E\u6587\u4EF6\u4E2D\u8BBE\u7F6E\u5982\u4E0B\u53C2\u6570\uFF08\u5982\u679C\u6CA1\u6709\u4E3B\u52A8\u8BBE\u7F6E<code>save</code>\u9009\u9879\uFF0C\u5219\u4EE5\u4E0B\u914D\u7F6E\u5373\u4E3A\u9ED8\u8BA4\u914D\u7F6E\uFF09</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>save <span class="token number">900</span> <span class="token number">1</span>
save <span class="token number">300</span> <span class="token number">10</span>
save <span class="token number">60</span> <span class="token number">10000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u90A3\u4E48\u53EA\u8981\u6EE1\u8DB3\u4EE5\u4E0B3\u4E2A\u6761\u4EF6\u4E4B\u4E00\uFF0C<code>BGSAVE</code>\u547D\u4EE4\u5C31\u4F1A\u88AB\u6267\u884C</p><ul><li>\u670D\u52A1\u5668\u5728900\u79D2\u5185\uFF0C\u5BF9\u6570\u636E\u8FDB\u884C\u4E86\u81F3\u5C111\u6B21\u7684\u4FEE\u6539</li><li>\u670D\u52A1\u5668\u5728300\u79D2\u5185\uFF0C\u5BF9\u6570\u636E\u8FDB\u884C\u4E86\u81F3\u5C1110\u6B21\u4FEE\u6539</li><li>\u670D\u52A1\u5668\u572860\u79D2\u5185\uFF0C\u5BF9\u6570\u636E\u8FDB\u884C\u4E86\u81F3\u5C1110000\u6B21\u4FEE\u6539</li></ul><p>\u4E3E\u4E2A\u4F8B\u5B50\uFF0C\u4EE5\u4E0B\u662FRedis\u670D\u52A1\u5668\u5728300\u79D2\u5185\uFF0C\u5BF9\u6570\u636E\u8FDB\u884C\u4E86\u81F3\u5C1110\u6B21\u4FEE\u6539\u4E4B\u540E\uFF0C\u670D\u52A1\u5668\u81EA\u52A8\u8FDB\u884C<code>BGSAVE</code>\u547D\u4EE4\u65F6\u6253\u5370\u7684\u65E5\u5FD7</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>1:M 24 Nov 2021 07:02:28.081 * 10 changes in 300 seconds. Saving...

1:M 24 Nov 2021 07:02:28.082 * Background saving started by pid 22

22:C 24 Nov 2021 07:02:28.142 * DB saved on disk

22:C 24 Nov 2021 07:02:28.143 * RDB: 0 MB of memory used by copy-on-write

1:M 24 Nov 2021 07:02:28.183 * Background saving terminated with success
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="\u81EA\u52A8\u4FDD\u5B58\u7684\u539F\u7406" tabindex="-1"><a class="header-anchor" href="#\u81EA\u52A8\u4FDD\u5B58\u7684\u539F\u7406" aria-hidden="true">#</a> \u81EA\u52A8\u4FDD\u5B58\u7684\u539F\u7406</h3><h4 id="savaparams\u5C5E\u6027" tabindex="-1"><a class="header-anchor" href="#savaparams\u5C5E\u6027" aria-hidden="true">#</a> savaparams\u5C5E\u6027</h4><p>Redis\u4F1A\u6839\u636E\u914D\u7F6E\u6587\u4EF6\u4E2D\u8BBE\u7F6E\u7684\u4FDD\u5B58\u6761\u4EF6\uFF08\u6216\u8005\u672A\u914D\u7F6E\u65F6\u7684\u9ED8\u8BA4\u914D\u7F6E\uFF09\uFF0C\u8BBE\u7F6E\u670D\u52A1\u5668\u72B6\u6001\u7684<code>redisServer</code>\u7684<code>saveparams</code>\u5C5E\u6027</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">redisServer</span><span class="token punctuation">{</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

    <span class="token comment">// \u4FDD\u5B58\u6761\u4EF6\u914D\u7F6E\u7684\u6570\u7EC4</span>
    <span class="token keyword">struct</span> <span class="token class-name">saveparam</span> <span class="token operator">*</span>saveparams<span class="token punctuation">;</span>

    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>saveparams</code>\u662F\u4E00\u4E2A\u6570\u7EC4\uFF0C\u6570\u7EC4\u4E2D\u6BCF\u4E2A\u5BF9\u8C61\u90FD\u662F<code>saveparam</code>\u7ED3\u6784\uFF0C<code>saveparam</code>\u7ED3\u6784\u5982\u4E0B\u6240\u793A\uFF0C\u6BCF\u4E2A\u5B57\u6BB5\u5206\u522B\u8868\u5F81<code>save</code>\u9009\u9879\u7684\u53C2\u6570</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">saveparam</span><span class="token punctuation">{</span>

    <span class="token comment">// \u79D2\u6570</span>
    <span class="token class-name">time_t</span> seconds<span class="token punctuation">;</span>

    <span class="token comment">// \u4FEE\u6539\u6B21\u6570</span>
    <span class="token keyword">int</span> changes<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u4EE5\u9ED8\u8BA4\u914D\u7F6E\u4E3A\u4F8B\uFF0CRedis\u4E2D<code>saveparams</code>\u5B58\u50A8\u7684\u6570\u636E\u7ED3\u6784\u5C06\u4F1A\u5982\u4E0B\u6240\u793A <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1638021410138-15ba4fa6-7e2c-473a-b4b9-cb0084f1ac94.png" alt="image.png" loading="lazy"></p><h4 id="dirty\u8BA1\u6570\u5668\u548Clastsave\u5C5E\u6027" tabindex="-1"><a class="header-anchor" href="#dirty\u8BA1\u6570\u5668\u548Clastsave\u5C5E\u6027" aria-hidden="true">#</a> dirty\u8BA1\u6570\u5668\u548Clastsave\u5C5E\u6027</h4><p>\u9664\u4E86<code>saveparams</code>\u53C2\u6570\u4E4B\u5916\uFF0C<code>redisServer</code>\u8FD8\u6709<code>dirty</code>\u548C<code>lastsave</code>\u5C5E\u6027</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">redisServer</span><span class="token punctuation">{</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

    <span class="token comment">// \u4FEE\u6539\u6B21\u6570\u7684\u8BA1\u6570\u5668</span>
    <span class="token keyword">long</span> dirty<span class="token punctuation">;</span>

    <span class="token comment">// \u4E0A\u4E00\u6B21\u6210\u529F\u6267\u884CRDB\u5FEB\u7167\u7684\u65F6\u95F4</span>
    <span class="token class-name">time_t</span> lastsave<span class="token punctuation">;</span>

    <span class="token comment">// \u4FDD\u5B58\u6761\u4EF6\u914D\u7F6E\u7684\u6570\u7EC4</span>
    <span class="token keyword">struct</span> <span class="token class-name">saveparam</span> <span class="token operator">*</span>saveparams<span class="token punctuation">;</span>

    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>dirty</code>\u5C5E\u6027\u4FDD\u5B58\u8DDD\u79BB\u4E0A\u6B21\u6210\u529F\u6267\u884CRDB\u5FEB\u7167\u4E4B\u540E\uFF0CRedis\u5BF9\u6570\u636E\u8FDB\u884C\u4E86\u591A\u5C11\u6B21\u4FEE\u6539\u64CD\u4F5C\uFF08\u5305\u62EC\u5199\u5165\u3001\u66F4\u65B0\u3001\u5220\u9664\uFF09</li><li><code>lastsave</code>\u5C5E\u6027\u8BB0\u5F55\u4E86Redis\u4E0A\u4E00\u6B21\u6210\u529F\u6267\u884CRDB\u5FEB\u7167\u7684\u65F6\u95F4\uFF0C\u662F\u4E00\u4E2AUNIX\u65F6\u95F4\u6233</li></ul><p>Redis\u6BCF\u8FDB\u884C\u4E00\u6B21\u5199\u547D\u4EE4\u90FD\u4F1A\u5BF9<code>dirty</code>\u8BA1\u6570\u5668\u8FDB\u884C\u66F4\u65B0\uFF0C\u6279\u91CF\u64CD\u4F5C\u6309\u591A\u6B21\u8FDB\u884C\u8BA1\u6570\uFF0C\u5982</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>redis<span class="token operator">&gt;</span> SADD fruits apple banana orange
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>dirty</code>\u8BA1\u6570\u5668\u5C06\u4F1A\u589E\u52A03 <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1638024082403-a844c7db-d308-4f31-8db9-8d9df7093b10.png" alt="image.png" loading="lazy"> \u5982\u4E0A\u56FE\u6240\u793A\uFF0C<code>dirty</code>\u8BA1\u6570\u5668\u7684\u503C\u4E3A101\uFF0C\u6807\u8BC6Redis\u81EA\u4E0A\u6B21\u6210\u529F\u8FDB\u884CRDB\u5FEB\u7167\u4E4B\u540E\uFF0C\u5BF9\u6570\u636E\u5E93\u4E00\u5171\u8FDB\u884C\u4E86101\u6B21\u4FEE\u6539\u64CD\u4F5C\uFF1B<code>lastsave</code>\u5C5E\u6027\u8BB0\u5F55\u4E86\u4E0A\u6B21\u6210\u529F\u8FDB\u884CRDB\u5FEB\u7167\u7684\u65F6\u95F41638023962\uFF082021-11-27 22:39:22)</p><h4 id="\u5468\u671F\u6027\u68C0\u67E5\u4FDD\u5B58\u6761\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u5468\u671F\u6027\u68C0\u67E5\u4FDD\u5B58\u6761\u4EF6" aria-hidden="true">#</a> \u5468\u671F\u6027\u68C0\u67E5\u4FDD\u5B58\u6761\u4EF6</h4><p><code>serverCron</code>\u51FD\u6570\u9ED8\u8BA4\u6BCF\u9694100\u6BEB\u79D2\u5C31\u4F1A\u6267\u884C\u4E00\u6B21\uFF0C\u8BE5\u51FD\u6570\u7684\u5176\u4E2D\u4E00\u4E2A\u4F5C\u7528\u5C31\u662F\u68C0\u67E5<code>save</code>\u547D\u4EE4\u8BBE\u7F6E\u7684\u4FDD\u5B58\u6761\u4EF6\u662F\u5426\u88AB\u6EE1\u8DB3\uFF0C\u662F\u5219\u6267\u884C<code>BGSAVE</code>\u547D\u4EE4\u3002\u4F2A\u4EE3\u7801\u5982\u4E0B</p><div class="language-c ext-c line-numbers-mode"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">serverCron</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span>saveparam in server<span class="token punctuation">.</span>saveparams<span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token comment">// \u8BA1\u7B97\u8DDD\u79BB\u4E0A\u6B21\u6210\u529F\u8FDB\u884CRDB\u5FEB\u7167\u591A\u5C11\u65F6\u95F4</span>
        save_interval <span class="token operator">=</span> <span class="token function">unixtime_now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> server<span class="token punctuation">.</span>lastsave<span class="token punctuation">;</span>

        <span class="token comment">// \u5982\u679C\u8DDD\u79BB\u4E0A\u6B21\u5FEB\u627E\u65F6\u95F4\u8D85\u8FC7\u6761\u4EF6\u8BBE\u7F6E\u65F6\u95F4 &amp;&amp; \u6570\u636E\u5E93\u4FEE\u6539\u6B21\u6570\u8D85\u8FC7\u6761\u4EF6\u6240\u8BBE\u7F6E\u7684\u6B21\u6570\uFF0C\u5219\u6267\u884C\u5FEB\u7167\u64CD\u4F5C</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>save_interval <span class="token operator">&gt;</span> saveparam<span class="token punctuation">.</span>seconds <span class="token operator">&amp;&amp;</span> server<span class="token punctuation">.</span>dirty <span class="token operator">&gt;=</span> saveparam<span class="token punctuation">.</span>changes<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token function">BGSAVE</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u518D\u4E3E\u4E2A\u4F8B\u5B50\uFF0C\u5047\u8BBERedis\u7684\u5F53\u524D\u72B6\u6001\u5982\u4E0B\u56FE <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1638024996313-38009a12-0b23-4d5d-8f68-ebe479acd607.png" alt="image.png" loading="lazy"> \u90A3\u4E48\u5F53\u65F6\u95F4\u6765\u52301638024263\uFF081638023962\u4E4B\u540E\u7684\u7B2C301\u79D2)\uFF0C\u7531\u4E8E\u6EE1\u8DB3\u4E86<code>saveparams</code>\u6570\u7EC4\u7684\u7B2C2\u4E2A\u4FDD\u5B58\u6761\u4EF6\u2014\u2014300S\u4E4B\u5185\u81F3\u5C11\u8FDB\u884C10\u6B21\u4FEE\u6539\uFF0CRedis\u5C06\u4F1A\u6267\u884C\u4E00\u6B21<code>BGSAVE</code>\u64CD\u4F5C\u3002</p><p>\u5047\u8BBE<code>BGSAVE</code>\u6267\u884C4S\u4E4B\u540E\u5B8C\u6210\uFF0C\u5219\u6B64\u65F6Redis\u7684\u72B6\u6001\u5C06\u4F1A\u66F4\u65B0\u4E3A <img src="https://cdn.nlark.com/yuque/0/2021/png/8387282/1638025250592-66ce681e-5376-4719-9cc8-e815cd2a660d.png" alt="image.png" loading="lazy"></p>`,58),d=[c];function p(t,o){return s(),a("div",null,d)}var r=n(i,[["render",p],["__file","Redis\u6301\u4E45\u5316\u2014\u2014RDB.html.vue"]]);export{r as default};
