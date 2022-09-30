---
title: 两种Internet Socket
index: false
category:
- socket
# 设置写作时间
date: 2022-09-30
# 一个页面可以有多个标签
tag:
- socket编程
---

啥？只有两种`Internet Socket`吗？

开玩笑的啦，当然远不止两种喽。但是为了怕吓到你，这里主要介绍`Stream Sockets`以及`Datagram Sockets`。除此之外，`Raw Sockets`（原始套接字）也是一种功能更加强大的Socket，如果感兴趣，你可以查一查资料了解一下。

![image-20220930154115557](http://qiniu.chanmufeng.com/2022-09-30-074116.png)

如果要进行网络通信，我们要做的第一件事肯定是调用`socket()`函数，并指定想使用的套接字类型，比如`SOCK_STREAM`、`SOCK_DGRAM`、`SOCK_RAW`等类型，他们分别表示`Stream Sockets`、`Datagram Sockets`以及`Raw Sockets`。

我们先从`Stream Sockets`说起。

## Stream Sockets

`Stream sockets`是一种可靠的、支持双向连接的通信流。

如果你以“1，2”的顺序将这串数字发送到socket中，那么在接收端就会以同样的顺序接受到“1，2”，肯定不会出错。

哪里会用到`Stream sockets`呢？

或许你听说过`telnet`程序？`telnet`用的就是`Stream sockets`，你输入的每个字符都必须按照你的输入顺序依次抵达，要不然指令肯定就错乱了不是？

同样，浏览器使用的`HTTP`协议底层也使用了`Stream sockets`来获取网页信息。如果你通过80端口`telnet`到一个网站，并输入 "`GET / HTTP/1.0`"，然后按两下Enter，你就会收到网站发送给你的 HTML ！

`Stream sockets` 是怎么做到如此高质量地传输数据的呢？

`Stream sockets `底层使用了 "The Transmission Control Protocol"（传输控制协议），就是大名鼎鼎的 "`TCP`"（TCP 的全部细节可以参考[RFC 793](https://tools.ietf.org/html/rfc793)）。

`TCP `会确保你的数据可以按照顺序抵达而且不会出错。你之前可能是从"`TCP/IP`"这个专业名词中听说的`TCP`，其中的`IP` 是指 "Internet Protocol"（网络协议，详见 [RFC 791](https://tools.ietf.org/html/rfc791)）。`IP` 主要处理数据在各个节点之间的Internet routing（网络路由），通常不保障数据的完整性。

## Datagram Sockets

`Datagram sockets` 有时候被叫做 “connectionless sockets”（无连接的sockets），而且，这玩意通常也不怎么可靠！

为啥？

因为`Datagram Sockets`底层用的是“User Datagram Protocol”（用户数据报协议，详见[RFC 768](https://tools.ietf.org/html/rfc768)），也就是“`UDP`”。

`UDP`并不像`TCP`那样会直接在传输层将数据量过大的消息分片（TCP segments），而是会在IP层被动进行分包，将一个IP packet分包成多个IP fragments。这样一来，接收端就必须做IP fragments的重组，合并为原来的IP packet，这无疑增加了数据包丢失的概率。（其实分包倒还好，主要是UDP没有TCP那么强大的纠错能力）

如果你发送了一个 `datagram`（UDP的数据报），它可能会顺利抵达、但可能不会按照发送顺序抵达。

> 译者注：下文将称UDP发送的数据为datagram，之后提到这个词就意味着使用的是UDP协议

那为什么又会被称为“无连接的sockets”呢？

因为`Datagram Sockets`不用像`Stream Sockets`一样维持双方的连接，我们只需要把需要发送的数据打包，给它一个目的地信息，然后发送出去就行了。

因此当`TCP`协议不可用，或者你很确定丢几个数据包不至于惹什么大乱子的情况下，不妨使用`datagram socket`。这样的使用场景有很多，比如`tftp`（trivial file transfer protocol，简易文件传输协议，是 `FTP` 协议的小兄弟），多人游戏以及视频会议等。

事情有点不太对劲！`tftp`可是进行文件传输的协议啊，如果传输过程中丢包了，客户根本没法正常使用啊。

没错！`UDP`是不可靠的，但是我们可以在`UDP`的上层使用可靠的应用层协议，就比如`tftp`协议。`tftp `协议会死死盯着自己发送的每个数据包，要求接受方必须回复一个数据包来表示＂我收到了！＂（一个＂`ACK`＂回复数据包）。如果发送方在5秒内沒有收到`ACK`，表示它该重传这个数据包，直到收到 `ACK `为止。在不可靠的`UDP`上构建可靠的`SOCK_DGRAM`应用程序，这种`ACK`机制非常值得借鉴。

既然有了`TCP`这种可靠的传输，`UDP`有存在的必要吗？

这里有两个原因来说明`UDP`的必要性，第一个原因是速度，第二个原因还是速度。（鲁迅既视感）

相比于跟踪数据包的抵达状况并确保数据包的顺序性这种累活儿，“数据包丢了就丢了”这种处理态度可能更高效。如果你是要发送聊天信息，`TCP`是个好的选择。但是如果你想为全世界的游戏玩家每秒送出40个位置更新信息，并且丢一两个数据包也无足轻重的话，`UDP`肯定是不二之选。

