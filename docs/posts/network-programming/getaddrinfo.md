---
title: getaddrinfo()—准备开始！
index: false
description: '这是socket编程需要使用的第一个函数，它有非常多的参数，但是别害怕，用起来其实非常简单。这个函数的作用是帮你设置之后需要的struct'
category:
- socket
# 设置写作时间
date: 2022-10-10
# 一个页面可以有多个标签
tag:
- socket编程
---

这是socket编程中非常重要的一个函数，它有非常多的参数，但是别害怕，用起来其实非常简单。这个函数的作用是帮你设置之后需要的struct。

稍微提一嘴它的历史：它的前身是用来做DNS查询的`gethostbyname()`，当时还需要你手动把数据设置到`struct sockaddr_in`中呢。谢天谢地，现在不用了。

使用`getaddrinfo()`可以帮助你写出兼容IPv4和IPv6的代码，甚至在帮你进行DNS查询和service name查询之后，还会自动将你需要的信息填充到`struct`中，咱就说多牛！

看一眼长啥样先。

```c
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

int getaddrinfo(const char *node,     // e.g. "www.example.com" or IP
                const char *service,  // e.g. "http" or port number
                const struct addrinfo *hints,
                struct addrinfo **res);
```

你传给它3个参数（其实是4个，但是第4个只是个声明的变量而已），它给你返回一个指向链表的指针`res`。

其中，`node`参数是你想进行连接的服务器的域名，或者IP地址。

`service`参数可以是个端口号，比如“`80`”，或者是一个特定服务的名称，比如“`http`”、“`ftp`”、“`telnet`”、“`smtp`” 等。

最后，`hints`参数指向了一个需要你设置相关参数的`struct addrinfo`。

> 常用端口号以及服务名可以参见 [The IANA Port List](https://www.iana.org/assignments/port-numbers)或者Unix设备上的`/etc/services`文件

接下来给一个服务端程序监听本机IP地址和`3490`端口的例子。需要注意的是，代码示例中并没有做监听（listen）和任何网络设置的工作，只是简单设置了之后会用到数据结构而已。

```c
int status;
struct addrinfo hints;
struct addrinfo *servinfo;  // will point to the results

memset(&hints, 0, sizeof hints); // make sure the struct is empty
hints.ai_family = AF_UNSPEC;     // don't care IPv4 or IPv6
hints.ai_socktype = SOCK_STREAM; // TCP stream sockets
hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

if ((status = getaddrinfo(NULL, "3490", &hints, &servinfo)) != 0) {
    fprintf(stderr, "getaddrinfo error: %s\n", gai_strerror(status));
    exit(1);
}

// servinfo 现在指向了包含1个或多个addrinfo结构的链表

// ... do everything until you don't need servinfo anymore ....

freeaddrinfo(servinfo); // free the linked-list
```

注意，我将`ai_family`设置成了`AF_UNSPEC`，也就意味着我压根不在意我们用IPv4还是IPv6。如果你想精确指定IPv4或者IPv6的话请使用`AF_INET`或`AF_INET6`。

你可能注意到了，我把`ai_flags`设置为了`AI_PASSIVE`，意思是告诉`getaddrinfo()`函数把我本机的IP设置到`servinfo`中，这样我就不用将`getaddrinfo()`的第一个参数（如果忘了是啥意思，看看上文）硬编码了，直接设置成`NULL`就行了。

然后我们就调用`getaddrinfo()`了。如果函数报错（返回值不为0），我们会使用`gai_strerror() `函数将错误打印出来。如果程序正常运行，那么`servinfo`最终就会指向一个由`struct addrinfo`链接形成的链表，链表中每一个元素都会包含一个我们之后会用到的`struct sockaddr`。

最后，`getaddrinfo()`会在堆内存中创建`servinfo`指向的链表，使用完之后一定要使用`freeaddrinfo()`进行内存释放。

再给一个客户端代码的例子，我们假设客户端想连接到域名为“www.chanmufeng.com”，端口为`3490`的服务器。再次强调，代码片段中省略了实际进行链接的部分，只是简单设置了之后会用到数据结构而已。

```c
int status;
struct addrinfo hints;
struct addrinfo *servinfo;  // will point to the results

memset(&hints, 0, sizeof hints); // make sure the struct is empty
hints.ai_family = AF_UNSPEC;     // don't care IPv4 or IPv6
hints.ai_socktype = SOCK_STREAM; // TCP stream sockets

// get ready to connect
status = getaddrinfo("www.chanmufeng.com", "3490", &hints, &servinfo);

// servinfo now points to a linked list of 1 or more struct addrinfos

// etc.
```

这段代码比server端的代码还简单，就不过多解释了。

接着我们综合使用一下我们学过的知识，写一段稍微长一丢丢的demo，这个demo的作用是打印你在命令行上指定的任何主机的IP地址。

```c
/*
** showip.c -- show IP addresses for a host given on the command line
*/

#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <netinet/in.h>

int main(int argc, char *argv[])
{
    struct addrinfo hints, *res, *p;
    int status;
    char ipstr[INET6_ADDRSTRLEN];

    if (argc != 2) {
        fprintf(stderr,"usage: showip hostname\n");
        return 1;
    }

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC; // AF_INET or AF_INET6 to force version
    hints.ai_socktype = SOCK_STREAM;

    if ((status = getaddrinfo(argv[1], NULL, &hints, &res)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(status));
        return 2;
    }

    printf("IP addresses for %s:\n\n", argv[1]);

    for(p = res;p != NULL; p = p->ai_next) {
        void *addr;
        char *ipver;

        // get the pointer to the address itself,
        // different fields in IPv4 and IPv6:
        if (p->ai_family == AF_INET) { // IPv4
            struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
            addr = &(ipv4->sin_addr);
            ipver = "IPv4";
        } else { // IPv6
            struct sockaddr_in6 *ipv6 = (struct sockaddr_in6 *)p->ai_addr;
            addr = &(ipv6->sin6_addr);
            ipver = "IPv6";
        }

        // convert the IP to a string and print it:
        inet_ntop(p->ai_family, addr, ipstr, sizeof ipstr);
        printf("  %s: %s\n", ipver, ipstr);
    }

    freeaddrinfo(res); // free the linked list

    return 0;
}
```

程序使用你在命令行中输入的参数来调用`getaddrinfo()`，然后我们就得到了`res`指向的链表，遍历链表每个节点我们就能得到全部的IP信息。

运行方式如下：

```bash
$ showip www.example.net
IP addresses for www.example.net:

	IPv4: 192.0.2.88

$ showip ipv6.example.com
IP addresses for ipv6.example.com:

	IPv4: 192.0.2.101
	IPv6: 2001:db8:8c00:22::171
```

现在一切尽在我们掌握之中了，我们可以将`getaddrinfo()`自动为我们填充好的数据传递给其他的socket函数，这就是把`getaddrinfo()`函数放在第一位进行介绍的原因了。

更多socket系统调用，请期待下篇。
