---
title: Client-Server基础
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-15
# 一个页面可以有多个标签
tag:
- socket编程
---

宝儿，你得承认，这是个`Client-Server`的世界。

网络上几乎所有的内容本质上都是Client进程与`erver进程之间的会话，反之亦然。

拿telnet举个例子。当你使用`telnet`（Client端）连接上远程主机的`23`端口，远程主机上监听该端口的程序（叫`telnetd`，就是`telnet`的Server端）就动了起来。它会处理到来的`telnet`连接，并为你设置好登陆提示信息等。

![Client-Server交互](http://qiniu.chanmufeng.com/2022-10-15-130214.png)

上图很形象地表达了Client和Server之间的信息交互。

需要注意的是，`Client-Server`这一组搭档可以使用 `SOCK_STREAM`、 `SOCK_DGRAM`或其他任何协议（只要双方使用的协议一致即可）。

 `telnet`/`telnetd`, `ftp`/`ftpd`, 以及 `Firefox`/`Apache`等都是`Client-Server`模式非常好的范例。比如，每次你使用`ftp`的时候，在远程都会一个`ftpd`程序为你服务。

通常情况下，一台主机只会有一个Server程序（这里指的是处理同一功能的服务端），该程序会使用`fork()`来处理多个Client。基本的流程是这样的：Server会等待客户端连接，然后`accept()`该连接，再`fork()`出一个子进程来处理该连接。

这就是我们下一节的Server端程序做的事情。

