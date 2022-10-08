---
title: 从IPv4迁移到IPv6
index: false
category:
- socket
# 设置写作时间
date: 2022-10-08
description: '未来一定属于IPv6，但可能还不是现在。虽然嘴上嚷嚷着IPv4不够用了，但是不管国内还是国外，IPv6始终没有预想中的那么普及。但是总归需要对未来做出一点准备嘛，所以本文用12个步骤教你如何在socket编程中从IPv4迁移到IPv6.'
# 一个页面可以有多个标签
tag:
- socket编程
---

未来一定属于IPv6，但可能还不是现在。

虽然嘴上嚷嚷着IPv4不够用了，但是不管国内还是国外，IPv6始终没有预想中的那么普及。

![image-20221008181452021](http://qiniu.chanmufeng.com/2022-10-08-101452.png)

图中颜色越深的地区，表示其 IPv6 部署程度越高，相应的 IPv6 部署率数值越大。所谓的部署率是根据各个国家地区的网络（IPv6 Prefix/Transit IPv6 AS），IPv6 网站及 IPv6 用户等数据按照一定权值并计算得出的。

看起来全球大部分地区都是绿的，但是就全球的IPv6覆盖率而言，还达不到40%。

但是总归需要对未来做出一点准备嘛，所以本文用12个步骤教你如何在socket编程中从IPv4迁移到IPv6。

1. 首先，尝试使用[`getaddrinfo()`](https://www.chanmufeng.com/posts/network-programming/6%E7%A7%8Dsocket%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.html#struct%E2%80%94addrinfo)来获取`struct sockaddr`的信息，不要再手动填充这个数据结构了。这样就可以屏蔽IP的版本影响，省去后续很多麻烦；

2. 找出所有对IP版本硬编码的代码，试着把它们封装起来；

3. 将`AF_INET` 修改为 `AF_INET6`；

4. 将 `PF_INET` 修改为 `PF_INET6`；

5. 将 `INADDR_ANY` 修改为 `in6addr_any` ，给你个例子：

   ```c
   struct sockaddr_in sa;
   struct sockaddr_in6 sa6;
   
   sa.sin_addr.s_addr = INADDR_ANY;  // 使用IPv4
   sa6.sin6_addr = in6addr_any; // 使用IPv6
   ```

6. 使用 `struct sockaddr_in6`代替 `struct sockaddr_in` ，千万要注意，“6”可不要乱加哦，如果你忘记那些字段有“6”了，参考之前讲过的[`struct`](https://www.chanmufeng.com/posts/network-programming/6%E7%A7%8Dsocket%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.html)。比如，压根儿不存在`sin6_zero`这个字段；
7. 使用`struct in6_addr` 代替`struct in_addr` ，关于“6”的细节，参考第6条；
8. 使用`inet_pton()`代替`inet_aton()` 以及 `inet_addr()`；
9. 使用`inet_ntop()`，不要使用`inet_ntoa()`；
10. 使用更高级的`getaddrinfo()`代替`gethostbyname()`了；
11. 用更高级的`getnameinfo()`代替`gethostbyaddr()`（虽然`gethostbyaddr`在IPv6中也能正常使用）；
12. 不要用 `INADDR_BROADCAST `了，请使用 `IPv6 multicast` 來代替。

以上！

