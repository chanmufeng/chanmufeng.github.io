---
title: IP与二进制转换
index: false
category:
- socket
description: '不得不说，我们真的很幸运，如今已经有了很多函数可以让我们操作IP地址，而不需要我们自己手动处理它们。本文介绍IP与二进制互相转换的两个函数inet_pton()和inet_pton()'
# 设置写作时间
date: 2022-10-07
# 一个页面可以有多个标签
tag:
- socket编程
---

不得不说，我们真的很幸运，如今已经有了很多函数可以让我们操作IP地址，而不需要我们自己用`long`类型数据以及`<<`运算符来处理它们。

假如你声明了一个数据结构`struct sockaddr_in ina`，你还有一个“`10.12.110.57`”或“`2001:db8:63b3:1::3490`”这样的IP地址，该怎么把IP地址存入`ina`呢。

## IP转二进制

你可以使用`inet_pton()`将点分十进制形式的IPv4地址保存在`ina`中，但如果要保存IPv6地址的话，我们就需要`struct sockaddr_in6 ina6`了。

> “`pton`”的全称是“presentation to network”，也可以是“printable to network”，选一个能帮助你记忆的就行。

具体的转换如下代码所示：

```c
struct sockaddr_in sa; // IPv4
struct sockaddr_in6 sa6; // IPv6
    
inet_pton(AF_INET, "10.12.110.57", &(sa.sin_addr)); // IPv4
inet_pton(AF_INET6, "2001:db8:63b3:1::3490", &(sa6.sin6_addr)); // IPv6
```

> 小记：原本的老方法是使用名为` inet_addr() `或是 `inet_aton() `的函数；这些函数已经过时了，而且不适用于 IPv6

上面的程序写的比较简单，而且不够健壮，因为没有进行错误检查。`inet_pton() `在发生错误时会返回`-1`，而若地址无效则返回`0`。所以在使用之前要检查返回值，并保证返回结果是大于 0 的。

现在我们可以将字符串格式的IP地址转换为二进制形式了。那么反过来需要怎么做？

## 二进制转IP

如果我们已经有了`struct in_addr`，怎么将点分十进制的IP打印出来？（或者我们有`struct in6_addr`，怎么打印字符串类型的IPv6地址呢？）

我们可以使用`inet_ntop()`函数，看代码：

> “`ntop`”的全称是“network to presentation”，也可以是“network to printable”，选一个能帮助你记忆的就行。

```c
// IPv4:
char ip4[INET_ADDRSTRLEN];  // space to hold the IPv4 string
struct sockaddr_in sa;      // 假设sa中保存了ip信息
inet_ntop(AF_INET, &(sa.sin_addr), ip4, INET_ADDRSTRLEN);
printf("The IPv4 address is: %s\n", ip4);


// IPv6:
char ip6[INET6_ADDRSTRLEN]; // space to hold the IPv6 string
struct sockaddr_in6 sa6;    // 假设sa6种保存了ip信息
inet_ntop(AF_INET6, &(sa6.sin6_addr), ip6, INET6_ADDRSTRLEN);
printf("The address is: %s\n", ip6);
```

当我们调用`inet_ntop()`，你需要传递IP地址类型（IPv4 或者 IPv6），一个指向保存字符串结果的指针以及该字符串的最大长度。有两个宏（可以理解为常量）可以很方便地帮助我们表示要存储的IPv4或者IPv6地址字符串的最大长度，分别是`INET_ADDRSTRLEN` 和 `INET6_ADDRSTRLEN`。

> 小记：原本的老方法是使用名为`inet_ntoa()`的函数，这个函数已经过时了，而且不适用于 IPv6

最后，本文讲到的函数只能用于数值型的IP地址上，它们不会用DNS做域名解析，所以你传入“www.example.com”这样的域名是没有用的。

关于域名查询，我们将会使用`getaddrinfo()`函数，之前的文章提过一嘴，后文将会详细讲述，敬请期待。
