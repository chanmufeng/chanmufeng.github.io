---
title: close() and shutdown()—滚犊子！
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

 当你玩儿够了`send()`和`recv()`，你可能想关闭你的`socket descriptor`连接了，这个操作很简单，只需要调用`close()`函数就可以了：

```c
close(sockfd)
```

这将避免`sockfd`进行更多的读写操作，任何想要对这个`socket`进行读写的操作都会报错。

如果你想对`socket`关闭的姿势多一点控制，那你应该使用的是`shutdown()`函数，它允许选择性地切断单向连接或者双向连接（这一点和`close()`一样）。语法如下：

```c
int shutdown(int sockfd, int how);
```

`sockfd`表示你想关闭的`socket file descriptor`，`how`的参数以及含义见下表： 

| how的值 |                 含义                  |
| :-----: | :-----------------------------------: |
|    0    |             禁止接收数据              |
|    1    |             禁止发送数据              |
|    2    | 禁止接收、发送数据（和`close()`相同） |

`shutdown()`成功时返回`0`，失败时返回`-1`，并且设置全局变量`errno`。

如果你在`unconnected datagram socket`上使用`shutdown()`，它只会单纯地让`socket`无法继续进行`send()`和`recv()`调用。如果你想让`shutdown()`发挥原本的作用，那么你应该把它用在使用了`connect()`函数的`datagram socket`身上。

需要强调的是，`shutdown()`并不会实际关闭`file descriptor`，只是改变了可用状态而已。想要真正释放`file descriptor`，你还是得调用`close()`。

没了。

「对了，如果你用的是`Windows`和`Winsock`，你需要用的是`closesocket()`，而不是`close()`，谨记！」
