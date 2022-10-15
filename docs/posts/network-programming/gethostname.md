---
title: gethostname()—我是谁?
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

