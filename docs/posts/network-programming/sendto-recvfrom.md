---
title: sendto()和recvfrom()——用DGRAM风格跟我说话
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

`datagram socket`在发送数据数据之前不需要建立和对方的连接，但是在发送数据之前我们起码得把目的地址给准备好。

看一下`sendto()`这个函数：

```c
int sendto(int sockfd, const void *msg, int len, unsigned int flags,
           const struct sockaddr *to, socklen_t tolen);
```

除了后边两个参数，剩下的参数和`send()`函数基本保持一致，就不再介绍了。

`to`是一个指向 `struct sockaddr`（也可能是被强制类型转换成的 `struct sockaddr_in` 、 `struct sockaddr_in6` 或者 `struct sockaddr_storage`结构 ）的指针，这个struct中包含了目的IP地址和端口号。`tolen`是一个`int`变量，可以简单地设置为`sizeof *to`或`sizeof(struct sockaddr_storage)`。

想得到包含目的地址的这个数据结构，你需要通过调用 `getaddrinfo()`或者下文的 `recvfrom()`，你也可以手动封装。

类似`send()`，`sendto()`的返回值表示的也是实际发送字节数，而且这个数可能比你想发送的大小要小。执行异常就返回`-1`。

`recvfrom()`和`recv()`差不多，`recvfrom()`语法如下：

```c
int recvfrom(int sockfd, void *buf, int len, unsigned int flags,
             struct sockaddr *from, int *fromlen);
```

你看，是不是除了最后两个参数之外其他差不多啊。`from`是一个指向本地的`struct sockaddr_storage`结构的指针，其中保存了数据包来源主机的IP地址和端口。`fromlen`是一个整数类型指针，这个整数应该被初始化为 `sizeof *from` 或者 `sizeof(struct sockaddr_storage)`。`recvfrom()`函数调用完成之后，`fromlen`保存的是实际存储在`from`结构中的地址长度。

`recvfrom()`的返回值表示实际读取到的数据字节数，异常返回`-1`，并设置`errno`值。

有个问题啊，为什么我上文说`from`是一个指向`struct sockaddr_storage`的结构啊，为什么不是 `struct sockaddr_in`？因为我们不想在IPv4或者IPv6一棵树上吊死，而`sockaddr_storage`有足够的存储空间让我们来自由选择IPv4还是IPv6地址。

你可能又会提出一个问题，为什么不把 `struct sockaddr` 设计的足够容纳任何地址呢，这样不就不用来回强转了嘛。这都是历史原因了，当时也没想到IPv4的地址不够用，所以只能新设计一个`struct sockaddr_storage` 了。

谨记，如果你对`datagram socket`使用`connect()`，你可以直接使用`send()`和`recv()`。`socket`本身仍然是`datagram socket`，并且协议用的也是`UDP`，只不过`socket`接口会自动帮你添加目的和来源信息。
