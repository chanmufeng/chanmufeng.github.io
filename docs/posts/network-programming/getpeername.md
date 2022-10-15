---
title: getpeername()—你哪位?
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

这个函数有点简单。

简单到我都不想单独把它列出来，但是我还是列出来了。

`getpeername()`会告诉你另一端连接的`stream socket`是谁。语法如下：

```c
#include <sys/socket.h>
    
int getpeername(int sockfd, struct sockaddr *addr, int *addrlen); 
```

`sockfd`是一个已连接的`stream socket`；`addr`是一个指向`struct sockaddr` (或者 `struct sockaddr_in`) 结构的指针，结构中存储了连接的另一头儿的信息；`addrlen`是一个`int`型指针，这个int变量应该被初始化为 `sizeof *addr` 或者 `sizeof(struct sockaddr)`。

函数异常时会返回`-1`，并且设置全局变量`errno`。

一旦你获取了对面的地址，你就可以使用 `inet_ntop()`, `getnameinfo()`, 或者 `gethostbyaddr()` 打印出来或者获取更多信息（但是别妄想能获取到别人的登录名哦～）。
