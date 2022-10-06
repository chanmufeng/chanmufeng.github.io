---
title: socket相关的数据结构
index: false
category:
- socket
# 设置写作时间
date: 2022-10-01
description: '终于到了编码的环节了，本文介绍Socket库常用的6种数据结构，包括socket描述符、addrinfo、sockaddr、sockaddr_in、sockaddr_in6、sockaddr_storage'
# 一个页面可以有多个标签
tag:
- socket编程
---

终于讲到这里了，现在该聊一聊和编程直接相关的一些内容了，本节会介绍多种Socket库使用的数据结构。

## socket描述符

首先介绍一个最简单的：socket描述符。它的类型是：

```java
int
```

没错，就只是个普普通通的`int`而已。

第一个介绍完了。。。。。。简单吧。

但是从这儿开始就稍微有点不好理解了，大家跟上车速，慢慢来。

## struct—addrinfo

第一个要介绍的`struct`结构是`addrinfo`，这个数据结构的发明时间还不算很久，是用来准备`socket地址`等信息以供后续使用的。它也会被用在**域名查找**（host name lookups）以及**服务查找**（service name lookups）等方面。

这么听起来感觉很抽象，等之后我们实际使用的时候就好理解了，现在我们需要知道的就是：我们在建立网络连接的时候会用到`addrinfo`这个数据结构。

```c
struct addrinfo {
    int              ai_flags;     // AI_PASSIVE, AI_CANONNAME, etc.
    int              ai_family;    // AF_INET, AF_INET6, AF_UNSPEC
    int              ai_socktype;  // SOCK_STREAM, SOCK_DGRAM
    int              ai_protocol;  // use 0 for "any"
    size_t           ai_addrlen;   // size of ai_addr in bytes
    struct sockaddr *ai_addr;      // struct sockaddr_in or _in6
    char            *ai_canonname; // full canonical hostname

    struct addrinfo *ai_next;      // 链表结构，指向下一个节点
};
```

接下来我们用域名查找来做个例子，帮助大家理解。

### 使用ip建立连接

通常情况下，我们都是直接利用IP和端口向服务器发起连接，像这样

```c
struct sockaddr_in si;

//这一行你可能还不知道什么意思，别急，下文会解释
memset(&si, 0, sizeof(si));

si.sin_family = AF_INET;
si.sin_addr.s_addr = inet_addr("182.25.23.123");
si.sin_port = htons(80);
connect(s, (struct sockaddr *) &si, sizeof(si));
```

如果没接触过C的socket编程，你可能已经开始打退堂鼓了。我懂你这种感觉，我都已经放弃好几次了。。。。。。

但是后来硬着头皮看其实也没什么，虽然写法怪异，但都是C语言上的套路而已，看多了也就那么回事儿！

上面的代码的意思就是对`182.25.23.123`的`80`端口发起了一个连接。前提是我们已经知道了主机的IP了，如果只有域名该怎么办呢？

那我们就得利用`DNS`，用另一种方式来构建客户端套接字了，而这种方式就会用到`addrinfo`。

### 使用域名建立连接

直接上代码！

```c
// 为了使用getaddrinfo()函数，需要这个头文件
#include <netdb.h>

...
struct addrinfo *res;
struct addrinfo hints;
memset(&hints, 0, sizeof(hints));
hints.ai_family = AF_UNSPEC;
hints.ai_socktype = SOCK_STREAM;
getaddrinfo("www.chanmufeng.com", "80", &hints, &res);
```

`getaddrinfo()`函数会创建一个叫做**名字资源**的新数据结构（也就是代码中的`res`），给定`域名`和`端口号`以及`hints`信息，该函数就会将名字资源的数据保存在了一个叫做`res`的`addrinfo`数据结构中，`res`就包含了服务器的IP等下一步所需的信息。

> 在发明`struct addrinfo`之前，我们都需要手动填写`res`中的每一个字段的，远不如现在`getaddrinfo()`帮我们处理地这么好。

