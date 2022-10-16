---
title: poll()——同步IO多路复用
index: false
article: false
category:
- socket
# 设置写作时间
date: 2022-10-16
# 一个页面可以有多个标签
tag:
- socket编程
---

你可能在想，有没有一种办法，可以同时监听多个socket，然后只处理其中已经有数据的socket呢？这样的话我们就不用傻乎乎地不停轮询，来检查哪些socket已经有数据了。

> 警告：随着连接数变得巨大，poll()函数会变得巨慢！这种情况下，推荐你使用[libevent](https://libevent.org/)这样的事件。它会尝试使用你系统上可用的最快方法，获得更好的性能。

那怎么避免poll（轮询）呢？说起来有点搞笑，你可以使用`poll()`这个系统调用来避免poll（轮询）。本质上，我们都是让内核来替我们做各种脏活累活，然后告诉我们哪些socket有数据可读了。没有数据可读的时候我们的进程可以处于休眠状态，不会占用CPU。

一般的做法是维护一个 `struct pollfd`的数组，其中包含我们想要监听的`socket descriptor`以及我们想要监听的事件类型的信息。内核会阻塞在`poll()`这个调用上，直到你关注的其中一个事件发生（比如“socket ready to read！”）或直到发生用户指定超时。

拿TCP Server端程序举个例子，下面的代码其实还是`blocking`的代码，写出来就是为了方便我翻译原文的一句话（如果硬翻译实在是不好理解）。根据套路编写了4步流程：`socket()`、`bind()`、`listen()`以及`accept()`。

```c
int sockfd, new_fd;  

if ((sockfd = socket(XXX,XXX,XXX) == -1) {
  ...
}

...

if (bind(sockfd, XXX, XXX) == -1) {
  ...
}

...


if (listen(sockfd, BACKLOG) == -1) {
  ...
}

while(1) {  
 
  new_fd = accept(sockfd, XXX, XXX);
 	...
}

```

在`blocking`代码中，程序会阻塞在`accept()`，直到有一个Client连接上来。但是在`non-blocking`程序中，有Client连接上来准备被`accept()`调用之前，`sockfd`就会直接告诉我们有一个新的连接来了，我们接着找到他，然后`accept()`处理即可。大家可以对比一下这两者之间的区别。

说得不少了，看一下`poll()`的用法：

```c
#include <poll.h>

//返回： 如果有就绪的描述符则为其数目，若超时返回0，若出错返回-1
int poll(struct pollfd fds[], nfds_t nfds, int timeout);
```

`fds`是一个结构数组，数组中每个元素都是一个`pollfd`结构，保存了「监听哪个socket的什么事件」的信息；`nfds`是数组的数量；`timeout`是设置的超时时间，以毫秒为单位。`poll()`返回就绪（有时间发生）的描述符数量，若超时返回`0`，若出错返回`-1`。

我们看一下`pollfd`结构：

```c
struct pollfd {
  int fd;         // the socket descriptor
  short events;   // 我们感兴趣的事件组成的 bitmap
  short revents;  // poll() 返回时，已发生事件组成的 bitmap
};
```

`fd`表示的就是你想监听的`socket descriptor`，通过设置`events`字段来指定我们感兴趣的事件类型。

events字段时下表中值的按位或：

|  常值   |                说明                |
| :-----: | :--------------------------------: |
| POLLIN  | 当数据可读时（recv()可读），提醒我 |
| POLLOUT | 当数据可写时（send()可写），提醒我 |

得到`struct pollfd`数组之后，你就可以将其传给`poll()`函数了，同时传递的还有数组的长度以及以毫秒为单位的超时时间（你也可以指定一个负数，表示永久等待）。

`poll()`返回之后，你可以检查`revents`字段，查看是否设置了`POLLIN`或`POLLOUT`，来判断是否有事件发生。

> 实际上，你可以使用`poll()`进行更多操作，更多细节，参见后文的`poll()`使用手册。

下面给出一个例子，当你在命令行敲击一下回车或者等2.5秒钟，你会看到`poll()`返回的不同状态，运行一下试试吧：

```c
#include <stdio.h>
#include <poll.h>

int main(void)
{
    struct pollfd pfds[1]; // 如果你需要监听更多的socket，就设置得更大一点

    pfds[0].fd = 0;          // 0 表示标准输入
    pfds[0].events = POLLIN; // Tell me when ready to read

    // If you needed to monitor other things, as well:
    //pfds[1].fd = some_socket; // Some socket descriptor
    //pfds[1].events = POLLIN;  // Tell me when ready to read

    printf("Hit RETURN or wait 2.5 seconds for timeout\n");

    int num_events = poll(pfds, 1, 2500); // 2.5 second timeout

    if (num_events == 0) {
        printf("Poll timed out!\n");
    } else {
        int pollin_happened = pfds[0].revents & POLLIN;

        if (pollin_happened) {
            printf("File descriptor %d is ready to read\n", pfds[0].fd);
        } else {
            printf("Unexpected event occurred: %d\n", pfds[0].revents);
        }
    }

    return 0;
}
```

强调一下，`poll()`返回的是`pfds`数组中有事件发生的元素数量，但是并不会告诉你数组中有哪些元素（你需要循环判断）有事件发生。

随之而来会出现几个问题。

如何向传递给`poll()`的数组中添加新的`file descriptor`？你只要确保数组中有足够的空间来满足你的需求即可，或者根据你的需求调用 `realloc()` 重新分配内存。

怎么删除`pfds`中的元素呢？你可以将`pfds`中的最后一个数据（实际有用的数据）复制到你想删除的位置上，然后将传给`poll()`的数组长度参数 - 1。或者你也可以将你想删除的元素设置为负数，`poll()`会忽略它的。

接下来看一个稍微麻烦点儿的例子，用`poll()`编写一个聊天室。

我们需要启动一个`listener socket`，并将其添加到`poll()`的`file descriptors`集合中，这样我们就能通过它判断是不是有Client连接上来了。

然后我们把新连接添加到`struct pollfd`数组中，根据我们实际需要动态调整它的容量。当连接断开时，我们再将其从数组中清除。

当连接中有数据可读时，我们从中将数据取出并将其转发到其他连接中，这样就实现了聊天室的功能。

下面给出`pollserver.c`的代码。你可以在一个窗口中运行它，然后在其他命令行窗口中执行`telnet localhost 9034`。之后你在各个窗口命令行中输入的信息（记得敲回车），就可以在其他窗口中看到了。

不仅如此，当你输入`quit`推出`telnet`时，服务端会检测到连接断开，并且从`file descriptor`数组中将其移出。

```c
/*
** pollserver.c -- a cheezy multiperson chat server
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <poll.h>

#define PORT "9034"   // Port we're listening on

// Get sockaddr, IPv4 or IPv6:
void *get_in_addr(struct sockaddr *sa)
{
    if (sa->sa_family == AF_INET) {
        return &(((struct sockaddr_in*)sa)->sin_addr);
    }

    return &(((struct sockaddr_in6*)sa)->sin6_addr);
}

// Return a listening socket
int get_listener_socket(void)
{
    int listener;     // Listening socket descriptor
    int yes=1;        // For setsockopt() SO_REUSEADDR, below
    int rv;

    struct addrinfo hints, *ai, *p;

    // Get us a socket and bind it
    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;
    if ((rv = getaddrinfo(NULL, PORT, &hints, &ai)) != 0) {
        fprintf(stderr, "selectserver: %s\n", gai_strerror(rv));
        exit(1);
    }
    
    for(p = ai; p != NULL; p = p->ai_next) {
        listener = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
        if (listener < 0) { 
            continue;
        }
        
        // Lose the pesky "address already in use" error message
        setsockopt(listener, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int));

        if (bind(listener, p->ai_addr, p->ai_addrlen) < 0) {
            close(listener);
            continue;
        }

        break;
    }

    freeaddrinfo(ai); // All done with this

    // If we got here, it means we didn't get bound
    if (p == NULL) {
        return -1;
    }

    // Listen
    if (listen(listener, 10) == -1) {
        return -1;
    }

    return listener;
}

// Add a new file descriptor to the set
void add_to_pfds(struct pollfd *pfds[], int newfd, int *fd_count, int *fd_size)
{
    // If we don't have room, add more space in the pfds array
    if (*fd_count == *fd_size) {
        *fd_size *= 2; // Double it

        *pfds = realloc(*pfds, sizeof(**pfds) * (*fd_size));
    }

    (*pfds)[*fd_count].fd = newfd;
    (*pfds)[*fd_count].events = POLLIN; // Check ready-to-read

    (*fd_count)++;
}

// Remove an index from the set
void del_from_pfds(struct pollfd pfds[], int i, int *fd_count)
{
    // Copy the one from the end over this one
    pfds[i] = pfds[*fd_count-1];

    (*fd_count)--;
}

// Main
int main(void)
{
    int listener;     // Listening socket descriptor

    int newfd;        // Newly accept()ed socket descriptor
    struct sockaddr_storage remoteaddr; // Client address
    socklen_t addrlen;

    char buf[256];    // Buffer for client data

    char remoteIP[INET6_ADDRSTRLEN];

    // Start off with room for 5 connections
    // (We'll realloc as necessary)
    int fd_count = 0;
    int fd_size = 5;
    struct pollfd *pfds = malloc(sizeof *pfds * fd_size);

    // Set up and get a listening socket
    listener = get_listener_socket();

    if (listener == -1) {
        fprintf(stderr, "error getting listening socket\n");
        exit(1);
    }

    // Add the listener to set
    pfds[0].fd = listener;
    pfds[0].events = POLLIN; // Report ready to read on incoming connection

    fd_count = 1; // For the listener

    // Main loop
    for(;;) {
        int poll_count = poll(pfds, fd_count, -1);

        if (poll_count == -1) {
            perror("poll");
            exit(1);
        }

        // Run through the existing connections looking for data to read
        for(int i = 0; i < fd_count; i++) {

            // Check if someone's ready to read
            if (pfds[i].revents & POLLIN) { // We got one!!

                if (pfds[i].fd == listener) {
                    // If listener is ready to read, handle new connection

                    addrlen = sizeof remoteaddr;
                    newfd = accept(listener,
                        (struct sockaddr *)&remoteaddr,
                        &addrlen);

                    if (newfd == -1) {
                        perror("accept");
                    } else {
                        add_to_pfds(&pfds, newfd, &fd_count, &fd_size);

                        printf("pollserver: new connection from %s on "
                            "socket %d\n",
                            inet_ntop(remoteaddr.ss_family,
                                get_in_addr((struct sockaddr*)&remoteaddr),
                                remoteIP, INET6_ADDRSTRLEN),
                            newfd);
                    }
                } else {
                    // If not the listener, we're just a regular client
                    int nbytes = recv(pfds[i].fd, buf, sizeof buf, 0);

                    int sender_fd = pfds[i].fd;

                    if (nbytes <= 0) {
                        // Got error or connection closed by client
                        if (nbytes == 0) {
                            // Connection closed
                            printf("pollserver: socket %d hung up\n", sender_fd);
                        } else {
                            perror("recv");
                        }

                        close(pfds[i].fd); // Bye!

                        del_from_pfds(pfds, i, &fd_count);

                    } else {
                        // We got some good data from a client

                        for(int j = 0; j < fd_count; j++) {
                            // Send to everyone!
                            int dest_fd = pfds[j].fd;

                            // Except the listener and ourselves
                            if (dest_fd != listener && dest_fd != sender_fd) {
                                if (send(dest_fd, buf, nbytes, 0) == -1) {
                                    perror("send");
                                }
                            }
                        }
                    }
                } // END handle data from client
            } // END got ready-to-read from poll()
        } // END looping through file descriptors
    } // END for(;;)--and you thought it would never end!
    
    return 0;
}
```

在下一节，我们会看学到一个功能类似，但是更老的一个函数`select()`。`poll()`和`select()`两者功能类似，性能也差不太多，区别主要在于它们的用法。

相比之下，`select()`的可移植性稍微强一点，但是使用起来稍显笨拙。学完下一节之后，根据你的系统支持情况，选择一个你最喜欢的即可。
