---
title: JVM到底该学些什么
index: false
category:
- JVM
# 设置写作时间
date: 2022-01-04
tag:
- JVM
---

学Java的第一天我们就知道Java是一种跨平台的语言，虽然当时可能是懵懵懂懂，但是「一次编译，到处运行」的特性想必是给众多Javaer留下了不可磨灭的印象。

这意味着，使用Java开发出来的程序经过编译后，可以在`Windows`上运行，也可以在`Linux`和`Mac`上运行；可以在手机上运行，甚至是在`X86`CPU和`ARM`的CPU上运行。

不同的操作系统，特别是不同的CPU架构，底层的指令也是不同的。而Java「一次编写，到处运行」的特性正是因为Java编译的字节码文件不是直接运行在底层系统平台之上，而是在Java虚拟机JVM上运行的，JVM屏蔽了底层系统的不同，为Java字节码文件构造了一个统一的运行环境。

到底什么是JVM？

## 1. JVM的定义

我们先看一下Oracle官方给出的JVM的定义

> The Java Virtual Machine is the cornerstone of the Java platform. It is the component of the technology responsible for its hardware- and operating system-independence, the small size of its compiled code, and its ability to protect users from malicious programs.

> Java虚拟机是Java平台的基石。它独立于硬件和操作系统，编译代码小，能够保护用户免受恶意程序的攻击。

> The Java Virtual Machine is an abstract computing machine. Like a real computing machine, it has an instruction set and manipulates various memory areas at run time. It is reasonably common to implement a programming language using a virtual machine

> Java虚拟机是一种抽象计算机。像真正的计算机一样，它有一个指令集，并在运行时处理各种内存区域

## 2. JDK & JRE & JVM

![image-20220104160549940](http://qiniu.chanmufeng.com/2022-01-04-080550.png)

从Oracle官方给出的Java概念图中可以看出，JVM处于Java平台的最底层，Java平台的一切都是建立在JVM的基础之上。JVM是JRE的子集，JRE又是JDK的子集。

![image-20220104170113409](http://qiniu.chanmufeng.com/2022-01-04-090113.png)

我们平时接触最多的Java语法就是JDK的最上层结构，如果只满足于熟练使用Java的各种api，那我们只能算是合格的“调包侠”。

Java 开发过程中也可能会遇到各种问题，了解了JVM的基本构造，就可以帮助我们从原理上去解决问题。

## 3. JVM到底该学些什么

换句话说，JVM到底应该从哪里开始入手学习呢？

下图展示了我们接下来的系列文章将会介绍的内容，图中我放弃了细节，希望从宏观上能让大家对JVM的学习路线有清晰的认识。

![image-20220104164804570](http://qiniu.chanmufeng.com/2022-01-04-084804.png)

### 3.1. 源码到字节码

我们将会了解到

- 源码到字节码的过程中到底发生了什么
- .class文件内容到底有什么奥秘

### 3.2. 类文件到虚拟机（类加载机制）

![image-20220104165755727](http://qiniu.chanmufeng.com/2022-01-04-085755.png)

我们会了解到

- 类加载的过程是什么
- 类加载器的分类

### 3.3. 运行时数据区

类文件被类装载器装载进JVM之后，类中的内容(比如变量，常量，方法，对象等数据)必然有个去处，也就是要存储起来，存储的位置对应在JVM中，我们称为「运行时数据区」。

![image-20220104170126378](http://qiniu.chanmufeng.com/2022-01-04-090126.png)

其中，「方法区」和「堆」是所有线程共享的运行时数据区，随着JVM的启动而创建，伴着JVM的退出而销毁；

「程序计数器」和「本地栈」以及「虚拟机栈」是每个线程独享的运行时数据区，随着线程的创建退出而创建销毁。

### 3.4. JVM垃圾回收

Java程序员不需要手动释放内存正是得益于JVM的垃圾回收机制，我们将了解到

- 进行垃圾回收，我们如何确定哪些对象可以被清理呢？
- 确定垃圾之后，垃圾回收方法有哪些，各有什么优缺点？
- JVM的分代回收是怎么回事儿？
- JVM的垃圾回收器有哪些？各自的优缺点是什么？怎么查看JDK当前正在使用的是哪一款回收器？

### 3.5. JVM参数

JVM 有很多配置参数，比如遇到 `OutOfMemoryError`，我们就知道是堆空间不足了，可能是 JVM 分配的内存空间不足以让程序正常运行，这时候我们需要通过调整 `-Xmx` 参数增加内存空间。

如果遇到 `StackOverflowError`，可能是线程栈空间不足，通常是因为方法递归层级或普通方法调用太多，导致栈帧溢出。我们可以先通过栈异常信息观察是否存在错误的递归调或者尝试调整 `-Xss` 参数增加栈空间大小。

再比如，JVM在执行字节码指令是通过解释执行的方式进行的，通常执行效率比较差，我们可以通过`-server`参数打开JIT的C2编译器进行即时编译优化。

我将会介绍JVM的常用参数，以及`jps`，`jinfo`，`jstat`，`jstack`，`jmap`，`jconsole`，`jvisualvm`等命令和工具的使用。

### 3.6. GC日志

最后我们会借助日志文件分析工具来分析GC日志文件，包括

- Parallel GC日志
- CMS日志
- G1日志
