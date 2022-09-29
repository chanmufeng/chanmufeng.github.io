---
title: 什么是socket
index: false
category:
- socket
# 设置写作时间
date: 2022-09-29
# 一个页面可以有多个标签
tag:
- socket编程
---

你一直在听别人谈论"`sockets`"，或许你也想搞明白这到底是个什么东西。

好吧，它们其实就是：「使用标准的`Unix file descriptors`（Unix文件描述符）与其他程序进行沟通的一种方式」。

啥玩意儿？

如果接触过Unix，你一定听说过「Unix一切皆文件」的说法。

一定意义上来说，这个说法并没有什么错。因为Unix程序做任何I/O操作，都是通过对`file descriptor`（文件描述符）进行读写来实现的。

文件描述符其实就是一个整数罢了，只是这个整数关联了一个打开的文件。这里的文件可以是一个`网络连接`、`FIFO`、`pipe`（管道）、`terminal`（终端）、磁盘中的实际文件等等。

> 我之前写过一篇《什么是文件描述符》的文章，感兴趣的话大家可以看一下

所以「Unix一切皆文件」的说法并非是夸大其词。

不管你信不信，当你想通过网络和另一个程序进行通讯时，你必须通过`file descriptor`来实现。

那么怎么获取到和网络通信相关的这个`file descriptor`呢？

我们可以使用`socket()`函数，这个函数会返回一个`socket descriptor`（`socket`都是一个文件，`socket descriptor`自然就是一个`file descriptor`了）。然后你就可以通过这个`socket descriptor`，使用`send()`和`recv()`这两个函数与其他程序进行通信了。

如果你用C语言对文件进行过读写操作，你就知道`read()/write()`这一组函数同样可以作用于`file descriptor`，为什么不用这一套函数呢？

当然完全可以用！只不过`send()/recv()`在数据传输方面比`read/write()`提供了更多可选项罢了。

其实`sockets`的种类有很多，比如：

- DARPA Internet addresses，简称`Internet Sockets `

Internet Sockets是我们接下来讲解的重点，因为它是我们目前进行网络通信时使用最多的一种Socket.

> DARPA表示国防部高级研究计划局

- path names on a local node，简称`Unix Sockets`

这个英文翻译成中文也不是很直观，所以干脆不翻译了，`Unix Sockets`有时候被称为`Unix域套接字`。简而言之，`Unix Sockets`是用于同一台主机中进程间通讯的一种方式。

使用过MySQL的朋友很可能见过下面这个错误：

```bash
ERROR 2002 (HY000): 
Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)
```

这个错误说明MySQL Client和MySQL Server运行在同一台主机上，并且两个进程通过`/var/lib/mysql/mysql.sock`这个文件进行通信，这个文件就是Unix域套接字文件，不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序列号应答等等网络通信细节。

你可能会问，MySQL Client和MySQL Server之间为什么不通过本地网络进行通信呢？

这和你对MySQL的配置有关系。

如果你指定的MySQL主机名为`localhost`，或者你指定了`--protocl=socket`的启动参数，那么Client和Server之间就会通过`Unix域套接字`进行通信了。

相反，如果你指定的MySQL主机名是`127.0.0.1`，那么Client和Server之间就会通过`Internet Sockets`进行通信了。
