---
title: accept()—感谢呼叫3490端口
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-13
# 一个页面可以有多个标签
tag:
- socket编程
---

系好安全带，`accept()`之旅开始了。

一个远程用户试图调用`connect()`来连接到你使用`listen()`进行监听的端口上，这个连接会被放到队列中等着被你`accept()`。这句话要是你看不懂你需要回去看看前文哦。

然后你调用`accept()`，从队列中取出一个等候已久的连接，`accept()`会返回给你一个专属于这个连接的一个**全新的**`socket file descriptor`！

没错，你现在有**2个**`socket file descriptor`了！原来的`socket file descriptor`仍在处于被`listen()`的状态等待客户端的连接，而你刚刚得到的`socket file descriptor`则是准备给`send()`和`recv()`使用的，通过这俩函数，就可以实现和客户端之间的通信了。

`accept()`使用如下：

```c
#include <sys/types.h>
#include <sys/socket.h>

int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
```

`sockfd`就是正在被`listen()`的那个`socket descriptor`，这个没啥难度。

`addr`就是一个指向 `struct sockaddr_storage`的指针，这里边会自动保存客户端的一些信息，你能从中得知客户端是从哪个IP、哪个端口对你发起的连接。

`addrlen`是一个整数变量，你应该在将它的地址传给`accept()`之前，把它设置为 `sizeof(struct sockaddr_storage)` 。`accept()`保存在`addr`指向的对象中的数据大小只会小于等于`addrlen`，如果小于的话，`accept()`会通过改变`addrlen`的值来告诉你，所以你应该知道为什么这个字段是个指针变量了吧。

猜猜我要说啥，一句我快说吐了的话。`accept() `在错误的时候会返回` -1`，并设置 `errno`。

和之前一样，show you the code可能会更好吸收，看一段代码：

```c
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#define MYPORT "3490"  // the port users will be connecting to
#define BACKLOG 10     // how many pending connections queue will hold

int main(void)
{
    struct sockaddr_storage their_addr;
    socklen_t addr_size;
    struct addrinfo hints, *res;
    int sockfd, new_fd;

    // !! don't forget your error checking for these calls !!

    // first, load up address structs with getaddrinfo():

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

    getaddrinfo(NULL, MYPORT, &hints, &res);

    // make a socket, bind it, and listen on it:

    sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    bind(sockfd, res->ai_addr, res->ai_addrlen);
    listen(sockfd, BACKLOG);

    // now accept an incoming connection:

    addr_size = sizeof their_addr;
    new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &addr_size);

    // ready to communicate on socket descriptor new_fd!
    .
    .
    .
```

接下来我们就会用得到的`new_fd`这个`socket descriptor`进行`send()`和`recv()`。

如果你只是想获取这一个连接，你可以使用`close()`来关闭处于`LISTEN`状态的`sockfd`，这样就可以避免有更多的客户端连接到`3490`这个端口上了。
