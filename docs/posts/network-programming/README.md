---
title: Socket编程简明教程
index: false
article: true
# 设置写作时间
date: 2022-10-05
description: '这是一本socket编程的入门小册。学习编程，你肯定听过"socket"，或许你也想搞明白这到底是个什么东西，那就点进来看看吧。'
# 一个页面可以有多个标签
tag:
- socket编程
---


- 简介
- 中文授权
- 导读
  - 本书适合的读者
  - 平台与编译器
  - 原著官网
  - Solaris/SunOS软件开发者需要注意的事
  - Windows软件开发者需要注意的事
  - 学会提问
  - 镜像站点
  - 版权说明
- [什么是socket](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_3-%E4%BB%80%E4%B9%88%E6%98%AFsocket)
  - [两种Internet Socket](https://www.chanmufeng.com/posts/network-programming/chapter/%E4%B8%A4%E7%A7%8DInternet-Socket.html)
  - [漫谈网络](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_3-2-%E6%BC%AB%E8%B0%88%E7%BD%91%E7%BB%9C)
- [IP地址、struct以及地址转换](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_4-ip%E5%9C%B0%E5%9D%80%E3%80%81struct%E4%BB%A5%E5%8F%8A%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2)
  - [IP地址，IPv4和IPv6](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_4-1-ipv4%E4%B8%8Eipv6)
  - [字节序](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_4-2-%E5%AD%97%E8%8A%82%E5%BA%8F)
  - [socket相关的数据结构](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_4-3-socket%E7%9B%B8%E5%85%B3%E7%9A%84%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)
  - [IP与二进制转换](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_4-4-ip%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%BD%AC%E6%8D%A2)
- [从IPv4迁移到IPv6](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_5-%E4%BB%8Eipv4%E8%BF%81%E7%A7%BB%E5%88%B0ipv6)
- [各种System call](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-socket%E7%BC%96%E7%A8%8B%E7%9B%B8%E5%85%B3%E5%87%BD%E6%95%B0)
  - [getaddrinfo()—准备开始！](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-1-getaddrinfo-%E2%80%94%E5%87%86%E5%A4%87%E5%BC%80%E5%A7%8B)
  - [socket()—拿到套接字描述符！](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-2-socket-%E2%80%94%E6%8B%BF%E5%88%B0%E5%A5%97%E6%8E%A5%E5%AD%97%E6%8F%8F%E8%BF%B0%E7%AC%A6)
  - [bind()—我在监听哪个端口?](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-3-bind-%E2%80%94%E6%88%91%E5%9C%A8%E7%9B%91%E5%90%AC%E5%93%AA%E4%B8%AA%E7%AB%AF%E5%8F%A3)
  - [connect()—嘿，你好啊！](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-4-connect-%E2%80%94%E5%98%BF-%E4%BD%A0%E5%A5%BD%E5%95%8A)
  - [listen()—会有人联系我吗?](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-5-listen-%E2%80%94%E4%BC%9A%E6%9C%89%E4%BA%BA%E8%81%94%E7%B3%BB%E6%88%91%E5%90%97)
  - [accept()—感谢呼叫3490端口](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-6-accept-%E2%80%94%E6%84%9F%E8%B0%A2%E5%91%BC%E5%8F%AB3490%E7%AB%AF%E5%8F%A3)
  - [send() and recv()—跟我唠唠吧，宝儿!](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-7-send-and-recv-%E2%80%94%E8%B7%9F%E6%88%91%E5%94%A0%E5%94%A0%E5%90%A7-%E5%AE%9D%E5%84%BF)
  - [sendto() and recvfrom()—用DGRAM风格跟我说话](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-8-sendto-and-recvfrom-%E2%80%94%E7%94%A8dgram%E9%A3%8E%E6%A0%BC%E8%B7%9F%E6%88%91%E8%AF%B4%E8%AF%9D)
  - [close() and shutdown()—滚犊子！](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-9-close-and-shutdown-%E2%80%94%E6%BB%9A%E7%8A%8A%E5%AD%90)
  - [getpeername()—你哪位?](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-10-getpeername-%E2%80%94%E4%BD%A0%E5%93%AA%E4%BD%8D)
  - [gethostname()—我是谁?](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_6-11-gethostname-%E2%80%94%E6%88%91%E6%98%AF%E8%B0%81)
- [Client-Server基础](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_7-client-server%E5%9F%BA%E7%A1%80)
  - [一个简单的stream server](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_7-1-%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84stream-server)
  - [一个简单的stream client](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_7-2-%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84stream-client)
  - [Datagram Sockets](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_7-3-datagram-sockets)
- [技术进阶](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-%E6%8A%80%E6%9C%AF%E8%BF%9B%E9%98%B6)
  - [Blocking—何谓阻塞？](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-1-blocking%E2%80%94%E4%BD%95%E8%B0%93%E9%98%BB%E5%A1%9E)
  - [poll()—同步的I/O多路复用](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-2-poll-%E2%80%94%E5%90%8C%E6%AD%A5%E7%9A%84i-o%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8)
  - [select()—老古董的同步I/O多路复用](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-3-select-%E2%80%94%E8%80%81%E5%8F%A4%E8%91%A3%E7%9A%84%E5%90%8C%E6%AD%A5i-o%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8)
  - [数据只传了一部分怎么办？](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-4-%E6%95%B0%E6%8D%AE%E5%8F%AA%E4%BC%A0%E4%BA%86%E4%B8%80%E9%83%A8%E5%88%86%E6%80%8E%E4%B9%88%E5%8A%9E)
  - [Serialization-如何封装数据？](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-5-serialization-%E5%A6%82%E4%BD%95%E5%B0%81%E8%A3%85%E6%95%B0%E6%8D%AE)
  - [数据封装](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-6-%E6%95%B0%E6%8D%AE%E5%B0%81%E8%A3%85)
  - [广播数据包-大声说「Hello，World」](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_8-7-%E5%B9%BF%E6%92%AD%E6%95%B0%E6%8D%AE%E5%8C%85-%E5%A4%A7%E5%A3%B0%E8%AF%B4%E3%80%8Chello-world%E3%80%8D)
- [常见问题](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_9-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
- [使用手册](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_10-man%E6%89%8B%E5%86%8C)
- [参考资料](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_10-9-shutdown)
- [后记](https://www.chanmufeng.com/posts/network-programming/network-programming.html#_12-%E5%90%8E%E8%AE%B0)
  
