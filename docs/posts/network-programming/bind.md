---
title: bind()—我在监听哪个端口？
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

当你创建了socket之后，你会想要把这个socket和你本机上的某个端口号（port）进行关联。

端口号是内核用来确认将收到的数据包交给哪个具体进程的`socket descriptor`的依据。

> 通常在写服务端程序的时候我们才需要进行关联，客户端程序不需要我们手动绑定端口，直接`connect()`就好了。

来看看端口号具体是怎么绑定的吧：

```c
#include <sys/types.h>
#include <sys/socket.h>

int bind(int sockfd, struct sockaddr *my_addr, int addrlen);
```

`sockfd`是`socket()`返回的一个`socket file descriptor`；`my_addr`是一个指向包含了你的端口号和IP地址信息的`struct sockaddr`指针；`addrlen`是以字节为单位的地址长度。

接下来，我们给出一个例子，它将socket和我本机的`3490`端口进行绑定：

```c
struct addrinfo hints, *res;
int sockfd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
hints.ai_socktype = SOCK_STREAM;
hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

getaddrinfo(NULL, "3490", &hints, &res);

// make a socket:

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

// bind it to the port we passed in to getaddrinfo():

bind(sockfd, res->ai_addr, res->ai_addrlen);
```

通过使用`AI_PASSIVE`标识，程序会自动绑定它所在的程序的IP。如果你想精确绑定到本机的某一个IP地址，你就不能用`AI_PASSIVE`了，而且你还得把`getaddrinfo()`的第一个参数从`NULL`改为你想绑定的那个IP地址。

`bind()`和其他系统调用一样，发生错误的时候返回`-1`，并且会设置全局变量`errno`的值。

很多老代码都会在调用`bind()`之前手动封装 `struct sockaddr_in` 。当然，这里绑定的肯定是IPv4的地址，如果你想使用IPv6，你照样可以手动封装`struct sockaddr_in6` ，但是极力不推荐你这么做。你还是应该老老实实用 `getaddrinfo()` ，这样更优雅、更简单。

给你看看老代码长什么样子吧：

```c
// !!! THIS IS THE OLD WAY !!!

int sockfd;
struct sockaddr_in my_addr;

sockfd = socket(PF_INET, SOCK_STREAM, 0);

my_addr.sin_family = AF_INET;
my_addr.sin_port = htons(MYPORT);     // short, network byte order
my_addr.sin_addr.s_addr = inet_addr("10.12.110.57");
memset(my_addr.sin_zero, '\0', sizeof my_addr.sin_zero);

bind(sockfd, (struct sockaddr *)&my_addr, sizeof my_addr);
```

上面这个代码中，你依然可以把`my_addr.sin_addr.s_addr`设置为 `INADDR_ANY` ，它的作用上文提到的`AI_PASSIVE`一样，都会让代码自动绑定到本机IP。 `INADDR_ANY` 的IPv6版本是一个全局变量，叫`in6addr_any`，这个变量会被指定给你的 `struct sockaddr_in6` 的`sin6_addr`字段。

> 你也可以使用`IN6ADDR_ANY_INIT`这个宏来初始化变量

调用`bind()`时有一件事需要你特别注意：不要使用`1024`以下的端口号，因为这些端口号是被保留使用的，除非你是超级管理员。除了`1024`以下的，`1025～65535`之间的随便用（其他程序占用的除外）。

有时候，你明明重新运行了你的服务端程序，但是`bind()`报错了，提示你“Address already in use”。这是为什么？理论上重启之后端口就会被释放啊！好吧，这是因为有一些连接到socket的连接还悬在内核中，就是它们占用了这个端口号。你可以等一分钟左右让它们自行消失，或者在你的代码加这么几行：

```c
int yes=1;
//char yes='1'; // Solaris people use this

// lose the pesky "Address already in use" error message
if (setsockopt(listener,SOL_SOCKET,SO_REUSEADDR,&yes,sizeof yes) == -1) {
    perror("setsockopt");
    exit(1);
} 
```

这样就不会再出现端口被占用的问题了。
