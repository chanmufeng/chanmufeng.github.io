---
title: connect()—嘿，你好啊！
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

客户端就是用`connect()`函数来建立与服务器之间的连接的。

```c
#include <sys/types.h>
#include <sys/socket.h>

int connect(int sockfd, struct sockaddr *serv_addr, int addrlen);
```

`sockfd`是我们的老朋友了，是由`socket()`函数返回的套接字描述符，`serv_addr`是一个执行套接字地址结构 `struct sockaddr` 的指针， `struct sockaddr` 中存储了目标IP地址和端口号信息，`addrlen`是`serv_addr`指向的`struct sockaddr` 大小。

再次强调一下 `getaddrinfo()` 的妙处，所有你需要的连接信息都可以从这个函数的返回结果中获取。

客户端在调用`connect()`之前不必非得调用`bind()`函数，因为如果有必要，内核会确定源IP地址，并选择一个临时端口号作为源端口。

举一个使用`connect()`连接到"www.chanmufeng.com" 的`3490`端口的例子：

```c
struct addrinfo hints, *res;
int sockfd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;
hints.ai_socktype = SOCK_STREAM;

getaddrinfo("www.example.com", "3490", &hints, &res);

// make a socket:

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

// connect!

connect(sockfd, res->ai_addr, res->ai_addrlen);
```

和上一节讲的`bind()`一样，有些老代码在调用`connect()`之前会手动封装 `struct sockaddr_in`，然后传给`connect()`作为参数。你现在仍然可以这么做，但是没必要！

如果你使用的是TCP套接字，调用`connect`函数会触发TCP的三次握手过程，而且仅在连接成功或者失败时才会返回，失败返回`-1`，并且会设置全局变量`errno`的值。

