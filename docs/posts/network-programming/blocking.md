---
title: 何谓阻塞Blocking
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-16
# 一个页面可以有多个标签
tag:
- socket编程
---

你可能听说过**阻塞**（Blocking）这个词，那么它到底是个什么鬼东西？简而言之，“block”是“sleep”的一种更具有科技感的叫法。

> 下文中，「blocking」、「block」和「阻塞」会混用，都是一个意思，悉知

当你运行前文的`listener`程序时，你可能发现它一直在“block”，直到数据包到达才会动起来。产生这个现象的原因是它调用了`recvfrom()`，如果没有数据，`recvfrom()`就会被“block”（你可以理解为“sleep”），直到有数据到达。

很多函数都会block。`accept()`会block，所有的`recv()`会block，它们之所以可以block，是因为它们被内核赋予了这个能力。当你使用`socket()`函数创建出一个`socket descriptor`时，内核就会将其设置为`blocking`。如果你不想要blocking socket，你需要调用`fcntl()`进行设置：

```c
#include <unistd.h>
#include <fcntl.h>
.
.
.
sockfd = socket(PF_INET, SOCK_STREAM, 0);
fcntl(sockfd, F_SETFL, O_NONBLOCK);
.
.
. 
```

将socket设置为non-blocking（非阻塞），你就可以`poll`（轮询）socket来获取数据了。如果你对一个non-blocking socket进行读取，而socket没有数据的时候，它并不会阻塞，而是会返回`-1`，并且将`errno`设置为 `EAGAIN` 或 `EWOULDBLOCK`。

啥？ `EAGAIN` **或** `EWOULDBLOCK`吗？那我到底应该检查哪一个？实际上，不同操作系统返回哪个值是不确定的，因此为了兼容性，你最好把这两个值都检查一下。

但是老实说，你要是时时刻刻进行数据轮询并不是个好主意，因为会空耗CPU时间片，做的大部分都是无用功。协下一节的`poll()`提供了一个更优雅的解决方案，用于检查是否有等待读取的数据。