还没完呢，这只是获取到了服务器的IP信息而已，我们还得创建客户端`socket`，然后进行`connect()`，但是再进一步讲解之前，我想先稍微解释一下代码中`hints`的信息分别是什么意思，毕竟让某些读者带着疑问往下读也是有些于心不忍。

`hints.ai_family`有3种选择，

- `AF_INET`，表示强制使用IPv4
- `AF_INET6`，表示强制使用IPv6
- `AF_UNSPEC`，随便，IPv4或者IPv6都行

`hints.ai_socktype`有2种选择，

- `SOCK_STREAM`，表示使用TCP协议
- `SOCK_DGRAM`，表示使用UDP协议

解释完了，然后我们用`res`中的数据继续我们的连接过程。从下面的代码中你可以看到，创建`socket`套接字以及`connect`所需要的所有信息我们都可以从`res`中直接获取到了。

```c
int s = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

connect(s, res->ai_addr, res->ai_addrlen);
```

有一点需要需要我们特别注意，在使用ip建立连接时，`connect()`的第二个参数我们采用了类型强转的方式，将`struct sockraddr_in *`强转成了`struct sockaddr *`。但是在使用域名`connect()`时，直接从`res`这个`addrinfo`结构中使用了`struct sockaddr *ai_addr`这个字段（不清楚的话再看一看`addrinfo`的数据结构）。

所以，`sockaddr`就是我们要学习的下一个数据结构了。

> 注：有些数据结构属于 IPv4，而有些是 IPv6，有些两者皆可，我会特別注明它们属于哪一种。

## struct—sockaddr

```c
struct sockaddr {
    unsigned short    sa_family;    // address family, AF_xxx
    char              sa_data[14];  // 14 bytes of protocol address
}; 
```

`sa_family`的可选值有很多，但是本小册中只会使用`AF_INET`（IPv4）或 `AF_INET6`（IPv6）。

`sa_data`包含了socket需要的目的地址以及端口号，但是这样实在是很不方便，因为你需要手动把ip地址和端口号打包到14字节的数组中。

为了解决这个问题，大佬们又创造了两个替代品，`sockaddr_in`和`sockaddr_in6`。

## struct—sockaddr_in

后缀`in`表示`internet`，而且这个数据结构只能用在`IPv4`！

非常重要的一点（其实上文已经提到过），`struct sockaddr_in *`类型可以和 `struct sockaddr *`相互进行类型转换。这就是为什么`connect()`函数需要一个`struct sockaddr *`参数，我们却可以通过使用`struct sockaddr_in *`进行强转传入的原因。

```c
// (IPv4专用--IPv6见下文的 sockaddr_in6)
    
struct sockaddr_in {
    short int          sin_family;  // Address family, AF_INET
    unsigned short int sin_port;    // Port number
    struct in_addr     sin_addr;    // Internet address
    unsigned char      sin_zero[8]; // Same size as struct sockaddr
};
```

`sockaddr_in`中的每个字段看起来就比`sockaddr`要清晰很多了。

`sin_zero`是为了让`sockaddr`与`sockaddr_in`两个数据结构保持大小相同而保留的空字节，使用之前应该使用`memset()`将所有数据置为0。

