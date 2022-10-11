---
title: socket()—拿到套接字描述符！
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-11
# 一个页面可以有多个标签
tag:
- socket编程
---

现在来详细介绍一下`socket()`这个系统调用。

先看一些用法和参数：

```c
#include <sys/types.h>
#include <sys/socket.h>

int socket(int domain, int type, int protocol); 
```

可是这个函数的参数是干什么的呢？刚开始用这个函数可能会一脸懵，别怕，我慢慢介绍。

函数参数是用来指定你想要的socket类型（IPv4还是IPv6，数据流（stream）还是数据报（datagram），`TCP`还是`UDP`）。

`domain`参数指的是协议族，你可以设置为`PF_INET`或者`PF_INET6`，也可以是下表（只列举了一部分）中的某个常值。

|  family  |    说明    |
| :------: | :--------: |
| AF_INET  |  IPv4协议  |
| AF_INET6 |  IPv6协议  |
| AF_LOCAL | Unix域协议 |
| AF_ROUTE | 路由套接字 |
|  AF_KEY  | 密钥套接字 |

`type`表示socket的类型，可以是下表中的某个常值。

|      type      |      说明      |
| :------------: | :------------: |
|  SOCK_STREAM   |  字节流socket  |
|   SOCK_DGRAM   |  数据报socket  |
| SOCK_SEQPACKET | 有序分组socket |
|    SOCK_RAW    |   原始socket   |

至于`protocol`，你可以简单地将`protocol`设置为`0`，会自动选择`domain`和`type`字段组合的系统默认值。当然喽，如果你想亲力亲为，你也可以调用 `getprotobyname()` 来查找你想要的协议，参数可以是“`tcp`”、“`udp`”等，还可以直接使用下表中的常值。

|   protocol   |     说明     |
| :----------: | :----------: |
| IPPROTO_TCP  | TCP传输协议  |
| IPPROTO_UDP  | UDP传输协议  |
| IPPROTO_SCTP | SCTP传输协议 |

可能你已经注意到了，`domain`字段的候选值中既有`AF_INET`又有`PF_INET`，`AF_XXX` 和 `PF_XXX`有什么区别呢？

`AF_`前缀表示地址族（`AF`表示`Address Family`），`PF_` 前缀表示协议族（`PF`表示`Protocol Family`）。你可能发现有些资料的`socket()`第一个参数使用`AF_XXX`，有些资料却使用`PF_XXX`，这确实有点让人头疼。

追根溯源，这其实是有历史原因的。很久很久之前，人们设想单个协议族可以支持多个地址族，但是这个想法就从来没有实现过。而且`<sys/socket.h>`这个头文件中为某个给定协议定义的`PF_`值总是和此协议的`AF_`值相等，这就直接造成了`AF_`和`PF_`滥用的乱象。

相比`PF_XXX`，很多程序员更喜欢将`AF_XXX`作为第一个参数传入socket，甚至包括《Unix网络编程》的作者Stevens也在书中直接用`AF_XXX`作为参数（这其实只是作者想与大部分代码保持一致罢了，算是一种妥协）。但大多数人做的未必就是对的。 

我们最推崇的一种做法是遵守POSIX规范，将`socket()`函数的第一个参数设置为`PF_`值，而在`struct sockaddr_in`结构中使用`AF_`。

说这么多已经够用了。结合之前讲过的`getaddrinfo()`，我们需要做的就是将`getaddrinfo()`调用得到结果直接喂给`socket()`，像这样：

```c
int s;
struct addrinfo hints, *res;

// do the lookup
// [pretend we already filled out the "hints" struct]
getaddrinfo("www.example.com", "http", &hints, &res);

// again, you should do error-checking on getaddrinfo(), and walk
// the "res" linked list looking for valid entries instead of just
// assuming the first one is good (like many of these examples do).
// See the section on client/server for real examples.

s = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
```

`socket()`函数在返回成功时会返回一个套接字描述符（socket descriptor）,它是一个非负整数，在后续的其他函数调用中，我们将使用它来表示这个socket。

如果发生错误，`socket()`会返回`-1`，此时`errno`这个全局变量会被设置为该错误的值。

> 只要一个Unix函数发生错误，Unix的全局变量`errno`就会被设置为一个指明该错误类型的某个正数，而函数本身通常返回`-1`。
>
> 下面展示了`<sys/errno.h>`头文件中定义的`errno`的部分候选值：
>
> ```c
> ...
> /*
>  * Error codes
>  */
> 
> #define EPERM           1               /* Operation not permitted */
> #define ENOENT          2               /* No such file or directory */
> #define ESRCH           3               /* No such process */
> #define EINTR           4               /* Interrupted system call */
> #define EIO             5               /* Input/output error */
> #define ENXIO           6               /* Device not configured */
> #define E2BIG           7               /* Argument list too long */
> #define ENOEXEC         8               /* Exec format error */
> #define EBADF           9               /* Bad file descriptor */
> #define ECHILD          10              /* No child processes */
> #define EDEADLK         11              /* Resource deadlock avoided */
>                                         /* 11 was EAGAIN */
> #define ENOMEM          12              /* Cannot allocate memory */
> #define EACCES          13              /* Permission denied */
> #define EFAULT          14              /* Bad address */
> ...
> ```
>
> 
