---
title: 简明socket编程
index: false
category:
- socket
# 设置写作时间
date: 2022-10-05
description: '这是一本socket编程的入门小册。学习编程，你肯定听过"socket"，或许你也想搞明白这到底是个什么东西，那就点进来看看吧。'
# 一个页面可以有多个标签
tag:
- socket编程
---

## 1. 简介
## 2. 导读
## 3. 什么是socket
你一直在听别人谈论"`sockets`"，或许你也想搞明白这到底是个什么东西。

好吧，它们其实就是：「使用标准的`Unix file descriptors`（Unix文件描述符）与其他程序进行沟通的一种方式」。

啥玩意儿？

如果接触过Unix，你一定听说过「Unix一切皆文件」的说法。

一定意义上来说，这个说法并没有什么错。因为Unix程序做任何I/O操作，都是通过对`file descriptor`（文件描述符）进行读写来实现的。

文件描述符其实就是一个整数罢了，只是这个整数关联了一个打开的文件。这里的文件可以是一个`网络连接`、`FIFO`、`pipe`（管道）、`terminal`（终端）、磁盘中的实际文件等等。

> 我之前写过一篇《[什么是文件描述符](https://www.chanmufeng.com/posts/os/%E4%BB%80%E4%B9%88%E6%98%AF%E6%96%87%E4%BB%B6%E6%8F%8F%E8%BF%B0%E7%AC%A6.html)》的文章，感兴趣的话大家可以看一下

所以「Unix一切皆文件」的说法并非是夸大其词。

不管你信不信，当你想通过网络和另一个程序进行通讯时，你必须通过`file descriptor`来实现。

那么怎么获取到和网络通信相关的这个`file descriptor`呢？

我们可以使用`socket()`函数，这个函数会返回一个`socket descriptor`（`socket`都是一个文件，`socket descriptor`自然就是一个`file descriptor`了）。然后你就可以通过这个`socket descriptor`，使用`send()`和`recv()`这两个函数与其他程序进行通信了。

如果你用C语言对文件进行过读写操作，你就知道`read()/write()`这一组函数同样可以作用于`file descriptor`，为什么不用这一套函数呢？

当然完全可以用！只不过`send()/recv()`在数据传输方面比`read/write()`提供了更多可选项罢了。

其实`sockets`的种类有很多，比如：

- DARPA Internet addresses，简称`Internet Sockets `

Internet Sockets是我们接下来讲解的重点，因为它是我们目前进行网络通信时使用最多的一种Socket.

> DARPA表示国防部高级研究计划局

- path names on a local node，简称`Unix Sockets`

这个英文翻译成中文也不是很直观，所以干脆不翻译了，`Unix Sockets`有时候被称为`Unix域套接字`。简而言之，`Unix Sockets`是用于同一台主机中进程间通讯的一种方式。

使用过MySQL的朋友很可能见过下面这个错误：

```bash
ERROR 2002 (HY000): 
Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)
```

这个错误说明MySQL Client和MySQL Server运行在同一台主机上，并且两个进程通过`/var/lib/mysql/mysql.sock`这个文件进行通信，这个文件就是Unix域套接字文件，不需要经过网络协议栈，不需要打包拆包、计算校验和、维护序列号应答等等网络通信细节。

你可能会问，MySQL Client和MySQL Server之间为什么不通过本地网络进行通信呢？

这和你对MySQL的配置有关系。

如果你指定的MySQL主机名为`localhost`，或者你指定了`--protocl=socket`的启动参数，那么Client和Server之间就会通过`Unix域套接字`进行通信了。

相反，如果你指定的MySQL主机名是`127.0.0.1`，那么Client和Server之间就会通过`Internet Sockets`进行通信了。

### 3.1. 两种Internet Socket
啥？只有两种`Internet Socket`吗？

开玩笑的啦，当然远不止两种喽。但是为了怕吓到你，这里主要介绍`Stream Sockets`以及`Datagram Sockets`。除此之外，`Raw Sockets`（原始套接字）也是一种功能更加强大的Socket，如果感兴趣，你可以查一查资料了解一下。

![image-20220930154115557](http://qiniu.chanmufeng.com/2022-09-30-074116.png)

如果要进行网络通信，我们要做的第一件事肯定是调用`socket()`函数，并指定想使用的套接字类型，比如`SOCK_STREAM`、`SOCK_DGRAM`、`SOCK_RAW`等类型，他们分别表示`Stream Sockets`、`Datagram Sockets`以及`Raw Sockets`。

我们先从`Stream Sockets`说起。

#### 3.1.1. Stream Sockets

`Stream sockets`是一种可靠的、支持双向连接的通信流。

如果你以“1，2”的顺序将这串数字发送到socket中，那么在接收端就会以同样的顺序接受到“1，2”，肯定不会出错。

哪里会用到`Stream sockets`呢？

或许你听说过`telnet`程序？`telnet`用的就是`Stream sockets`，你输入的每个字符都必须按照你的输入顺序依次抵达，要不然指令肯定就错乱了不是？

同样，浏览器使用的`HTTP`协议底层也使用了`Stream sockets`来获取网页信息。如果你通过80端口`telnet`到一个网站，并输入 "`GET / HTTP/1.0`"，然后按两下Enter，你就会收到网站发送给你的 HTML ！

`Stream sockets` 是怎么做到如此高质量地传输数据的呢？

`Stream sockets `底层使用了 "The Transmission Control Protocol"（传输控制协议），就是大名鼎鼎的 "`TCP`"（TCP 的全部细节可以参考[RFC 793](https://tools.ietf.org/html/rfc793)）。

`TCP `会确保你的数据可以按照顺序抵达而且不会出错。你之前可能是从"`TCP/IP`"这个专业名词中听说的`TCP`，其中的`IP` 是指 "Internet Protocol"（网络协议，详见 [RFC 791](https://tools.ietf.org/html/rfc791)）。`IP` 主要处理数据在各个节点之间的Internet routing（网络路由），通常不保障数据的完整性。

#### 3.1.2. Datagram Sockets

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

### 3.2. 漫谈网络
学习计算机怎么能不谈网络分层呢。下面我们就简单了解一下网络是怎样工作的，并且举一些如何`SOCK_DGRAM` 封包的例子。

实际上，如果你可以跳过这一节内容，不过，这一节能帮你很好的了解网络背景，有一定的参考意义。

![数据封装](http://qiniu.chanmufeng.com/2022-10-01-012138.png)

现在是时候了解一下`*Data Encapsulation*`（数据封装）了，它实在实在是非常重要！即便如此，在大部分的网络课程的学习中，所占的笔墨并不算多。

一般情况下，我们会这么讲：

你发送的数据构成了最初始的数据包，然后将数据包封装到应用层协议（比如`TFTP`协议）的`header`中，然后将封装之后的包再次封装到下一个协议（`UDP`）中，再接着被封装到下一个协议（`IP`协议），最终被硬件层面的通讯协议（以太网协议）封装。

接收方接收到数据后，硬件层会拆掉`以太网header`和`footer`，操作系统内核会拆开 `IP` 与` UDP header`，最后由应用层程序` TFTP` 解开` TFTP header`，最终获取到用户数据。

![image-20221001160343286](http://qiniu.chanmufeng.com/2022-10-01-080343.png)

接下来终于可以聊一聊声名狼藉的网络分层模型（Layered Network Model），也就是 "**ISO/OSI**"了。

说它声名狼藉，是因为所有入门计算机网络的人首先学习的便是这个分层模型，而对刚接触网络的小白而言很难对分层有很深的理解和感悟，只能是死记硬背，最终的结果就是应付考试而已。

20世界70年代后期，国际标准化组织（ISO）提出计算机网络应该组织为大概7层，并称之为开放系统互连（OSI）模型。事实上，OSI模型的创建者提出这个模型的时候并没有联想到如今使用的因特网，但并不妨碍OSI模型到如今依然适用，这便是抽象的能力。

OSI模型将网络分层为：

- 应用层
- 表示层
- 会话层
- 传输层
- 网络层
- 链路层
- 物理层

但是这种分层实在是过于繁琐，因此现在介绍网络分层，一般都是拿`TCP/IP`协议栈来进行说明。

- 应用层（比如`telnet`、`ftp`等）
- 传输层（`TCP`、`UDP`等）
- 网络层（`IP`、`ICMP`以及`IGMP`）
- 网络接口层（`以太网`、`wi-fi`等）

每一层分别负责不同的通信功能：

1. 应用层负责处理特定应用程序的细节。比如对用户消息的加密解密操作、按照特定格式对数据进行组装或解析等。
2. 传输层主要为两台主机上的应用程序提供端到端的通信。所谓的端到端，就是能找到真正处理数据包的两个进程。举个例子就是快递能够保证送货上门，而不只是送到小区驿站。
3. 网络层，用于主机之间的路由，就是只负责找到对应的主机。
4. 网络接口层，有时候也被称为数据链路层或链路层，通常包括操作系统中的设备驱动程序和计算机的网卡设备，它们一起处理与物理传输媒介的通信细节。


## 4. IP地址、struct以及地址转换
终于要讲点好玩儿的东西了，这一章我们要开始写一点代码了。

但是首先，我们还得再聊一些与代码无关的东西。

先稍微介绍一点IP address（IP地址）和port（端口）的知识，入个门；然后我们会讨论socket API是如何存储和操作IP address以及其他数据的。

### 4.1. IPv4与IPv6
远在「卧龙凤雏」成为贬义词之前，就有一个很棒的网络路由系统（ network routing system）了，称为**互联网通信协议第四版**（ Internet Protocol Version 4），又称为 IPv4。它的地址由4个字节组成，通常被写作**点分十进制**的形式，即四个字节被分开用十进制写出，中间用点分隔，比如：`192.0.2.111`。

你大概率见过不少IPv4的地址了。

实际上，在撰写本文之前，几乎整个互联网的各个网站都还用的是IPv4。

人们用IPv4用的很开心，一切都是如此美好。直到一个叫 Vint Cerf 的老头儿提出了警告，说是IPv4的地址即将耗尽。

> 除了警告每个人即将到来的IPv4危机，[Vint Cerf](https://en.wikipedia.org/wiki/Vint_Cerf) 本身还是鼎鼎大名的“Internet之父”，我实在是没有什么资格评判他的判断。

IPv4地址耗尽？这怎么可能呢？32-bit的IPv4有几十亿个IP地址呢，我们真的有几十亿台电脑在用吗？

是的。

一开始在电脑数量还不多的时候，大家也是认为这个数量已经足够了，几十亿已经算是一个天文数字了。甚至当时还很慷慨地分给某些大型组织几百万个IP地址给他们使用（比如Xerox、MIT、Ford、HP、IBM、GE、AT&T 及某个名为 Apple 的小公司，等等）。

事实上，要不是我们用了一些小手段（NAT转换等），IPv4早就被用尽了。

我们现在生活于每个人、每台电脑、每部计算器、每个电话、每部停车计时收费器，甚至是每个玩具小狗（没什么不可能的）都有一个IP地址的时代。

于是乎，128-bit的IPv6诞生了。

Vint Cerf 或许是不朽的，可是谁也架不住在每次地址不够用而研发下一代Internet协议的时候，他老人家出来嘟囔一句：“我早就说过了吧...。。。”

所以，我们应该怎么堵住他的嘴？

我们需要更多的地址，不只是需要两倍以上的地址、也不止几十亿倍、更不止于千兆倍，而是需要79✖️百万✖️十亿✖️兆倍以上的可用地址！我们终将见识到。

你可能会说：“真的吗？这个数字大的让我有点不可置信。”

32-bit和128-bit听起来差得并不算太多，只是多了96个bit而已。但是需要注意的是，这里说的可是等比数列，32 bits可以表示$2^{32}$ 个数字，128 bits可以表示$2^{128}$（大约340个兆兆兆）个数字，大到我都不知道怎么读。。。。。。这么说吧，这个数字相当于宇宙中的每颗星星都能拥有一百万个 IPv4 地址。

忘记点分十进制的IPv4的写法吧，现在我们有了16进制表示法，每两个字节之间用`:`分隔，类似这样：

```
2001:0db8:c9d2:aee5:73e3:934a:a5ae:9551
```

还没完呢！大多时候，IP地址里边会有很多个0，你可以将它们压缩到两个冒号之间，而且可以省略每个字节对开头的0。例如，这些地址对中的每一对都是等价的：

```
2001:0db8:c9d2:0012:0000:0000:0000:0051
2001:db8:c9d2:12::51
    
2001:0db8:ab00:0000:0000:0000:0000:0000
2001:db8:ab00::
    
0000:0000:0000:0000:0000:0000:0000:0001
::1
```

地址 `::1` 是個 loopback（本地回环）地址，相当于 IPv4 中的`127.0.0.1`。

最后，你可能会碰到 IPv6 与 IPv4 兼容的模式。你如果愿意，你可以将 IPv4地址 `192.0.2.33` 用 IPv6 形式表示：`::ffff:192.0.2.33`。

事实上，IPv6的创建者们已经肆无忌惮地保留了万亿计的地址以供备用，这真是太有趣了，但坦白地讲，我们有这么多地址，谁在意呢？

#### 4.1.1. 子网

现代的互联网是基于`TCP/IP`的思路来设计的，说得通俗点就是互联网由许许多多的小子网组成，子网中的设备用集线器进行连接，子网之间通过路由器进行互联，如下图：

![image-20221003120038276](http://qiniu.chanmufeng.com/2022-10-03-040038.png)

为了更好地管理IP地址（其实也是践行上面这个思路），IP地址本身被分成了两部分，分别是网络号和主机号。

更具体地，互联网诞生之初，IP地址曾经被分成了`A`、`B`、`C`、`D`、`E` 5类，很多计算机网络的书介绍IP地址的时候也是以这个分类开始的。

但是这个划分依然是一个历史概念，实际使用中已经没有任何意义！因此关于这部分知识的讲述都可以直接忽略。

取而代之的是在1993年，因特网工程任务组IETF又提出了**无分类编址**（CIDR）的方法来解决IPv4地址紧缺的问题，当然了，同时启动的还有彻底解决IP地址耗尽问题的IPv6项目。

在互联网中，每个设备都会被分配一个IP地址（其实被分配IP地址的是设备上的网卡，如果一台设备有多个网卡，自然就会有多个IP地址），这个地址就相当于“XX路XX号”，其中“路”就相当于网络号，“号”就相当于主机号，两者合起来就是IP地址啦！

因此，理论上我们应该能通过IP地址识别出主机处于的子网号，以及子网下的主机号。

IPv4的IP地址由`32`个bit组成，按照每`8`个比特（1字节）为一组分成4组，但是仅凭这一串数字根本无法区分哪部分是网络号，哪部分是主机号。

因此需要某些附加信息。这个附加信息就是**子网掩码**。

子网掩码的格式是一串与IP地址长度相同的`32`比特数字，左边是一串连续的`1`，右边剩下的都是`0`。其中为`1`的那一部分表示的是网络号，剩下为`0`的一部分表示的是主机号。子网掩码表示网络号与主机号之间的边界，正规的表示方式如下所示：

![image-20221003210009224](http://qiniu.chanmufeng.com/2022-10-03-130009.png)

一种最简单的表示方法是，把`1`的部分的比特数用十进制的方式写在IP地址的右侧，比如：

```
182.92.193.45/24
```

#### 4.1.2. 端口号

如果你還記得我之前跟你說過的分層網路模型（Layered Network Model），它將網路層（IP）與主機到主機間的傳輸層［TCP 與 UDP］分開。

我們要加快腳步了。

除了 IP address 之外［IP 層］，有另一個 TCP［stream socket］使用的位址，剛好 UDP［datagram socket］也用這個，就是 port number，這是一個 16-bit 的數字，就像是連線的本地端位址一樣。

將 IP address 想成飯店的地址，而 port number 就是飯店的房間號碼。這是貼切的比喻；或許以後我會用汽車工業來比喻。

你說想要有一台電腦能處理收到的電子郵件與網頁服務－你要如何在一台只有一個 IP address 的電腦上分辨這些封包呢？

好，Internet 上不同的服務都有已知的（well-known）port numbers。你可以在 Big IANA Port 清單 [12] 中找到，如果你用的是 Unix 系統，你可以參考檔案 /etc/services。HTTP（網站）是 port 80、telnet 是 port 23、SMTP 是 port 25，而 DOOM 遊戲 [13] 使用 port 666 等，諸如此類。Port 1024 以下通常是有特地用途的，而且要有作業系統管理員權限才能使用。

摁，這就是 port number 的介紹。
### 4.2. 字节序
#### 4.2.1. 什么是字节序

字节是内存读写的最小单位，一个字节能够表示的数据范围是0～255，也就是说如果你要保存一个在此范围区间的数字，一个字节足矣。

但是像占4个字节的`int`，8个字节的`double`，该怎么存储呢？多个字节该用怎样的顺序来进行排列？举个例子，`0xb3f4`，数值的高位`b3`是存储在了内存的高地址处，还是内存的低地址处呢？

这种字节的排列顺序就叫做字节序，字节序有两种：

1. 大端字节序

数值的低字节放在内存的低地址处，数值的高字节放在内存的高地址。

2. 小端字节序

数值的低字节放在内存的高地址处，数值的高字节放在内存的低地址。

#### 4.2.2. 主机字节序

当我们谈论字节序，大部分时候对应的都是CPU访问内存时的概念，比如对下图而言：

![image-20221006110645258](http://qiniu.chanmufeng.com/2022-10-06-030645.png)

内存低位存储的字节是`0xb3`，高位存储的是`0xf4`，至于CPU读取这个2字节数据的时候，是将其解释为`0xb3f4`（小端）还是`0xf4b3`（大端）就取决于CPU采用的是哪一种字节序了。

常用的CPU字节序如下：

- 大端字节序：IBM、PowerPC

- 小端字节序：x86

这种CPU字节序也被称为**主机字节序（Host Byte Order）**。翻译一下就是，IBM的主机序是大端，x86的主机序是小端。

问题来了。

世界上的主机这么多，每台主机的CPU类型还不一样，A主机按照A的主机字节序发信息给B主机，B主机如果直接按照B的主机字节序来解析信息，那么极有可能会产生错误。

要想解决这个问题，还必须引出一些其他情况下的字节序。

> 为了避免引起混淆，我在这里强调一下，字节序就分为2种，大端和小端。而所谓的主机字节序以及下面我将提到的两种，都只是字节序作用在不同的场景中取得特定名称罢了。

#### 4.2.3. 文件存储字节序

顾名思义，就是存储文件信息的时候用的是大端还是小端。

bmp格式的图片属于小端字节序，jpeg格式的图片就是大端字节序。

这里提及文件存储字节序主要是为了让大家理解一个事实：**采用什么字节序完全是开发者设计产品时的一种技术选型罢了**。但是这种选型一定要成为一种标准，让其他开发者解析的时候明白应该用哪种字节序，否则jpeg的图片也就没办法在所有的电脑上正常显示了，你说对吗？

现在好了，所有jpeg软件的开发者都知道应该用大端字节序来保存jpeg图片，但是对于从其他主机传过来的jpeg数据流，开发者又怎么知道这个数据流用的是大端还是小端呢？

这就是**网络字节序（Network Byte Order）** 的问题了。

#### 4.2.4. 网络字节序

我想你应该能想明白了，网络字节序不是大端就是小端，不可能存在「可能是大端也可能是小端」这种情况，否则网络传递的消息全都乱套了！

TCP/IP既然是一种标准，那标准自然就有自己的字节序规定。

**TCP/IP网络采用的是大端，是规定好的一种数据表示格式，它与具体的CPU类型、操作系统等无关，从而可以保证数据在不同主机之间传输时能够被正确解释。**

也就是说，如果你想让你的消息能在其他设备正常解析，就必须按照大端字节序进行处理。比如，网络传输的是`0x12345678`这个整形变量，首先被发送的应该是`0x12`，接着是`0x34`，然后是`0x56`，最后是`0x78`。

#### 4.2.5. 字节序在socket中的例子

当你在网络封包或者在填充数据的时候，你需要确定你的端口号（port number）和ip地址都是符合网络字节序的。但是你并不知道你的主机字节序是大端还是小端，你自然也就搞不清你到底需不需要进行转换。

其实不必如此费神，不用在意主机序，直接调用函数强行将主机序转换为网络字节序即可。下面举一个C语言编写服务器代码绑定端口的例子。

![image-20221006133355026](http://qiniu.chanmufeng.com/2022-10-06-053355.png)

代码中被红色标记的部分就是分别将端口号`33000`由主机序转换为网络字节序，将ip地址由主机序转换为网络字节序的函数。

乍眼一看，函数名非常古怪，不好记忆，下面稍微解释一下，各位就豁然开朗了。

`Socket函数库`提供了这种字节序转换的函数，函数的作用对象有两种，分别是`short`（2字节）和`long`（4字节），这就是函数最后的「`s`」和「`l`」的含义。

还有，主机字节序的英文是`Host Byte Order`，简写为「`h`」，网络字节序的英文是`Network Byte Order`，简写为「`n`」，「`to`」表示转换，所以，如果你想将`short`数据从主机字节序转换为网络字节序，那就应该是`h-to-n-s`，表示`Host to Network Short`。是不是很简单？

所以理论上，你可以用「`h`」、「`to`」、「`n`」、「`s/l`」这几个字母灵活组合，组成你想要的api，但是也别瞎搞，stolh()［"Short to Long Host"］这种组合压根都不存在。

基本上你需要的也就是以下四种罢了：

```
htons() // host to network short
htonl() // host to network long
ntohs() // network to host short
ntohl() // network to host long
```

基本上，我们在进行socket编程时，在发送数据之前都需要把数据转换为网络字节序，并在收到数据之后再转换成主机字节序。

> 更多关于浮点数的处理，会在之后专门的章节提及。

> 如无特殊说明，本小册的数值预设都视为主机字节序。

### 4.3. socket相关的数据结构
终于讲到这里了，现在该聊一聊和编程直接相关的一些内容了，本节会介绍多种Socket库使用的数据结构。

#### 4.3.1. socket描述符

首先介绍一个最简单的：socket描述符。它的类型是：

```java
int
```

没错，就只是个普普通通的`int`而已。

第一个介绍完了。。。。。。简单吧。

但是从这儿开始就稍微有点不好理解了，大家跟上车速，慢慢来。

#### 4.3.2. struct—addrinfo

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

##### 4.3.2.1. 使用ip建立连接

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

##### 4.3.2.2. 使用域名建立连接

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

#### 4.3.3. struct—sockaddr

```c
struct sockaddr {
    unsigned short    sa_family;    // address family, AF_xxx
    char              sa_data[14];  // 14 bytes of protocol address
}; 
```

`sa_family`的可选值有很多，但是本小册中只会使用`AF_INET`（IPv4）或 `AF_INET6`（IPv6）。

`sa_data`包含了socket需要的目的地址以及端口号，但是这样实在是很不方便，因为你需要手动把ip地址和端口号打包到14字节的数组中。

为了解决这个问题，大佬们又创造了两个替代品，`sockaddr_in`和`sockaddr_in6`。

#### 4.3.4. struct—sockaddr_in

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

#### 4.3.5. struct—sockaddr_in6

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

#### 4.3.6. struct—sockaddr_storage

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


### 4.4. IP的二进制转换
不得不说，我们真的很幸运，如今已经有了很多函数可以让我们操作IP地址，而不需要我们自己用`long`类型数据以及`<<`运算符来处理它们。

假如你声明了一个数据结构`struct sockaddr_in ina`，你还有一个“`10.12.110.57`”或“`2001:db8:63b3:1::3490`”这样的IP地址，该怎么把IP地址存入`ina`呢。

#### 4.4.1. IP转二进制

你可以使用`inet_pton()`将点分十进制形式的IPv4地址保存在`ina`中，但如果要保存IPv6地址的话，我们就需要`struct sockaddr_in6 ina6`了。

> “`pton`”的全称是“presentation to network”，也可以是“printable to network”，选一个能帮助你记忆的就行。

具体的转换如下代码所示：

```c
struct sockaddr_in sa; // IPv4
struct sockaddr_in6 sa6; // IPv6
    
inet_pton(AF_INET, "10.12.110.57", &(sa.sin_addr)); // IPv4
inet_pton(AF_INET6, "2001:db8:63b3:1::3490", &(sa6.sin6_addr)); // IPv6
```

> 小记：原本的老方法是使用名为` inet_addr() `或是 `inet_aton() `的函数；这些函数已经过时了，而且不适用于 IPv6

上面的程序写的比较简单，而且不够健壮，因为没有进行错误检查。`inet_pton() `在发生错误时会返回`-1`，而若地址无效则返回`0`。所以在使用之前要检查返回值，并保证返回结果是大于 0 的。

现在我们可以将字符串格式的IP地址转换为二进制形式了。那么反过来需要怎么做？

#### 4.4.2. 二进制转IP

如果我们已经有了`struct in_addr`，怎么将点分十进制的IP打印出来？（或者我们有`struct in6_addr`，怎么打印字符串类型的IPv6地址呢？）

我们可以使用`inet_ntop()`函数，看代码：

> “`ntop`”的全称是“network to presentation”，也可以是“network to printable”，选一个能帮助你记忆的就行。

```c
// IPv4:
char ip4[INET_ADDRSTRLEN];  // space to hold the IPv4 string
struct sockaddr_in sa;      // 假设sa中保存了ip信息
inet_ntop(AF_INET, &(sa.sin_addr), ip4, INET_ADDRSTRLEN);
printf("The IPv4 address is: %s\n", ip4);


// IPv6:
char ip6[INET6_ADDRSTRLEN]; // space to hold the IPv6 string
struct sockaddr_in6 sa6;    // 假设sa6种保存了ip信息
inet_ntop(AF_INET6, &(sa6.sin6_addr), ip6, INET6_ADDRSTRLEN);
printf("The address is: %s\n", ip6);
```

当我们调用`inet_ntop()`，你需要传递IP地址类型（IPv4 或者 IPv6），一个指向保存字符串结果的指针以及该字符串的最大长度。有两个宏（可以理解为常量）可以很方便地帮助我们表示要存储的IPv4或者IPv6地址字符串的最大长度，分别是`INET_ADDRSTRLEN` 和 `INET6_ADDRSTRLEN`。

> 小记：原本的老方法是使用名为`inet_ntoa()`的函数，这个函数已经过时了，而且不适用于 IPv6

最后，本文讲到的函数只能用于数值型的IP地址上，它们不会用DNS做域名解析，所以你传入“www.chanmufeng.com”这样的域名是没有用的。

关于域名查询，我们将会使用`getaddrinfo()`函数，之前的文章提过一嘴，后文将会详细讲述，敬请期待。

## 5. 从IPv4迁移到IPv6
未来一定属于IPv6，但可能还不是现在。

虽然嘴上嚷嚷着IPv4不够用了，但是不管国内还是国外，IPv6始终没有预想中的那么普及。

![image-20221008181452021](http://qiniu.chanmufeng.com/2022-10-08-101452.png)

图中颜色越深的地区，表示其 IPv6 部署程度越高，相应的 IPv6 部署率数值越大。所谓的部署率是根据各个国家地区的网络（IPv6 Prefix/Transit IPv6 AS），IPv6 网站及 IPv6 用户等数据按照一定权值并计算得出的。

看起来全球大部分地区都是绿的，但是就全球的IPv6覆盖率而言，还达不到40%。

但是总归需要对未来做出一点准备嘛，所以本文用12个步骤教你如何在socket编程中从IPv4迁移到IPv6。

1. 首先，尝试使用[`getaddrinfo()`](https://www.chanmufeng.com/posts/network-programming/6%E7%A7%8Dsocket%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.html#struct%E2%80%94addrinfo)来获取`struct sockaddr`的信息，不要再手动填充这个数据结构了。这样就可以屏蔽IP的版本影响，省去后续很多麻烦；

2. 找出所有对IP版本硬编码的代码，试着把它们封装起来；

3. 将`AF_INET` 修改为 `AF_INET6`；

4. 将 `PF_INET` 修改为 `PF_INET6`；

5. 将 `INADDR_ANY` 修改为 `in6addr_any` ，给你个例子：

   ```c
   struct sockaddr_in sa;
   struct sockaddr_in6 sa6;
   
   sa.sin_addr.s_addr = INADDR_ANY;  // 使用IPv4
   sa6.sin6_addr = in6addr_any; // 使用IPv6
   ```

6. 使用 `struct sockaddr_in6`代替 `struct sockaddr_in` ，千万要注意，“6”可不要乱加哦，如果你忘记那些字段有“6”了，参考之前讲过的[`struct`](https://www.chanmufeng.com/posts/network-programming/6%E7%A7%8Dsocket%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.html)。比如，压根儿不存在`sin6_zero`这个字段；
7. 使用`struct in6_addr` 代替`struct in_addr` ，关于“6”的细节，参考第6条；
8. 使用`inet_pton()`代替`inet_aton()` 以及 `inet_addr()`；
9. 使用`inet_ntop()`，不要使用`inet_ntoa()`；
10. 使用更高级的`getaddrinfo()`代替`gethostbyname()`了；
11. 用更高级的`getnameinfo()`代替`gethostbyaddr()`（虽然`gethostbyaddr`在IPv6中也能正常使用）；
12. 不要用 `INADDR_BROADCAST `了，请使用 `IPv6 multicast` 來代替。

以上！

## 6. socket编程相关函数
这一章，我们将走进**系统调用**（System Call），这些系统调用允许我们访问Linux设备或其他任何支持Socket API设备（比如BSD、Windows、Linux、Mac等）的网络功能。当你调用某个系统调用时，内核将接管一切，自动为你处理接下来的一切任务。

多数人觉得网络编程很难是因为不知道什么时候该调用什么函数，这个问题在**man**手册里是找不到解决方案的。为了带大家走出困境，接下来我就按照一般的调用顺序来给大家讲解每一个系统调用，你在写程序的时候就按照这个顺序调用就行了。

要想看懂接下来散落各处的代码片段，你需要备点牛奶和饼干了，还多少需要备点决心和勇气，然后你就能将socket编程玩儿得风生水起了，不知道的还以为你得了Jon Postel真传呢！

> Jon Postel是互联网的巨擘，他的发明作品包括但不限于`SMTP协议`、`FTP协议`、`UDP协议`。

需要说明的是，为了简洁，很多代码片段并没有包含必要的错误检查。比如文章会始终假设`getaddrinfo()` 会调用成功。在编写生产环境代码时尤其需要注意这一点。

### 6.1. getaddrinfo()—准备开始！
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

### 6.2. socket()—拿到套接字描述符！
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
### 6.3. bind()—我在监听哪个端口?
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

### 6.4. connect()—嘿，你好啊！
客户端就是用`connect()`函数来建立与服务器之间的连接的。

```c
#include <sys/types.h>
#include <sys/socket.h>

int connect(int sockfd, struct sockaddr *serv_addr, int addrlen);
```

`sockfd`是我们的老朋友了，是由`socket()`函数返回的套接字描述符，`serv_addr`是一个执行套接字地址结构 `struct sockaddr` 的指针， `struct sockaddr` 中存储了目标IP地址和端口号信息，`addrlen`是`serv_addr`指向的`struct sockaddr` 大小。

再次强调一下 `getaddrinfo()` 的妙处，所有你需要的连接信息都可以从这个函数的返回结果中获取。

客户端在调用`connect()`之前不必非得调用`bind()`函数，因为如果有必要，内核会确定源IP地址，并选择一个临时端口号作为源端口。

举一个使用`connect()`连接到"www.chanmufeng.com" 的`3490`端口的例子：

```c
struct addrinfo hints, *res;
int sockfd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;
hints.ai_socktype = SOCK_STREAM;

getaddrinfo("www.example.com", "3490", &hints, &res);

// make a socket:

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

// connect!

connect(sockfd, res->ai_addr, res->ai_addrlen);
```

和上一节讲的`bind()`一样，有些老代码在调用`connect()`之前会手动封装 `struct sockaddr_in`，然后传给`connect()`作为参数。你现在仍然可以这么做，但是没必要！

如果你使用的是TCP套接字，调用`connect`函数会触发TCP的三次握手过程，而且仅在连接成功或者失败时才会返回，失败返回`-1`，并且会设置全局变量`errno`的值。


### 6.5. listen()—会有人联系我吗?
之前讲的函数服务端和客户端都可以使用，让我们换换口味，这次讲一个仅用于服务端的函数，不仅如此，它还只能用于TCP服务端。

身为服务端，肯定是需要等待随时可能到来的客户端连接，并采用某种方式处理连接。整个过程可以分为两步：先调用`listen()`，然后调用`accept()`（这是下一小节的内容）。

`listen`的调用非常简单，如下：

```c
#include <sys/sock.h>

int listen(int sockfd, int backlog); 
```

虽然只有两个参数，但是其中有一些细节值得玩味。

`sockfd`就是通过`socket()`返回的一个**普通**`socket file descriptor`而已，系统默认这个socket只是一个等待进行主动连接的客户端socket。而`listen`函数会把这个客户端socket转换为服务端socket，告诉内核需要接受指向该socket的连接请求，并且该socket的TCP状态从`CLOSED`转换为`LISTEN`。

`backlog`参数表示内核应该为该套接字排队的最大连接个数。这是啥意思？所有客户端与该socket建立的连接都会在一个队列中排队等待，直到你`accept()`（见下节）它们，这个参数就表示最多有多少个连接有资格排队。大多数系统将这个值预设为20，你可以初始化为5或者10。

还有老生常谈的，`listen() `在错误的时候会返回` -1`，并设置 `errno`。

联系之前讲过的3个系统调用，创建服务端代码需要调用的函数依次为：

```c
getaddrinfo();
socket();
bind();
listen();
/* accept() 将被写在这里 */ 
```

我只是列出了函数的调用顺序而已，这几个步骤都比较简单，稍微需要点处理技巧的是下一节的`accept()`。

### 6.6. accept()—感谢呼叫3490端口
系好安全带，`accept()`之旅开始了。

一个远程用户试图调用`connect()`来连接到你使用`listen()`进行监听的端口上，这个连接会被放到队列中等着被你`accept()`。这句话要是你看不懂你需要回去看看前文哦。

然后你调用`accept()`，从队列中取出一个等候已久的连接，`accept()`会返回给你一个专属于这个连接的一个**全新的**`socket file descriptor`！

没错，你现在有**2个**`socket file descriptor`了！原来的`socket file descriptor`仍在处于被`listen()`的状态等待客户端的连接，而你刚刚得到的`socket file descriptor`则是准备给`send()`和`recv()`使用的，通过这俩函数，就可以实现和客户端之间的通信了。

`accept()`使用如下：

```c
#include <sys/types.h>
#include <sys/socket.h>

int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
```

`sockfd`就是正在被`listen()`的那个`socket descriptor`，这个没啥难度。

`addr`就是一个指向 `struct sockaddr_storage`的指针，这里边会自动保存客户端的一些信息，你能从中得知客户端是从哪个IP、哪个端口对你发起的连接。

`addrlen`是一个整数变量，你应该在将它的地址传给`accept()`之前，把它设置为 `sizeof(struct sockaddr_storage)` 。`accept()`保存在`addr`指向的对象中的数据大小只会小于等于`addrlen`，如果小于的话，`accept()`会通过改变`addrlen`的值来告诉你，所以你应该知道为什么这个字段是个指针变量了吧。

猜猜我要说啥，一句我快说吐了的话。`accept() `在错误的时候会返回` -1`，并设置 `errno`。

和之前一样，show you the code可能会更好吸收，看一段代码：

```c
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#define MYPORT "3490"  // the port users will be connecting to
#define BACKLOG 10     // how many pending connections queue will hold

int main(void)
{
    struct sockaddr_storage their_addr;
    socklen_t addr_size;
    struct addrinfo hints, *res;
    int sockfd, new_fd;

    // !! don't forget your error checking for these calls !!

    // first, load up address structs with getaddrinfo():

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

    getaddrinfo(NULL, MYPORT, &hints, &res);

    // make a socket, bind it, and listen on it:

    sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    bind(sockfd, res->ai_addr, res->ai_addrlen);
    listen(sockfd, BACKLOG);

    // now accept an incoming connection:

    addr_size = sizeof their_addr;
    new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &addr_size);

    // ready to communicate on socket descriptor new_fd!
    .
    .
    .
```

接下来我们就会用得到的`new_fd`这个`socket descriptor`进行`send()`和`recv()`。

如果你只是想获取这一个连接，你可以使用`close()`来关闭处于`LISTEN`状态的`sockfd`，这样就可以避免有更多的客户端连接到`3490`这个端口上了。

### 6.7. send() and recv()—跟我唠唠吧，宝儿!
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

### 6.8. sendto() and recvfrom()—用DGRAM风格跟我说话

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

### 6.9. close() and shutdown()—滚犊子！
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

### 6.10. getpeername()—你哪位?
这个函数有点简单。

简单到我都不想单独把它列出来，但是我还是列出来了。

`getpeername()`会告诉你另一端连接的`stream socket`是谁。语法如下：

```c
#include <sys/socket.h>
    
int getpeername(int sockfd, struct sockaddr *addr, int *addrlen); 
```

`sockfd`是一个已连接的`stream socket`；`addr`是一个指向`struct sockaddr` (或者 `struct sockaddr_in`) 结构的指针，结构中存储了连接的另一头儿的信息；`addrlen`是一个`int`型指针，这个int变量应该被初始化为 `sizeof *addr` 或者 `sizeof(struct sockaddr)`。

函数异常时会返回`-1`，并且设置全局变量`errno`。

一旦你获取了对面的地址，你就可以使用 `inet_ntop()`, `getnameinfo()`, 或者 `gethostbyaddr()` 打印出来或者获取更多信息（但是别妄想能获取到别人的登录名哦～）。

### 6.11. gethostname()—我是谁?
这货比 `getpeername()` 还简单。

`gethostname()`会返回程序所有的主机名称，这个主机名称可以继续用在 `gethostbyname()`中来确定主机的IP地址。

还能玩得更花一点儿吗？

当然有，不过这就和socket编程关系不大了，还是简单介绍一下使用方法吧：

```c
#include <unistd.h>

int gethostname(char *hostname, size_t size); 
```

参数很简单：`hostname`是一个字符指针，将存储返回的主机名称（hostname）；`size`是返回的主机名称的字节长度。

函数在执行成功是返回`0`，错误时返回`-1`，并一样会设置`errno`。

## 7. Client-Server基础
宝儿，你得承认，这是个`Client-Server`的世界。

网络上几乎所有的内容本质上都是Client进程与`erver进程之间的会话，反之亦然。

拿telnet举个例子。当你使用`telnet`（Client端）连接上远程主机的`23`端口，远程主机上监听该端口的程序（叫`telnetd`，就是`telnet`的Server端）就动了起来。它会处理到来的`telnet`连接，并为你设置好登陆提示信息等。

![Client-Server交互](http://qiniu.chanmufeng.com/2022-10-15-130214.png)

上图很形象地表达了Client和Server之间的信息交互。

需要注意的是，`Client-Server`这一组搭档可以使用 `SOCK_STREAM`、 `SOCK_DGRAM`或其他任何协议（只要双方使用的协议一致即可）。

`telnet`/`telnetd`, `ftp`/`ftpd`, 以及 `Firefox`/`Apache`等都是`Client-Server`模式非常好的范例。比如，每次你使用`ftp`的时候，在远程都会一个`ftpd`程序为你服务。

通常情况下，一台主机只会有一个Server程序（这里指的是处理同一功能的服务端），该程序会使用`fork()`来处理多个Client。基本的流程是这样的：Server会等待客户端连接，然后`accept()`该连接，再`fork()`出一个子进程来处理该连接。

这就是我们下一节的Server端程序做的事情。
### 7.1. 一个简单的stream server
这个Server端程序做的工作就是把 “`Hello, world!`”字符串通过`stream connection` 发送给Client。

你如果要测试这个Server程序，你需要在一起命令行窗口中运行这个Server程序，然后在另一个命令行窗口中运行以下命令：

```bash
$ telnet remotehostname 3490
```

`remotehostname`指的是运行程序的主机名，也可以是一个IP地址。

Server端程序来喽：

```c
/*
** server.c -- a stream socket server demo
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <signal.h>

#define PORT "3490"  // the port users will be connecting to

#define BACKLOG 10   // how many pending connections queue will hold

void sigchld_handler(int s)
{
    // waitpid() might overwrite errno, so we save and restore it:
    int saved_errno = errno;

    while(waitpid(-1, NULL, WNOHANG) > 0);

    errno = saved_errno;
}


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
    int sockfd, new_fd;  // listen on sock_fd, new connection on new_fd
    struct addrinfo hints, *servinfo, *p;
    struct sockaddr_storage their_addr; // connector's address information
    socklen_t sin_size;
    struct sigaction sa;
    int yes=1;
    char s[INET6_ADDRSTRLEN];
    int rv;

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_PASSIVE; // use my IP

    if ((rv = getaddrinfo(NULL, PORT, &hints, &servinfo)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
        return 1;
    }

    // loop through all the results and bind to the first we can
    for(p = servinfo; p != NULL; p = p->ai_next) {
        if ((sockfd = socket(p->ai_family, p->ai_socktype,
                p->ai_protocol)) == -1) {
            perror("server: socket");
            continue;
        }

        if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &yes,
                sizeof(int)) == -1) {
            perror("setsockopt");
            exit(1);
        }

        if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
            close(sockfd);
            perror("server: bind");
            continue;
        }

        break;
    }

    freeaddrinfo(servinfo); // all done with this structure

    if (p == NULL)  {
        fprintf(stderr, "server: failed to bind\n");
        exit(1);
    }

    if (listen(sockfd, BACKLOG) == -1) {
        perror("listen");
        exit(1);
    }

    sa.sa_handler = sigchld_handler; // reap all dead processes
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    if (sigaction(SIGCHLD, &sa, NULL) == -1) {
        perror("sigaction");
        exit(1);
    }

    printf("server: waiting for connections...\n");

    while(1) {  // main accept() loop
        sin_size = sizeof their_addr;
        new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &sin_size);
        if (new_fd == -1) {
            perror("accept");
            continue;
        }

        inet_ntop(their_addr.ss_family,
            get_in_addr((struct sockaddr *)&their_addr),
            s, sizeof s);
        printf("server: got connection from %s\n", s);

        if (!fork()) { // this is the child process
            close(sockfd); // child doesn't need the listener
            if (send(new_fd, "Hello, world!", 13, 0) == -1)
                perror("send");
            close(new_fd);
            exit(0);
        }
        close(new_fd);  // parent doesn't need this
    }

    return 0;
}
```



为了让代码看来起更清晰（起码我是这么认为的），我把所有代码都放在了一个`main()`函数中。如果你想把它分成多个更小的函数，尽管分就好了。

另外，你可能对 `sigaction()` 这个函数有点陌生，这个函数是用来处理僵尸进程（zombie processes）的。

你可以使用下节讲到的Client端代码来获取这个程序发送的消息。
### 7.2. 一个简单的stream client
Client代码比Server代码还要简单。

这段代码的功能就是连接你在命令行中指定的主机上的`3490`端口，获取Server端发送的数据。

上代码：

```c
/*
** client.c -- a stream socket client demo
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <netdb.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <sys/socket.h>

#include <arpa/inet.h>

#define PORT "3490" // the port client will be connecting to 

#define MAXDATASIZE 100 // max number of bytes we can get at once 

// get sockaddr, IPv4 or IPv6:
void *get_in_addr(struct sockaddr *sa)
{
    if (sa->sa_family == AF_INET) {
        return &(((struct sockaddr_in*)sa)->sin_addr);
    }

    return &(((struct sockaddr_in6*)sa)->sin6_addr);
}

int main(int argc, char *argv[])
{
    int sockfd, numbytes;  
    char buf[MAXDATASIZE];
    struct addrinfo hints, *servinfo, *p;
    int rv;
    char s[INET6_ADDRSTRLEN];

    if (argc != 2) {
        fprintf(stderr,"usage: client hostname\n");
        exit(1);
    }

    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    if ((rv = getaddrinfo(argv[1], PORT, &hints, &servinfo)) != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
        return 1;
    }

    // loop through all the results and connect to the first we can
    for(p = servinfo; p != NULL; p = p->ai_next) {
        if ((sockfd = socket(p->ai_family, p->ai_socktype,
                p->ai_protocol)) == -1) {
            perror("client: socket");
            continue;
        }

        if (connect(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
            close(sockfd);
            perror("client: connect");
            continue;
        }

        break;
    }

    if (p == NULL) {
        fprintf(stderr, "client: failed to connect\n");
        return 2;
    }

    inet_ntop(p->ai_family, get_in_addr((struct sockaddr *)p->ai_addr),
            s, sizeof s);
    printf("client: connecting to %s\n", s);

    freeaddrinfo(servinfo); // all done with this structure

    if ((numbytes = recv(sockfd, buf, MAXDATASIZE-1, 0)) == -1) {
        perror("recv");
        exit(1);
    }

    buf[numbytes] = '\0';

    printf("client: received '%s'\n",buf);

    close(sockfd);

    return 0;
}
```

运行Client程序之前，你需要先运行Server程序，否则的话你可能会收到 “Connection refused” 的错误提示。


### 7.3. Datagram Sockets
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

## 8. 技术进阶
这并不是特别高阶的知识，但是可以让你跳脱出你已经掌握的基础知识了。如果你一步一步学习到这里了，你可以认为你已经相当精通Unix网络编程的**基础知识**了，恭喜你。

现在我们将进入一个新的世界，学习一下关于socket更深奥的知识。

### 8.1. Blocking—何谓阻塞？
你可能听说过**阻塞**（Blocking）这个词，那么它到底是个什么鬼东西？简而言之，“block”是“sleep”的一种更具有科技感的叫法。

> 下文中，「blocking」、「block」和「阻塞」会混用，都是一个意思，悉知

当你运行前文的`listener`程序时，你可能发现它一直在“block”，直到数据包到达才会动起来。产生这个现象的原因是它调用了`recvfrom()`，如果没有数据，`recvfrom()`就会被“block”（你可以理解为“sleep”），直到有数据到达。

很多函数都会block。`accept()`会block，所有的`recv()`会block，它们之所以可以block，是因为它们被内核赋予了这个能力。当你使用`socket()`函数创建出一个`socket descriptor`时，内核就会将其设置为`blocking`。如果你不想要blocking socket，你需要调用`fcntl()`进行设置：

```c
#include <unistd.h>
#include <fcntl.h>
.
.
.
sockfd = socket(PF_INET, SOCK_STREAM, 0);
fcntl(sockfd, F_SETFL, O_NONBLOCK);
.
.
. 
```

将socket设置为non-blocking（非阻塞），你就可以`poll`（轮询）socket来获取数据了。如果你对一个non-blocking socket进行读取，而socket没有数据的时候，它并不会阻塞，而是会返回`-1`，并且将`errno`设置为 `EAGAIN` 或 `EWOULDBLOCK`。

啥？ `EAGAIN` **或** `EWOULDBLOCK`吗？那我到底应该检查哪一个？实际上，不同操作系统返回哪个值是不确定的，因此为了兼容性，你最好把这两个值都检查一下。

但是老实说，你要是时时刻刻进行数据轮询并不是个好主意，因为会空耗CPU时间片，做的大部分都是无用功。协下一节的`poll()`提供了一个更优雅的解决方案，用于检查是否有等待读取的数据。

### 8.2. poll()—同步的I/O多路复用
你可能在想，有没有一种办法，可以同时监听多个socket，然后只处理其中已经有数据的socket呢？这样的话我们就不用傻乎乎地不停轮询，来检查哪些socket已经有数据了。

那怎么避免poll（轮询）呢？说起来有点搞笑，你可以使用`poll()`这个系统调用来避免poll（轮询）。本质上，我们都是让内核来替我们做各种脏活累活，然后告诉我们哪些socket有数据可读了。没有数据可读的时候我们的进程可以处于休眠状态，不会占用CPU。

> 警告：随着连接数变得巨大，poll()函数会变得巨慢！这种情况下，推荐你使用[libevent](https://libevent.org/)这样的事件库。它会尝试使用你系统上可用的最快方法，获得更好的性能。

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

### 8.3. select()—老古董的同步I/O多路复用
我假设你已经读过`poll()`的用法了，因此直接进入主题。

`select()`可以同时监听多个socket，当有你感兴趣的（多个）事件中的任何一个发生，内核才会唤醒`select()`。如果你真的想知道的话，`select()`会告诉你哪些socket是可以读取的，哪些是可以写入的，哪些引发了异常。

> 警告：随着连接数越来越多，`select()`函数会变得巨慢！这种情况下，推荐你使用[libevent](https://libevent.org/)这样的事件库。它会尝试使用你系统上可用的最快方法，获得更好的性能。

看一下`select()`的语法：

```c
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>

int select(int numfds, fd_set *readfds, fd_set *writefds,
           fd_set *exceptfds, struct timeval *timeout); 
```

`select()`函数监听多种类型文件描述符的集合，尤其是`readfd`、`writefd`和`exceptfd`。如果你想要知道你是否能从标准输入（standard input）及某个socket descriptor（用 `sockfd` 表示）中进行读取，只要将标准输入的文件描述符表——`0` 与 `sockfd` 新增到 `readfds` 中。参数`numfds`应设置为最高文件描述符的值加1。在本例中，它应该设置为`sockfd+1`，因为它肯定高于标准输入——`0`。

当`select()`返回时，`readfds`将被修改，来反映你选择的哪些file descriptor可以读取。你可以使用下面的宏`FD_ISSET()`测试它们。

在进一步讨论之前，我先说一下如何操作这些file descriptor集合，每个集合都是`fd_set`类型，下面的宏在此类型上运行：

|              函数              |         描述          |
| :----------------------------: | :-------------------: |
|  FD_SET(int fd, fd_set *set);  |     将fd加入到set     |
|  FD_CLR(int fd, fd_set *set);  |     从set种移除fd     |
| FD_ISSET(int fd, fd_set *set); | 若fd在set中，返回true |
|     FD_ZERO(fd_set *set);      |        清空set        |

最后，这个奇怪的`struct timeval`是什么？

有时候，你不想永远一直等着别人给你发送数据。也许每隔一段时间你就想在终端上打印“Still Going…”，即使什么都没有发生。这个struct允许你指定超时时间段。如果超过了时间，`select()`仍然没有找到任何就绪的file descriptor，它将返回以便你可以继续进行处理。

`struct timeval` 长这样：

```c
struct timeval {
  int tv_sec;     // seconds
  int tv_usec;    // microseconds
}; 
```

只需将`tv_sec`设置为等待的秒数，将`tv_usec`设置成等待的微秒数。你没看错，这是_micro_seconds，而不是毫秒。一毫秒有1000微秒，一秒钟有1000毫秒。因此，每秒有1000000微秒。为什么是“usec”？“u”应该看起来像我们用来表示“micro”的希腊字母μ（Mu）。

此外，当函数返回时，可能会更新`timeout`以显示剩余时间。这取决于你正在运行的Unix类型。

哇！我们有一个微秒级别的计时器！好吧，别指望它。无论你将`struct timeval`设置得多么小，你可能还是要等待一小段的 standard Unix timeslice（标准 Unix 时间片段）。

另一件有意思的事情是：如果将`struct timeval`中的字段设置为0，`select()`会在轮询过 sets 中的每个 file descriptor 之后立即timeout。如果将参数`timeout`设置为`NULL`，它将永远不会timeout，而是陷入等待状态，直到至少一个file descriptor已经就绪。如果你不在乎等待时间，可以在`select()`中将其设置为`NULL`。

下面的代码段等待2.5秒，等待标准输入中出现某些内容：

```c
/*
** select.c -- a select() demo
*/

#include <stdio.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>

#define STDIN 0  // file descriptor for standard input

int main(void)
{
    struct timeval tv;
    fd_set readfds;

    tv.tv_sec = 2;
    tv.tv_usec = 500000;

    FD_ZERO(&readfds);
    FD_SET(STDIN, &readfds);

    // don't care about writefds and exceptfds:
    select(STDIN+1, &readfds, NULL, NULL, &tv);

    if (FD_ISSET(STDIN, &readfds))
        printf("A key was pressed!\n");
    else
        printf("Timed out.\n");

    return 0;
} 
```

如果你用的是行缓冲（line buffered）的终端，那么你从键盘输入数据后应该要尽快按下 Enter，否则程序就会发生 timeout。

> 行缓存：标准输出流遇到换行符\n时冲刷缓存。

你现在可能在想，这个方法用在需要等待数据的 datagram socket 上应该会很棒，你是对的：这可能确实是个不错的方法。有些Unix可以以这种方式使用`select()`，有些则不能。如果你想尝试的话，你应该参考一下你系统上的man手册上是怎么写的。

有些Unix系统会更新 `struct timeval` 的时间，用来反映 `select()` 还剩下多少时间才会 timeout；但是有些并不会这样。如果你想要程序具备可移植性，那就不要依赖这个特性。（如果你确实需要追踪剩下的时间，可以使用 `gettimeofday()`，我知道这让你有点不爽，这也是没有办法的事情。）

如果在 read set 中的 socket 关闭连接了，会怎样？

在这种情况下，`select()`返回时，socket descriptor会被设置为“ready to read”。当你对其执行`recv()`时，`recv()`将返回`0`。这样你就知道客户端已经断开连接了。

### 8.4. 数据只传了一部分怎么办？
回想一下之前我讲过的[`send()`](https://www.chanmufeng.com/posts/network-programming/send-recv.html)函数，我当时说过，`send()`可能不会一下子把你所有的数据都发送出去，比如你想放一个长度为`512`字节的字符串，`send()`的返回值却是`412`。你可能不禁会问到，剩下的`100`字节怎么办？

其实这`100`字节仍然在你小得可怜的缓冲区（buffer）中，等着你把他们发送出去呢！毕竟事事无法如你所愿，内核也会有自己的小脾气，有时就是不想把你的数据一下子发送出去，你还得自己动手把剩下的数据发送出去。

你可以这么写：

```c
#include <sys/types.h>
#include <sys/socket.h>

int sendall(int s, char *buf, int *len)
{
    int total = 0;        // how many bytes we've sent
    int bytesleft = *len; // how many we have left to send
    int n;

    while(total < *len) {
        n = send(s, buf+total, bytesleft, 0);
        if (n == -1) { break; }
        total += n;
        bytesleft -= n;
    }

    *len = total; // return number actually sent here

    return n==-1?-1:0; // return -1 on failure, 0 on success
} 
```

上例中，`s`是你想发送数据的`socket`，`buf`是保存数据的缓冲区（buffer），`len`指向一个`int`类型的变量，这个变量记录了缓冲区剩余数据的大小。

`send()`异常时会返回`-1`，并且最终实际发送的字节数量保存在了`len`变量中。`sendall()`会竭尽全力发送你所有的数据，除非发生了错误会导致立即返回，否则`len`的值一定就是你想发送的数据的长度。

为了完整性，给一个使用`sendall()`函数的例子：

```c
char buf[10] = "Beej!";
int len;

len = strlen(buf);
if (sendall(s, buf, &len) == -1) {
    perror("sendall");
    printf("We only sent %d bytes because of the error!\n", len);
} 
```

当部分数据包到达时，接收器端会发生什么？

如果数据包是可变长度的，接收方如何知道一个数据包何时结束，另一个何时开始？

现实世界的情景百出往往最让我们头疼。你必须得使用封装（忘记这个概念的话[点我](https://www.chanmufeng.com/posts/network-programming/%E6%BC%AB%E8%B0%88%E7%BD%91%E7%BB%9C.html)）来解决这个问题喽。

下文见！

### 8.5. Serialization-如何封装数据？
你可能已经发现了，在网络中传递字符串信息是比较容易的，但是如果你想传递像int或者float类型的二进制数据怎么办呢？你有几个选择：

1. 使用诸如 `sprintf()`之类的函数将数字转换为文本类型，然后把文本发送出去。接收方可以使用strtol()等函数将文本转换回数字。
2. 直接以原始数据进行传送，将指向数据的指针传给send()。
3. 将数字编码（encode）为可移植的二进制格式，接受者将其解码（decode）。

看了本文的标题你就知道了，我们将选择第3种。

> 在开始我们激情澎湃的旅程之前，我应该告诉你其实有现成的函数库可以帮助你做这件事情，如果你要从头实现一个具有可移植性并且没有bug的这种库可就太难了。

实际上，上面3种方法各有利弊，但是我更倾向于第3种。接下来我们先聊一聊两外两种方法的优缺点。

第一种，发送之前先将数字转换为文本，优点是很容易打印和读取来自网络的数据。有时候适合人类阅读的传输协议比较适合于带宽不敏感（non-bandwidth-intensive）的情况，比如[Internet Relay Chat（IRC）](https://en.wikipedia.org/wiki/Internet_Relay_Chat)。缺点就是数据转换速度慢，并且需要比原本的数字形式使用更多的空间。

第二种方法相当简单，但是极具危险！因为这种方法不具备可移植性，举个例子：

```c
double d = 3490.15926535;
    
send(s, &d, sizeof d, 0);  /* 不具备可移植性！! */
```

接收方接受需要这样：

```c
double d;

recv(s, &d, sizeof d, 0);  /* 不具备可移植性！! */
```

### 8.6. 数据封装

### 8.7. 广播数据包-大声说「Hello，World」
到目前为止，我们已经讨论了怎么从一台主机发送数据到另一台主机。但是，如果有这种可能，你肯定想同时把数据发送给多台主机。

用`UDP`（只能用`UDP`，`TCP`不行）和标准的IPv4，可以通过一种叫做广播（*broadcasting*）的机制来实现。IPv6不支持广播，你得用一种更高级的技术——多播（*multicasting*）来实现。这个技术我们这次不会讲，毕竟我们现在还停留在IPv4的32位阶段呢，就不异想天开了。

Wait！你别溜走，自己偷摸开始广播，我还没开始介绍呢。你必须设置套接字选项`SO_BROADCAST`，然后才能在网络上发送广播数据包，这就好比是在导弹发射开关上盖的一个小塑料罩，你的一根指头就可以控制所有！

但是，说真的，使用广播数据包有一个危险，因为每个收到广播包的系统都要拨开一层层像洋葱皮一样的封装，直到系统知道这个资料是要发送到哪个 port 为止，然后系统会开始处理这个数据或者将其丢弃。

无论怎样，接收广播数据包的每台机器都要做很多工作，而且因为它们都在本地网络上，所以可能会有很多机器做很多不必要的工作。

现在，有很多方法可以解决这个问题。。。

等一下，真的有很多方法吗？

那是什么表情阿？让我告诉你吧，发送广播包的方式有很多，所以重点就是：你该如何指定广播数据的目地地址？

有两种常用的方法：

1. 将数据发送到指定子网的广播地址，就是把子网（ subnet's network）的主机（ host）部分全部填` 1`。例如，我的网络是`192.168.1.0`，我的子网掩码是`255.255.255.0`，所以地址的最后一个字节是我的主机号（因为根据网络掩码，前3个字节是网络号），所以我的广播地址是`192.168.1.255`。在Unix下，`ifconfig`会告诉你这些信息的。你可以将这种类型的广播数据包发送到远程网络和本地网络，但你会面临数据包被目标路由器丢弃的风险。（如果他们不放弃它，那这些广播数据可能会淹没他们的局域网。）
2. 将数据发送到“全局（global）”广播地址。这是`255.255.255.255`，即INADDR_BROADCAST。许多机器会自动将其与您的网络号码「按位与」，以将其转换为网络广播地址，但有些机器却不会。具有讽刺意味的是，路由器不会把这种类型的广播数据包从你的本地网络转发出去。

所以如果你想要将数据送到广播地址，但是并没有设置 `SO_BROADCAST` socket 选项时会怎么样呢？好，我们用之前的  [talker 与 listener](https://www.chanmufeng.com/posts/network-programming/Datagram-Sockets.html) 来炒个冷饭，然后看看会发生什么事情。

```bash
$ talker 192.168.1.2 foo
sent 3 bytes to 192.168.1.2
$ talker 192.168.1.255 foo
sendto: Permission denied
$ talker 255.255.255.255 foo
sendto: Permission denied
```

如你所见，数据发送得并不顺利......因为我们没有设置`SO_BROADCAST`这个socket选项，设置一下，然后你就可以用`sendto()`将数据发送到任何你想发送的地方去了。

事实上，这是`UDP`应用程序可以广播和不能广播的唯一区别。因此，我们改造一下之前的`talker`程序，添加一个设置`SO_BROADCAST`套接字选项的部分。代码如下：

```c
/*
** broadcaster.c -- a datagram "client" like talker.c, except
**                  this one can broadcast
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

#define SERVERPORT 4950	// the port users will be connecting to

int main(int argc, char *argv[])
{
	int sockfd;
	struct sockaddr_in their_addr; // connector's address information
	struct hostent *he;
	int numbytes;
	int broadcast = 1;
	//char broadcast = '1'; // if that doesn't work, try this

	if (argc != 3) {
		fprintf(stderr,"usage: broadcaster hostname message\n");
		exit(1);
	}

	if ((he=gethostbyname(argv[1])) == NULL) {  // get the host info
		perror("gethostbyname");
		exit(1);
	}

	if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1) {
		perror("socket");
		exit(1);
	}

	// this call is what allows broadcast packets to be sent:
	if (setsockopt(sockfd, SOL_SOCKET, SO_BROADCAST, &broadcast,
		sizeof broadcast) == -1) {
		perror("setsockopt (SO_BROADCAST)");
		exit(1);
	}

	their_addr.sin_family = AF_INET;	 // host byte order
	their_addr.sin_port = htons(SERVERPORT); // short, network byte order
	their_addr.sin_addr = *((struct in_addr *)he->h_addr);
	memset(their_addr.sin_zero, '\0', sizeof their_addr.sin_zero);

	if ((numbytes=sendto(sockfd, argv[2], strlen(argv[2]), 0,
			 (struct sockaddr *)&their_addr, sizeof their_addr)) == -1) {
		perror("sendto");
		exit(1);
	}

	printf("sent %d bytes to %s\n", numbytes,
		inet_ntoa(their_addr.sin_addr));

	close(sockfd);

	return 0;
}

```

这个和一般的UDP Client/Server有什么不同呢？

除了Client可以发送广播包，没有不同！

所以你赶紧打开一个命令窗口，运行一下之前的UDP listener程序，另一个窗口中运行 `broadcaster` 程序，之前失败的操作现在就可以顺利执行了。

```bash
$ broadcaster 192.168.1.2 foo
sent 3 bytes to 192.168.1.2
$ broadcaster 192.168.1.255 foo
sent 3 bytes to 192.168.1.255
$ broadcaster 255.255.255.255 foo
sent 3 bytes to 255.255.255.255
```

## 9. 常见问题

**1. 我从哪获取这些头文件资料？**

如果你的系统中没有自带这些文件，或许你根本就不需要他们。你得看一下你平台的使用手册。

对了，如果你是为Windows开发程序，你只需要`\#include <winsock.h>`。

**2. bind()报“Address already in use”异常怎么办？**

你必须对正在监听的socket使用`setsockopt()`函数，并设置 `SO_REUSEADDR` 选项。看一下`bind()`章节和`select()`章节中的例子，你就明白了。

**3. 我该如何获取到系统中已经打开的socket列表？**

使用`netstat`命令。使用细节你需要参考man手册，不过你只要输入下列指令就能获取到一些不错的信息：

```bash
$ netstat
```

**4. 我该如何查看路由表（routing table）？**

执行`route`命令（多数的Linux系统是在`/sbin`下），或者`netstat -r`指令。

**5. 如果我只有一台电脑，我该怎么运行Client/Server程序？我需要连接外网吗？**

幸运的事，所有系统都有一个回环（loopback）虚拟网络“设备”，这个设备位于内核中，并假装自己是个网卡（这家伙就是`ifconfig`中列出的“`lo`”）。

![image-20221024180623943](http://qiniu.chanmufeng.com/2022-10-24-100623.png)

假设你登陆一台名为“goat”的设备，并在一个窗口中运行了Client程序，在另一个窗口中运行了Server端程序。或者你也可以在后台运行Server程序（用`server &`），在另一个窗口中运行Client程序。

`loopback设备`的用处就是，你可以使用 `client goat` 或者 `client localhost` （因为“`localhost`”已经在你的`/etc/hosts`中定义好了），这样你就可以让client在没有网络的情况下也可以与server通信。

简而言之，不需要改变任何代码，就可以让你的程序在没有网络的单机上运行！

**6. 如果远程断开了连接，我该怎么知道呢？**

你可以分辨，因为`recv()`会返回`0`。

**7. 我自己怎么实现“ping”这个小工具？啥是ICMP？我从哪儿能学到更多关于raw scoket和SOCK_RAW的知识？**

你对`raw socket`的全部疑问都可以在 [W. Richard Stevens’ UNIX Network Programming books](https://beej.us/guide/bgnet/html/#books)这本书中找到答案。在Stevens’ UNIX Network Programming源代码的`ping`子目录中，你可以找到[ping的源码](http://www.unpbook.com/src.html)。

**8. 我该如何改变或缩短调用connect()的过期时间？**

这个问题 W. Richard Stevens 已经回答了，我们就不狗尾续貂了。你可以参考UNIX Network Programming源代码中的 [`lib/connect_nonb.c` ](http://www.unpbook.com/src.html)。

其要点是，使用`socket()`创建一个socket descriptor，将其设置为`non-blocking`，调用`connect()`，如果一切顺利，`connect()`将立即返回`-1`，`errno`将设置为`EINPROGRESS`。然后，你可以调用`select()`，并在`read`和`write`集合中传递socket descriptor。如果没有超时，则表示`connect()`调用已完成。此时，你必须使用`getsockopt()`设置`SO_ERROR`选项，以获取`connect()`调用的返回值，如果没有错误，该值应该为`0`。

最后，在你开始通过socket传输数据之前，你可能姜再将其设置为`blocking`。

这样做有一个好处，就是让你的程序在`connecting`(连接期间)也可以做别的事情。比如：你可以将`timeout`设置为500ms，并在每次`timeout`时更新屏幕上的提示信息，然后再次调用`select()`。当你调用`select()`并超时（例如，达到20次）时，你就知道是时候放弃这个连接了。

强烈建议你看看Stevens的源码，找个好例子研究一下。

**9. 我该怎么写Windows网络程序？**

首先，卸载Windows，然后装一个Linux或者BSD。。。。哈哈哈哈，开个玩笑。

给你个链接，你看一下[section on building for Windows](https://beej.us/guide/bgnet/html/#windows) 。

**10. 我该如何在Solaris/SunOS上编译程序？我进行编译的时候总报linker error**

链接器错误发生是因为 Sun 系统不会在套接字库中自动编译。参考一下[这篇文章](https://beej.us/guide/bgnet/html/#solaris)，其中于如何处理这个问题的范例。


## 10. man手册
### 10.1. accept()

接受侦听套接字上传入的连接。

#### 10.1.1. 函数原型

```c
#include <sys/types.h>
#include <sys/socket.h>

int accept(int s, struct sockaddr *addr, socklen_t *addrlen);
```

#### 10.1.2. 说明

一旦你拿到了 SOCK_STREAM 类型的socket， 并将 socket 设定好可以用來监听（ listen()） 进入的连接，然后你就能调用 accept() 获得一个新的 socket descriptor，便于与后续新连接 client 的通信。

原本被监听的socket仍然会被保留，当有新的连接进来时，通过调用accept()获取这个新连接。主要的参数如下所示：

- s：listen()中的socket descriptor。
- addr：这里写入连接到你这里的client的地址。
- addrlen：这里会填入addr参数中传回的数据的大小。假设你得到了一个structsockaddr_in，你可以安全地忽略它，因为这是你为addr传入的类型。

accept() 通常会阻塞，而你可以使用 select() 事先取得 listen 中的 socket descriptor 状态，检查 socket 是否已经可读（ready to read）。若已经可读，则表示有新的连接正在等待被 accept()！另一个方式是将 listen 中的 socket 使用 fcntl() 设置 O_NONBLOCK 选项，然后 listen 中的 socket descriptor 就不会造成 block，而是返回 -1，并将 errno 设置为 EWOULDBLOCK。

如果accept()返回成功，其返回值是由内核生成的一个全新的描述符，代表与所返回客户端的TCP连接。accept()的第一个参数成为监听套接字，称返回值为已连接套接字。区分两个套接字很重要，一个服务器通常在其生命周期内创建一个监听套接字。由 accept() 返回的 socket descriptor 是如假包换的 socket descriptor，开启并和远程主机建立连接，如果你要断开和 client 的连接，必须使用 close()。

#### 10.1.3. 返回值

accept() 返回新连接的 socket descriptor，发生异常时返回 -1，并将 errno 设置为合适的值。

#### 10.1.4. 例子

```c
struct sockaddr_storage their_addr;
socklen_t addr_size;
struct addrinfo hints, *res;
int sockfd, new_fd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
hints.ai_socktype = SOCK_STREAM;
hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

getaddrinfo(NULL, MYPORT, &hints, &res);

// make a socket, bind it, and listen on it:

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
bind(sockfd, res->ai_addr, res->ai_addrlen);
listen(sockfd, BACKLOG);

// now accept an incoming connection:

addr_size = sizeof their_addr;
new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &addr_size);

// ready to communicate on socket descriptor new_fd!
```

#### 10.1.5. 参阅

[`socket()`](https://beej.us/guide/bgnet/html/#socketman), [`getaddrinfo()`](https://beej.us/guide/bgnet/html/#getaddrinfoman), [`listen()`](https://beej.us/guide/bgnet/html/#listenman), [`struct sockaddr_in`](https://beej.us/guide/bgnet/html/#sockaddr_inman)

### 10.2. bind()

将socket与IP地址和端口号关联。

#### 10.2.1. 函数原型

```c
#include <sys/types.h>
#include <sys/socket.h>

int bind(int sockfd, struct sockaddr *my_addr, socklen_t addrlen);
```

#### 10.2.2. 说明

当远程计算机想要连接到你的服务器程序时，它需要两条信息：**IP地址**和**端口号**。`bind()`调用就是帮你做这件事情。

端口号是内核用来确认将收到的数据包交给哪个具体进程的`socket descriptor`的依据。

> 通常在写服务端程序的时候我们才需要进行关联，客户端程序不需要我们手动绑定端口，直接`connect()`就好了。

首先，调用`getaddrinfo()`加载一个包含目标地址和端口信息的结构`sockaddr`，然后调用`socket()`得到`socket descriptor`，然后将`socket`和地址传递到`bind()`中，IP地址和端口就会神奇地被绑定到socket上！

如果你不知道你的IP地址，或者你知道你的机器上只有一个IP地址，或者你不在乎使用机器的哪一个IP地址的话，你可以简单地将提示参数中的`AI_PASSIVE`标识传递给`getaddrinfo()`。这其实是用一个特殊值填充`struct sockaddr`的IP地址部分，该值告诉`bind()`它应该自动填充该主机的IP地址。

什么什么？你想知道在`struct sockaddr`的IP地址中加载了什么特殊值，使其自动用当前主机的IP填充地址？我会告诉你，但请记住，这只有在你手动填写`struct sockaddr`的时候才会这样；否则乖乖照我上边说的，使用`getaddrinfo()`的返回结果。

在IPv4中，`struct sockaddr_in` 结构的 `sin_addr.s_addr` 字段被设置成了`INADDR_ANY`。在IPv6中，`struct sockaddr_in6`结构的`sin6_addr`字段被赋值成全局变量`in6addr_any`。或者，如果你声明了一个新的 `struct in6_addr`，你可以将其初始化为`IN6ADDR_ANY_INIT`。

最后，`addrlen`参数应该设置为 `sizeof my_addr`。

#### 10.2.3. 返回值

成功返回`0`，发生异常时返回` -1`，并将 `errno` 设置为合适的值。

#### 10.2.4. 例子

```c
// modern way of doing things with getaddrinfo()

struct addrinfo hints, *res;
int sockfd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
hints.ai_socktype = SOCK_STREAM;
hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

getaddrinfo(NULL, "3490", &hints, &res);

// make a socket:
// (you should actually walk the "res" linked list and error-check!)

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

// bind it to the port we passed in to getaddrinfo():

bind(sockfd, res->ai_addr, res->ai_addrlen);
```

```c
// example of packing a struct by hand, IPv4

struct sockaddr_in myaddr;
int s;

myaddr.sin_family = AF_INET;
myaddr.sin_port = htons(3490);

// you can specify an IP address:
inet_pton(AF_INET, "63.161.169.137", &(myaddr.sin_addr));

// or you can let it automatically select one:
myaddr.sin_addr.s_addr = INADDR_ANY;

s = socket(PF_INET, SOCK_STREAM, 0);
bind(s, (struct sockaddr*)&myaddr, sizeof myaddr);
```

#### 10.2.5. 参阅

[`getaddrinfo()`](https://beej.us/guide/bgnet/html/#getaddrinfoman), [`socket()`](https://beej.us/guide/bgnet/html/#socketman), [`struct sockaddr_in`](https://beej.us/guide/bgnet/html/#sockaddr_inman), [`struct in_addr`](https://beej.us/guide/bgnet/html/#sockaddr_inman)

### 10.3. connect()

将你本地的socket连接到服务器。

#### 10.3.1. 函数原型

```c
#include <sys/types.h>
#include <sys/socket.h>

int connect(int sockfd, const struct sockaddr *serv_addr,
            socklen_t addrlen);
```

#### 10.3.2. 说明

当你调用`socket()`得到一个socket descriptor之后，你可以使用`connect()`这个系统调用连接这个socket到远程服务器。你需要做的就是把socket descriptor和服务端地址传递给`connect()`。对了，还有地址的长度，也得通过参数的形式传递。

一般情况下，你可以通过调用`getaddrinfo()`来获取这些信息，但是如果你非要手动装填`struct sockaddr`也不是不行。

如果你没有对socket descriptor调用`bind() `方法，它会和你的IP地址以及随机端口号进行绑定。

如果你不是Server端程序，这种自动机制是挺好的，因为你根本就不在乎你用的是啥端口号，你只需要在乎远程端口号是什么，并把它放在`serv_addr`参数中就行了。如果你实在想绑定到某个特定IP地址和特定端口号上，你也可以用`bind()`函数进行设置，但属实没有必要。

一旦`connect()`完成，你就可以随心所以地使用 `send()` 和 `recv()`处理数据了。

记住：如果你`connect()`的是远程的 `SOCK_DGRAM` UDP socket，只要你想，   `send()` 、 `recv()`和 `sendto()` 、 `recvfrom()`你都可以用。

#### 10.3.3. 返回值

成功返回`0`，发生异常时返回` -1`，并将 `errno` 设置为合适的值。

#### 10.3.4. 例子

```c
// connect to www.example.com port 80 (http)

struct addrinfo hints, *res;
int sockfd;

// first, load up address structs with getaddrinfo():

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC;  // use IPv4 or IPv6, whichever
hints.ai_socktype = SOCK_STREAM;

// we could put "80" instead on "http" on the next line:
getaddrinfo("www.example.com", "http", &hints, &res);

// make a socket:

sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);

// connect it to the address and port we passed in to getaddrinfo():

connect(sockfd, res->ai_addr, res->ai_addrlen);
```

#### 10.3.5. 参阅

[`socket()`](https://beej.us/guide/bgnet/html/#socketman), [`bind()`](https://beej.us/guide/bgnet/html/#bindman)

### 10.4. close()

关闭socket descriptor。

#### 10.4.1. 函数原型

```c
#include <unistd.h>
    
int close(int s);
```

#### 10.4.2. 说明

当你完成了对包含你无数奇思妙想的socket的使用，并且你不想再`send()`或`recv()`，又或者任何其他事情，你可以使用`close()`，socket将被永久释放。

远程主机可以通过以下两种方式判断你是否进行了`close()`。

1. 如果远程主机调用了`recv()`，返回值会是0；
2. 如果远程主机调用了`send()`，它将会收到一个 `SIGPIPE` 信号，并且`send()`的返回值为`-1`，`errno`值也会被设置为 `EPIPE`。

> **Windows使用者须知：**
>
> 关闭的方法为`closesocket()`，而不是`close()`。如果你试图在socket descriptor上使用`close()`，Windows可能会跟你闹别扭。。。你会很苦恼。

#### 10.4.3. 返回值

成功返回`0`，发生异常时返回` -1`，并将 `errno` 设置为合适的值。

#### 10.4.4. 例子

```c
s = socket(PF_INET, SOCK_DGRAM, 0);
.
.
.
// a whole lotta stuff...*BRRRONNNN!*
.
.
.
close(s);  // not much to it, really.
```

#### 10.4.5. 参阅

[`socket()`](https://beej.us/guide/bgnet/html/#socketman), [`shutdown()`](https://beej.us/guide/bgnet/html/#shutdownman)

### 10.5. getaddrinfo(), freeaddrinfo(), gai_strerror()

获取有关host name（主机名）以及service（服务）信息，并将结果保存在`struct sockaddr`结构中。

#### 10.5.1. 函数原型

```c
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

int getaddrinfo(const char *nodename, const char *servname,
                const struct addrinfo *hints, struct addrinfo **res);

void freeaddrinfo(struct addrinfo *ai);

const char *gai_strerror(int ecode);

struct addrinfo {
  int     ai_flags;          // AI_PASSIVE, AI_CANONNAME, ...
  int     ai_family;         // AF_xxx
  int     ai_socktype;       // SOCK_xxx
  int     ai_protocol;       // 0 (auto) or IPPROTO_TCP, IPPROTO_UDP 

  socklen_t  ai_addrlen;     // length of ai_addr
  char   *ai_canonname;      // canonical name for nodename
  struct sockaddr  *ai_addr; // binary address
  struct addrinfo  *ai_next; // next structure in linked list
};
```

#### 10.5.2. 说明

`getaddrinfo()`是一个非常有用的函数，它会返回特定主机名的相关信息（例如其IP地址），并把信息保存在一个`struct sockaddr`结构中，自动为你处理细节（比如地址是IPv4还是IPv6）。

有了这个函数，原本的 `gethostbyname()` 和 `getservbyname()`也就可就可以退出江湖了。

接下来的描述可能会让你望而生畏，但是别担心，这个函数用起来贼简单。你可以先跳过下面的描述直接看一下例子，增强一下你的信心。

`nodename`参数中保存的就是host name（主机名）。主机名可以是域名，比如“www.chanmufeng.com”，也可以是IPv4或者IPv6地址（以字符串形式传递）。如果你用了`AI_PASSIVE`选项，这个参数你也可以设置为`NULL`（见下文）。

`servname`通常就是端口号，比如你可以以字符串格式传递“`80`”；也可以是服务名，比如“`http`”、“`tftp`”、或者“`smtp`”、“`pop`”等。众所周知的服务名可以在 [IANA Port List](https://www.iana.org/assignments/port-numbers)[48](https://beej.us/guide/bgnet/html/#fn48) 中找到，你本地的`/etc/services`文件中也有这些信息。

然后就是核心参数——`hints`。在使用`addrinfo`之前，你必须先用`memset()`将整个结构数据清空。接下来我们讲讲`addrinfo`中的字段。

`ai_flags`有很多个候选项，但是重要也就几个。（如果要同时使用多个后选项，可以使用`｜`运算符对他们进行按位或运算）。查看man手册获取完整的标识列表。

`AI_CANONNAME` 会令`res`的 `ai_canonname` 填充为主机的canonical(real) name（规范名，或者成为真名）。

`AI_PASSIVE` 会令`res`的IP地址被设置为 `INADDR_ANY` (IPv4) 或 `in6addr_any` (IPv6)；这让之后在调用`bind()`时，可以自动使用当前主机的IP地址来填充`struct sockaddr`的IP地址。这在你写Server代码且不想写死IP地址时非常好用。

如果你使用了 `AI_PASSIVE`标识，你就可以将`nodename`字段设置为`NULL`了（因为`bind()`在之后会自动给你填上）。

接着聊参数。

你应该会想将 `ai_family` 设置为`AF_UNSPEC`，这样 `getaddrinfo() `就能同时应付IPv4和IPv6了。当然喽，你也可以用 AF_INET 或 AF_INET6 来自己指定使用IPv4还是IPv6.

另外，socktype应该被设置为 `SOCK_STREAM` 或 `SOCK_DGRAM`，具体取决于你想使用那种socket。

最后，你可以将 `ai_protocol` 设置为`0`，让其自动选择你的protocol type。

做了这么多，终于可以调用`getaddrinfo()`了。

事情变得有趣了。`res`会指向`struct addrinfo`的一个链接列表，您可以通过这个链表来获得全部的地址信息（符合你通过`hints`指定的address类型）。

但是你可能会获取到一些因为某些原因而无效的address，因此Linux的man手册提供的方法是循环读取链表，然后进行调用`socket()`、`connect()`（如果Server端程序使用了`AI_PASSIVE`，那就是`bind()`），直到成功为止。

最后，当你处理完链表之后，你需要调用`freeaddrinfo()`来释放内存，避免内存出现泄漏。

#### 10.5.3. 返回值

成功返回`0`，异常返回`非0`。如果返回的是`非0`，你可以调用`gai_strerror() `获取一个文字版本的错误信息。

#### 10.5.4. 例子

```c
// code for a client connecting to a server
// namely a stream socket to www.example.com on port 80 (http)
// either IPv4 or IPv6

int sockfd;  
struct addrinfo hints, *servinfo, *p;
int rv;

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC; // use AF_INET6 to force IPv6
hints.ai_socktype = SOCK_STREAM;

if ((rv = getaddrinfo("www.example.com", "http", &hints, &servinfo)) != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
    exit(1);
}

// loop through all the results and connect to the first we can
for(p = servinfo; p != NULL; p = p->ai_next) {
    if ((sockfd = socket(p->ai_family, p->ai_socktype,
            p->ai_protocol)) == -1) {
        perror("socket");
        continue;
    }

    if (connect(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
        perror("connect");
        close(sockfd);
        continue;
    }

    break; // if we get here, we must have connected successfully
}

if (p == NULL) {
    // looped off the end of the list with no connection
    fprintf(stderr, "failed to connect\n");
    exit(2);
}

freeaddrinfo(servinfo); // all done with this structure
```

```c
// code for a server waiting for connections
// namely a stream socket on port 3490, on this host's IP
// either IPv4 or IPv6.

int sockfd;  
struct addrinfo hints, *servinfo, *p;
int rv;

memset(&hints, 0, sizeof hints);
hints.ai_family = AF_UNSPEC; // use AF_INET6 to force IPv6
hints.ai_socktype = SOCK_STREAM;
hints.ai_flags = AI_PASSIVE; // use my IP address

if ((rv = getaddrinfo(NULL, "3490", &hints, &servinfo)) != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
    exit(1);
}

// loop through all the results and bind to the first we can
for(p = servinfo; p != NULL; p = p->ai_next) {
    if ((sockfd = socket(p->ai_family, p->ai_socktype,
            p->ai_protocol)) == -1) {
        perror("socket");
        continue;
    }

    if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
        close(sockfd);
        perror("bind");
        continue;
    }

    break; // if we get here, we must have connected successfully
}

if (p == NULL) {
    // looped off the end of the list with no successful bind
    fprintf(stderr, "failed to bind socket\n");
    exit(2);
}

freeaddrinfo(servinfo); // all done with this structure
```

#### 10.5.5. 参阅

[`gethostbyname()`](https://beej.us/guide/bgnet/html/#gethostbynameman), [`getnameinfo()`](https://beej.us/guide/bgnet/html/#getnameinfoman)

### 10.6. gethostname()

返回系统主机名称

#### 10.6.1. 函数原型

```c
#include <sys/unistd.h>

int gethostname(char *name, size_t len);
```

#### 10.6.2. 描述

你的系统有个名字，所有系统都有。这是一个比我们一直在谈论的其他网络内容稍微更Unixy的东西，但它仍然有它的用途。

例如，你可以获取你的主机名，然后调用gethostbyname()来查找你的IP地址。

name 参数应该指向一个保存主机名称的缓冲区，而 len 是该缓冲区的大小，以 byte 为单位。gethostname() 不会覆盖缓冲区的结尾（可能会返回错误，或者只是单纯停止写入），而且如果缓冲区有足够的空间，它还会保留字串的 NUL-结尾。

#### 10.6.3. 返回值

成功返回`0`，发生异常时返回` -1`，并将 `errno` 设置为合适的值。

#### 10.6.4. 例子

```c
char hostname[128];

gethostname(hostname, sizeof hostname);
printf("My hostname: %s\n", hostname);
```

#### 10.6.5. 参阅

[`gethostbyname()`](https://beej.us/guide/bgnet/html/#gethostbynameman)

### 10.7. gethostbyname(), gethostbyaddr()

根据主机名获取IP地址，或者相反。

#### 10.7.1. 函数原型

```c
#include <sys/socket.h>
#include <netdb.h>

struct hostent *gethostbyname(const char *name); // DEPRECATED!
struct hostent *gethostbyaddr(const char *addr, int len, int type);
```

#### 10.7.2. 说明

> 请注意：这两个函数已经由 getaddrinfo() 与 getnameinfo() 取而代之！实际上，gethostbyname() 无法在 IPv6 中正常运行。

这些函数可以转换 host name 与 IP addresse。例如：你可以用 `gethostbyname()` 取得其 IP address，并储存在 `struct in_addr`。

反之，如果你有一个 `struct in_addr` 或 `struct in6_addr`，你可以用 `gethostbyaddr()`得到 hostname。`gethostbyaddr() `与 IPv6 相容，但是你最好使用新的 `getnameinfo()` 代替它。

（如果你有一个点分十进制格式的IP地址，你想要查询它的 hostname，你在使用 `getaddrinfo()` 时最好要搭配` AI_CANONNAME` 标识）。

`gethostbyname()` 接收一个类似 "www.chanmufeng.com" 的字串，然后传回一个 `struct hostent`，里面包含了超多的数据，包括了 IP address（其它的信息包括官方的 host name、一连串的别名、地址类型、地址长度、以及地址列表。这是个通用的资料结构，在特定的用途上使用起来也很方便）。

在` gethostbyaddr() `代入一个 `struct in_addr `或 `struct in6_addr`，然后就会返回给你一个相对应的 host name（如果有的话），它的作用和 `gethostbyname() `正好相反。至于参数，`addr `是一个 `char*`，你实际上想要用一个指向` struct in_addr` 的指针；`len `应该被设置成 `sizeof(struct in_addr)`，而 `type` 应为 `AF_INET`。

所以这个 `struct hostent` 会返回什么呢？它有许多字段，包含 host 的相关数据。

| 字段               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| char *h_name       | 主机的规范（official、canonical）名字                        |
| char **h_aliases   | 可以使用数组访问的别名列表，最后一个元素为NULL               |
| int h_addrtype     | 结果的地址类型，出于我们的目的，它实际上应该是AF_INET。      |
| int length         | 以字节为单位的地址长度，对于IP（版本4）地址为4。             |
| char **h_addr_list | 此主机的IP地址列表。虽然这是一个char**，但它实际上是一个伪装的structin_addr *s数组。最后一个数组元素为NULL。 |
| h_addr             | h_addr_list[0]的常用别名。如果你只是想要此主机的任何旧IP地址（是的，它们可以有多个），请使用此字段。 |

#### 10.7.3. 返回值

成功时返回指向` struct hostent `结果的指针，错误时返回 `NULL`。

和之前介绍过的其他函数不同，当发生错误时，它不设置`errno`变量，而是将全局整数变量`h_errno`设置为在头文件`<netdb.h>`中定义的常值。

#### 10.7.4. 例子

```c
// THIS IS A DEPRECATED METHOD OF GETTING HOST NAMES
// use getaddrinfo() instead!

#include <stdio.h>
#include <errno.h>
#include <netdb.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(int argc, char *argv[])
{
    int i;
    struct hostent *he;
    struct in_addr **addr_list;

    if (argc != 2) {
        fprintf(stderr,"usage: ghbn hostname\n");
        return 1;
    }

    if ((he = gethostbyname(argv[1])) == NULL) {  // get the host info
        herror("gethostbyname");
        return 2;
    }

    // print information about this host:
    printf("Official name is: %s\n", he->h_name);
    printf("    IP addresses: ");
    addr_list = (struct in_addr **)he->h_addr_list;
    for(i = 0; addr_list[i] != NULL; i++) {
        printf("%s ", inet_ntoa(*addr_list[i]));
    }
    printf("\n");

    return 0;
}
```

```c
// THIS HAS BEEN SUPERCEDED
// use getnameinfo() instead!

struct hostent *he;
struct in_addr ipv4addr;
struct in6_addr ipv6addr;

inet_pton(AF_INET, "192.0.2.34", &ipv4addr);
he = gethostbyaddr(&ipv4addr, sizeof ipv4addr, AF_INET);
printf("Host name: %s\n", he->h_name);

inet_pton(AF_INET6, "2001:db8:63b3:1::beef", &ipv6addr);
he = gethostbyaddr(&ipv6addr, sizeof ipv6addr, AF_INET6);
printf("Host name: %s\n", he->h_name);
```

#### 10.7.5. 参见

[`getaddrinfo()`](https://beej.us/guide/bgnet/html/#getaddrinfoman), [`getnameinfo()`](https://beej.us/guide/bgnet/html/#getnameinfoman), [`gethostname()`](https://beej.us/guide/bgnet/html/#gethostnameman), [`errno`](https://beej.us/guide/bgnet/html/#errnoman), [`perror()`](https://beej.us/guide/bgnet/html/#perrorman), [`strerror()`](https://beej.us/guide/bgnet/html/#perrorman), [`struct in_addr`](https://beej.us/guide/bgnet/html/#sockaddr_inman)

### 10.8. getnameinfo()

由 struct sockaddr 提供的信息查询主机名称（host name）以及服务名（service name）。

#### 10.8.1. 函数原型



### 10.9. shutdown()

停止对socket继续传送与接受。

#### 10.9.1. 函数原型

```c
#include <sys/socket.h>
    
int shutdown(int s, int how);
```

#### 10.9.2. 说明

如果我不需要再对 socket 进行`send()`了，但是我仍然想要`recv() `socket 的数据，反之亦然，那我该怎么做呢？

当你使用 `close()` 关闭 socket descriptor 时，它会将 socket 的传送与接收两端都关闭，并且释放 socket descriptor。若你只想要关闭其中一端，你就可以使用 `shutdown() `这个函数。

在这些参数中，`s `显然是你想要进行动作的 socket，而要进行什么样的动作，则要由 `how` 参数指定。可以使用 `SHUT_RD` 来关闭接收，`SHUT_WR` 以关闭传送，或者 `SHUT_RDWR` 将收送功能都关闭。

- SHUT_RD

  关闭连接的读功能，socket中不再有数据可以被接受，而且socket接收缓冲区中的先有数据都被丢弃。进程不能再对这样的socket调用任何读函数。

- SHUT_WR

  关闭连接的写功能。当前留在socket发送缓冲区中的数据将被发送掉，后面跟着TCP的正常连接终止序列。进程不能再对这样的socket调用任何写函数。

- SHUT_RDWR

  连接的读功能和写功能都被关闭，这等于调用`shutdown`两次：第一次调用指定`SHUT_RD`，第二次调用指定`SHUT_WR`。

`shutdown() `用来关闭连接，而不是socket，不管调用多少次`shutdown()`，socket依然存在，因为 `shutdown() `并没有释放 socket descriptor，所以即使 socket 已经整个 shutdown 了，最终仍然得透过 `close() `关闭 socket。

默认情况下，`close()`会立即向网络中发送`FIN`包，不管输出缓冲区中是否还有数据，而`shutdown() `会等输出缓冲区中的数据传输完毕再发送`FIN`包。也就意味着，调用` close()`将丢失输出缓冲区中的数据，而调用 `shutdown() `不会。

这个函数用的并不常用。

#### 10.9.3. 返回值

成功返回`0`，发生异常时返回` -1`，并将 `errno` 设置为合适的值。

#### 10.9.4. 例子

```c
int s = socket(PF_INET, SOCK_STREAM, 0);

// ...do some send()s and stuff in here...

// and now that we're done, don't allow any more sends()s:
shutdown(s, SHUT_WR);
```

#### 10.9.5. 参阅

[`close()`](https://beej.us/guide/bgnet/html/#closeman)

## 11. 更多资料
## 12. 后记
