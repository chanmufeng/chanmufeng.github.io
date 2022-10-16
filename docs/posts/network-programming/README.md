---
title: Socket编程简明教程
index: false
article: false
# category:
#  - linux
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
- [什么是socket](什么是socket.md)
  - [两种Internet Socket](两种Internet-Socket.md)
  - [漫谈网络](漫谈网络.md)
- [IP地址、struct以及地址转换](IP.md)
  - [IP地址，IPv4和IPv6](IPv4-IPv6.md)
  - [字节序](字节序.md)
  - [socket相关的数据结构](6种socket数据结构.md)
  - [IP与二进制转换](IP与二进制转换.md)
- [从IPv4迁移到IPv6](从IPv4迁移到IPv6.md)
- [各种System call](socket编程相关函数.md)
  - [getaddrinfo()—准备开始！](getaddrinfo.md)
  - [socket()—拿到套接字描述符！](socket.md)
  - [bind()—我在监听哪个端口?](bind.md)
  - [connect()—嘿，你好啊！](connect.md)
  - [listen()—会有人联系我吗?](listen.md)
  - [accept()—感谢呼叫3490端口](accept.md)
  - [send() and recv()—跟我唠唠吧，宝儿!](send-recv.md)
  - [sendto() and recvfrom()—用DGRAM风格跟我说话](sendto-recvfrom.md)
  - [close() and shutdown()—滚犊子！](close-shutdown.md)
  - [getpeername()—你哪位?](getpeername.md)
  - [gethostname()—我是谁?](gethostname.md)
- [Client-Server基础](client-server.md)
  - [一个简单的stream server](stream-server-sample.md)
  - [一个简单的stream client](stream-client-sample.md)
  - [Datagram Sockets](Datagram-Sockets.md)
- [技术进阶](slightly-advanced-tech.md)
  - [Blocking—何谓阻塞？](blocking.md)
  - [poll()—同步的I/O多路复用](poll.md)
  - select()—老古董的同步I/O多路复用
  - 数据只传了一部分怎么办？
  - Serialization-如何封装数据？
  - 数据封装
  - 广播数据包-大声说「Hello，World」
- 常见问题
- 使用手册
- 参考资料
