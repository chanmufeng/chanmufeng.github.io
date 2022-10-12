---
title: listen()—会有人联系我吗?
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-12
# 一个页面可以有多个标签
tag:
- socket编程
---

之前讲的函数服务端和客户端都可以使用，让我们换换口味，这次讲一个仅用于服务端的函数，不仅如此，它还只能用于TCP服务端。

身为服务端，肯定是需要等待随时可能到来的客户端连接，并采用某种方式处理连接。整个过程可以分为两步：先调用`listen()`，然后调用`accept()`（这是下一小节的内容）。

`listen`的调用非常简单，如下：

```c
#include <sys/sock.h>

int listen(int sockfd, int backlog); 
```

虽然只有两个参数，但是其中有一些细节值得玩味。

`sockfd`就是通过`socket()`返回的一个**普通**`socket file descriptor`而已，系统默认这个socket只是一个等待进行主动连接的客户端socket。而`listen`函数会把这个客户端socket转换为服务端socket，告诉内核需要接受指向该socket的连接请求，并且该socket的TCP状态从`CLOSED`转换为`LISTEN`。

`backlog`参数表示内核应该为该套接字排队的最大连接个数。这是啥意思？所有客户端与该socket建立的连接都会在一个队列中排队等待，直到你`accept()`（见下节）它们，这个参数就表示最多有多少个连接有资格排队。大多数系统将这个值预设为20，你可以初始化为5或者10。

还有老生常谈的，`listen() `在错误的时候会返回` -1`，并设置 `errno`。

联系之前讲过的3个系统调用，创建服务端代码需要调用的函数依次为：

```c
getaddrinfo();
socket();
bind();
listen();
/* accept() 将被写在这里 */ 
```

我只是列出了函数的调用顺序而已，这几个步骤都比较简单，稍微需要点处理技巧的是下一节的`accept()`。