`sin_family`对应的就是`sockaddr`中的`sa_family`，应该设置为`AF_INET`。`sin_port`必须使用`htons()`使其符合[网络字节序](https://www.chanmufeng.com/posts/network-programming/%E5%AD%97%E8%8A%82%E5%BA%8F.html)。

再继续挖得深一点！`sockaddr_in`的`sin_addr`字段是`struct in_addr`结构：

```c
// (IPv4 专用--IPv6见下文的in6_addr)
    
// Internet address (由于历史原因而保留的一个数据结构)
struct in_addr {
  	uint32_t s_addr; // that's a 32-bit int (4 bytes)
};
```

用起来很简单，如果你声明了一个`sockaddr_in`的变量`sin`，那么`sin.sin_addr.s_addr`表示的就是一个4字节的IP地址（符合网络字节序）。

IPv4的说完了，对应着，我们再看看IPv6的。

## struct—sockaddr_in6

```c
// (IPv6 专用--IPv4见上文的sockaddr_in)
    
struct sockaddr_in6 {
    u_int16_t       sin6_family;   // address family, AF_INET6
    u_int16_t       sin6_port;     // port number, Network Byte Order
    u_int32_t       sin6_flowinfo; // IPv6 flow information
    struct in6_addr sin6_addr;     // IPv6 address
    u_int32_t       sin6_scope_id; // Scope ID
};
    
struct in6_addr {
    unsigned char   s6_addr[16];   // IPv6 address
};
```

`sin6_family`对应的是`sockaddr_in`的`sin_family`字段，`sin6_port`对应的是`sockaddr_in`的`sin_port`字段，`sin6_addr`对应的是`sockaddr_in`的`sin_addr`字段。

至于`sin6_flowinfo`和`sin6_scope_id`本小册就不会涉及了，毕竟我们是简明教程嘛。

hold on～hold on～

还没结束，最后再介绍一个数据结构，那句英文怎么说来着？Last but not least，虽然它排在最后，但是也不容忽视。

## struct—sockaddr_storage

`sockaddr_storage`是一个与`sockaddr`同一级别的数据结构，用来保存IPv4地址和IPv6地址。

不是已经有了`sockaddr_in`来保存IPv4，`sockaddr_in6`来保存IPv6了嘛？甚至`sockaddr`还通用，为什么还需要`sockaddr_storage`呢？

因为有些时候你可能无法提前确定你要使用IPv4还是IPv6！

你可能会问，这有什么关系呢？我们还有`sockaddr`啊，它可是通吃啊。

对，通吃！但只是名义上的。我们来分析一下。

`sockaddr`身为一个通用的地址数据结构，理论上的大小就应该是所有具体协议地址结构大小的最大值。但是`sizeof(struct sockaddr) = 16`, 而`sizeof(struct sockaddr_in6) = 28`，`sockaddr`没有能力保存IPv6啊。

于是`sockaddr_storage`就诞生了。它的大小为128字节，应该能装得下目前所以协议的地址结构了。

```c
struct sockaddr_storage {
  sa_family_t  ss_family;     // address family

  // all this is padding, implementation specific, ignore it:
  char      __ss_pad1[_SS_PAD1SIZE];
  int64_t   __ss_align;
  char      __ss_pad2[_SS_PAD2SIZE];
};
```

举个栗子吧：

```c
struct sockaddr_storage addr;
memset(&addr, 0, sizeof(struct sockaddr_storage));
if (isIPv6 == TRUE)
{
    struct sockaddr_in6 *addr_v6 = (struct sockaddr_in6 *)&addr;
    addr_v6->sin6_family = AF_INET6;
    addr_v6->sin6_port = 80;
    inet_pton(AF_INET6, “2201:3212::1”, &(addr_v6->sin6_addr));
}
else
{
    struct sockaddr_in *addr_v4 = (struct sockaddr_in *)&addr;
    addr_v4->sin_family = AF_INET;
    addr_v4->sin_port = 80;
    inet_aton(“192.168.0.45”, &(addr_v4->sin_addr));
}

sendto(sock, buf, len, 0, (struct sockaddr *)&addr, sizeof(struct sockaddr_storage));
```

总结一下你也就明白了，对于存储地址的数据结构，一共有4种，并且每种之间都可以进行转换

- `sockaddr`（最原始的数据结构，但是装不下IPv6）
- `sockaddr_in`（专用于IPv4）
- `sockaddr_in6`（专用于IPv6）
- `sockaddr_storage`（相当于`sockaddr`的补丁，能装不下IPv6）

在大多数情况下，后3种结构都需要强转为`sockaddr`，你可能会问为什么不直接传入`sockaddr_storage`呢？这也是没办法的事情，因为api从一开始的时候就已经确定好了，变了的话旧代码也就不能运行了。我们能做的就是打补丁。

很多奇奇怪怪数据结构的出现，就是由于最开始没想到会发展到现在这种情况而导致的。包括现在也一样，我们很难预测未来的全部变化，能想到最好，想不全或是低估未来才是常态。

