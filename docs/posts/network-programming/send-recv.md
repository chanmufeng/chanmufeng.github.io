---
title: 跟我唠唠吧，宝儿!
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

`send()`和`recv()`两个函数是服务端和客户端通过`stream socket`或者是`connected datagram socket`用来通信的。如果你想使用常规的`unconnected datagram socket`，你需要参考下文的`sendto()`和`recvfrom()`一节了。

`send()`的声明长这样儿：

```c
int send(int sockfd, const void *msg, int len, int flags); 
```

`sockfd`是一个你想发送数据过去的`socket descriptor`，这个`socket descriptor`可能是`socket()`返回的，也可能是通过`accept()`得到的。

`msg`是指向发想发送的数据的指针，`len`是数据的字节长度。至于`flags`，你就直接设置成`0`就完了（更多的细节参见后文的`send()`手册，PS：还没翻译到那里）。

上例子：

```c
char *msg = "Hello World!";
int len, bytes_sent;
.
.
.
len = strlen(msg);
bytes_sent = send(sockfd, msg, len, 0);
.
.
. 
```

`send()`的返回值表示实际发送数据的字节数，这个数可能比你设置的想发送的数据长度`len`要小。事情就是这么奇怪，明明你想让函数发送所有的数据，它却做不到，它只能尽力把能发送的数据都发送出去，但是它不会自动发送剩下的数据。

因此，如果`send()`返回的值小于`len`的话，就需要由你来决定是不是要发送剩下的数据了。也并非每次都这样，如果数据包很小（小于`1K`或更小），`send()`**可能**会一下子把所有数据都发出去。

再强调一遍，`send()`异常的话会返回`-1`，并且修改`errno`这个全局变量。

`recv()`这个函数在很多方面和`send()`类似：

```c
int recv(int sockfd, void *buf, int len, int flags);
```

`sockfd`是你想从中读取数据的`socket descriptor`，`buf`是存储你读取的数据的缓冲区，`len`是缓冲区的最大长度，`flags`还是直接设置成`0`就行（更多的细节参见之后的`recv()`手册，PS：还没翻译到那里）。

`recv()`的返回值表示实际读到缓冲区的字节数，异常的话会返回`-1`，并且修改`errno`这个全局变量。

注意！`recv()`的返回值可以是`0`，是`0`意味着对面关闭了与你的连接，返回`0`是为了让你知道这回事儿。

到这就结束了，很简单对吧。你现在可以通过`stream socket`进行往返数据处理了。

恭喜你，正式成为一名UNIX网络编程设计师！

