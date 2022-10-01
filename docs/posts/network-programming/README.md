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
- IP地址、struct以及地址转换
  - IP地址，IPv4和IPv6
  - 字节序
  - struct结构
  - 再谈IP地址
- 从IPv4迁移到IPv6
  - IP地址，IPv4和IPv6
  - 字节序
  - struct结构
  - 再谈IP地址
- System call 或 Bust
  - getaddrinfo()—准备开始！
  - socket()—拿到文件描述符！
  - bind()—我在监听哪个端口?
  - connect()—嘿，你好啊！
  - listen()—会有人联系我吗?
  - accept()—感谢呼叫3490端口
  - send() and recv()—跟我唠唠吧，宝儿!
  - sendto() and recvfrom()—用DGRAM风格跟我说话
  - close() and shutdown()—滚犊子！
  - getpeername()—你哪位?
  - gethostname()—我是谁?
- Client-Server基础
  - 一个简单的流服务器
  - 一个简单的流客户端
  - Datagram Sockets
- 技术进阶
  - Blocking—何谓阻塞？
  - poll()—同步的I/O多路复用
  - select()—老古董的同步I/O多路复用
  - 数据只传了一部分怎么办？
  - Serialization-如何封装数据？
  - 数据封装
  - 广播数据包-大声说「Hello，World」
- 常见问题
- 使用手册
- 参考资料
