---
title: Datagram Sockets
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

`UDP datagram socket` 的基础我们在`sendto()`和`recvfrom()`那一节的已经讲过了。本节，我将给出两段程序： `talker.c` 和 `listener.c`。

 `listener.c`运行在主机上一直等待着去往`4950`端口的数据包。`talker`将用户在命令行输入的数据从指定的主机发往`4950`端口。

因为`datagram sockets`是无连接的，因此只需要把数据包通过以太网发送出去就行，甭管成功失败。

此外，程序中我们令Client和Server都使用IPv6。这样以来就避免了Server段使用IPv6，而Client使用IPv4导致数据不会被接收的这种情况。

> 实际上，在使用`TCP stream sockets`的情况下，我们依然可能会碰到地址族不匹配的情况，但是由于我们会使用`connect()`函数，如果因为地址族的问题导致`connect()`报错，就等于显式提醒我们需要换另一个地址族了。

下面给出 `listener.c`的代码：

```c
/*
** listener.c -- a datagram sockets "server" demo
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define MYPORT "4950"    // the port users will be connecting to

#define MAXBUFLEN 100

// get sockaddr, IPv4 or IPv6:
void *get_in_addr(struct sockaddr *sa)
{
    if (sa->sa_family == AF_INET) {
        return &(((struct sockaddr_in*)sa)->sin_addr);
    }

    return &(((struct sockaddr_in6*)sa)->sin6_addr);
}

int main(void)
{
    int sockfd;
    struct addrinfo hints, *servinfo, *p;
    int rv;
    int numbytes;
    struct sockaddr_storage their_addr;
    char buf[MAXBUFLEN];
    socklen_t addr_len;
    char s[INET6_ADDRSTRLEN];

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET6; // set to AF_INET to use IPv4
    hints.ai_socktype = SOCK_DGRAM;
    hints.ai_flags = AI_PASSIVE; // use my IP

    if ((rv = getaddrinfo(NULL, MYPORT, &hints, &servinfo)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
        return 1;
    }

    // loop through all the results and bind to the first we can
    for(p = servinfo; p != NULL; p = p->ai_next) {
        if ((sockfd = socket(p->ai_family, p->ai_socktype,
                p->ai_protocol)) == -1) {
            perror("listener: socket");
            continue;
        }

        if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
            close(sockfd);
            perror("listener: bind");
            continue;
        }

        break;
    }

    if (p == NULL) {
        fprintf(stderr, "listener: failed to bind socket\n");
        return 2;
    }

    freeaddrinfo(servinfo);

    printf("listener: waiting to recvfrom...\n");

    addr_len = sizeof their_addr;
    if ((numbytes = recvfrom(sockfd, buf, MAXBUFLEN-1 , 0,
        (struct sockaddr *)&their_addr, &addr_len)) == -1) {
        perror("recvfrom");
        exit(1);
    }

    printf("listener: got packet from %s\n",
        inet_ntop(their_addr.ss_family,
            get_in_addr((struct sockaddr *)&their_addr),
            s, sizeof s));
    printf("listener: packet is %d bytes long\n", numbytes);
    buf[numbytes] = '\0';
    printf("listener: packet contains \"%s\"\n", buf);

    close(sockfd);

    return 0;
}
```

需要注意的是，我们在 `getaddrinfo()` 时，使用了 `SOCK_DGRAM`。而且我们没有使用 `listen()` 或者 `accept()`函数，这是使用`unconnected datagram sockets`的好处之一。

接下来看一下`talker`的代码：

```c
/*
** talker.c -- a datagram "client" demo
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

#define SERVERPORT "4950"    // the port users will be connecting to

int main(int argc, char *argv[])
{
    int sockfd;
    struct addrinfo hints, *servinfo, *p;
    int rv;
    int numbytes;

    if (argc != 3) {
        fprintf(stderr,"usage: talker hostname message\n");
        exit(1);
    }

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET6; // set to AF_INET to use IPv4
    hints.ai_socktype = SOCK_DGRAM;

    if ((rv = getaddrinfo(argv[1], SERVERPORT, &hints, &servinfo)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
        return 1;
    }

    // loop through all the results and make a socket
    for(p = servinfo; p != NULL; p = p->ai_next) {
        if ((sockfd = socket(p->ai_family, p->ai_socktype,
                p->ai_protocol)) == -1) {
            perror("talker: socket");
            continue;
        }

        break;
    }

    if (p == NULL) {
        fprintf(stderr, "talker: failed to create socket\n");
        return 2;
    }

    if ((numbytes = sendto(sockfd, argv[2], strlen(argv[2]), 0,
             p->ai_addr, p->ai_addrlen)) == -1) {
        perror("talker: sendto");
        exit(1);
    }

    freeaddrinfo(servinfo);

    printf("talker: sent %d bytes to %s\n", numbytes, argv[1]);
    close(sockfd);

    return 0;
}
```

这些就是全部了。你在某台主机上执行`listener`，然后在另一台主机上执行`talker`，观察它们之间的通信，你会发现这很有趣。

你甚至都可以不先执行Server！可以只执行`talker`，`talker`会很开心地将数据包扔到网络上，如果另一段没有人负责用`recvfrom()`接收，大不了就是数据包丢了而已。

> 谨记：`UDP`发送数据并不会保证数据一定会送达对方。

这里提一下之前提过很多次的一个小细节：`connected datagram sockets`，毕竟我们这节讲的就是`datagram socket`嘛。

如果`talker`调用了`connect()`并且指定了`listener`的地址，这样一来，`talker`只能和`connect()`指定的地址进行数据发送与接收。这就是`connected datagram socket`，你也可以不必局限于`sendto()`和`recvfrom()`，直接使用`send()`和`recv()`就可以了。
