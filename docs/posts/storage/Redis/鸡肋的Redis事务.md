---
title: 鸡肋的Redis事务
index: false
icon: creative
category:
- Redis
# 设置写作时间
date: 2022-02-16
# 一个页面可以有多个标签
tag:
- Redis
- 事务
---

没错，Redis也有事务管理，但是功能很简单，在正式开发中也并不推荐使用。但是面试中有可能会问到，所以本文简单谈一谈Redis的事务。

通过这篇文章，你会了解

- Redis为什么要提供事务？
- Redis事务基本指令和使用方法
- CAS乐观锁是什么？
- Redis事务为什么不支持回滚？

## 1. 为什么要用事务

我们知道Redis的单个命令是原子性的，比如`get`、`set`、`mget`、`mset`等指令。

> 原子性是指操作是不可分割的，在执行完毕之前不会被任何其它任务或事件中断，也就不会有并发的安全性问题


在涉及到多个命令的时候，如果需要把多个命令设置为一个不可分割的处理序列，就需要用到事务了。

比如，招财和陀螺各有100元，招财给陀螺转了10元，这时候需要在Redis中把招财的金额总数-10，同时需要把陀螺的金额总数+10。这两个操作要么同时成功，要么同时失败，这时候就需要事务了。

> 实际上，Redis连这个简单的需求都没办法完美做到，至于为啥，接着往下看吧


## 2. 事务的用法

### 2.1 5个基本指令

Redis提供了以下5个基本指令，先混个眼熟就行，接下来在案例中进行实操，想记不住都难

- [MULTI](https://redis.io/commands/multi)
- [EXEC](https://redis.io/commands/exec)
- [DISCARD](https://redis.io/commands/discard)
- [WATCH](https://redis.io/commands/watch)
- [UNWATCH](https://redis.io/commands/unwatch)

![](http://qiniu.chanmufeng.com/2022-02-16-082318.png#alt=image-20220216162318167)

### 2.2 案例演示

案例场景：招财和陀螺各有100元，招财给陀螺转了10元，这时候需要在Redis中把招财的金额-10，同时需要把陀螺的金额+10。

#### 2.2.1 事务提交

我们首先为陀螺和招财初始化自己的金额；然后使用`MULTI`命令`显式开启`Redis事务。 该命令总是直接返回OK。此时用户可以发送多个指令，Redis不会立刻执行这些命令，而是将这些指令`依次放入`当前事务的指令队列中；`EXEC`被调用后，所有的命令才会被依次执行。

```bash
# 给陀螺初始化100元
127.0.0.1:6379> set tuoluo 100
OK
# 给招财初始化100元
127.0.0.1:6379> set zhaocai 100
OK
# 显式开启事务
127.0.0.1:6379> MULTI
OK
# 给陀螺增加10元
127.0.0.1:6379(TX)> INCRBY tuoluo 10
QUEUED
# 给招财减少10元
127.0.0.1:6379(TX)> DECRBY zhaocai 10
QUEUED
# 执行事务中的所有指令（提交事务）
127.0.0.1:6379(TX)> EXEC
1) (integer) 110
2) (integer) 90
```

#### 2.2.2 嵌套事务

Redis不支持嵌套事务，多个`MULTI`命令和单个`MULTI`命令效果相同。

```bash
# 第一次开启事务
127.0.0.1:6379> MULTI
OK
# 尝试嵌套事务
127.0.0.1:6379(TX)> MULTI
(error) ERR MULTI calls can not be nested
# 仍然处于第一个事务当中
127.0.0.1:6379(TX)>
```

#### 2.2.3 放弃事务

如果开启事务之后，中途后悔了怎么办？调用`DISCARD`可以清空事务中的指令队列，退出事务。

```bash
127.0.0.1:6379> MULTI
OK
# 在事务中调用DISCARD指令
127.0.0.1:6379(TX)> DISCARD
OK
# 会退出当前事务
127.0.0.1:6379>
```

#### 2.2.4 watch指令

假如我们在一个客户端连接中开启了事务，另一个客户端连接修改了这个事务涉及的变量值，将会怎样？

![](http://qiniu.chanmufeng.com/2022-02-16-075041.png#alt=%E5%A4%9A%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%93%8D%E4%BD%9C%E5%90%8C%E4%B8%80%E5%8F%98%E9%87%8F)

client1开启了一个转账的事务，事务开始时招财和陀螺各自拥有100元，在执行`EXEC`指令之前，client2将陀螺的余额添加了10元，此时执行`EXEC`之后，陀螺最终的金额为120元，招财为90元。

很明显，这种情况下存在数据安全问题。

为此Redis提供了`WATCH`的指令，该指令可以为Redis事务提供`CAS乐观锁`行为，即多个连接同时更新变量的时候，会和变量的初始值进行比较，只在这个变量的值没有被修改的情况下才会更新成新的值。

**2.2.4.1 WATCH用法**

对应我们的案例，我们可以使用`WATCH`监听一个或多个key，如果开启事务之前，至少有一个被监视的key在`EXEC`执行之前被修改了，那么整个事务都会被取消，直接返回`nil`（见下面的案例）。`UNWATCH`是`WATCH`的反操作。

![](http://qiniu.chanmufeng.com/2022-02-16-075119.png#alt=WATCH%E7%9A%84%E7%94%A8%E6%B3%95%E6%A1%88%E4%BE%8B)

**2.2.4.2 CAS机制**

> CAS（Compare And Swap）比较并替换，是多并发时常用的一种乐观锁技术


CAS需要三个变量信息，分别是内存位置(JAVA中的内存地址，V)，旧的预期值(A)和新值(B)。CAS执行时，当且仅当V和预期值A相等时，更新V的值为新值B，否则不执行更新。

![](http://qiniu.chanmufeng.com/2022-02-16-074935.png#alt=CAS%E5%8E%9F%E7%90%86)

## 3. 事务执行出错怎么办

事务执行时可能遇到问题，按照发生的时机不同分为两种：

- 执行`EXEC`之前
- 执行`EXEC`之后

### 3.1 执行EXEC之前发生错误

比如指令存在语法错误（参数数量不对，指令单词拼错）导致不能进入`commands`队列，这一步主要是编译错误，还未到运行时。

```bash
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> SET tuoluo
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379(TX)> EXEC
(error) EXECABORT Transaction discarded because of previous errors.
```

这种情况下事务会执行失败，队列中的所有指令都不会得到执行。

### 3.2 执行EXEC之后发生错误

这种错误往往是类型错误，比如对String使用了Hash的命令，这是运行时错误，编译期间不会出错

```bash
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> SET tuoluo 100
QUEUED
127.0.0.1:6379(TX)> LPOP tuoluo
QUEUED
127.0.0.1:6379(TX)> EXEC
1) OK
2) (error) WRONGTYPE Operation against a key holding the wrong kind of value
```

我们发现，`SET tuoluo 100`的命令居然执行成功了，也就是在发生了运行时异常的情况下，错误的指令不会被执行，但是其他的命令不会受影响。

![](http://qiniu.chanmufeng.com/2022-02-16-075202.png#alt=image_1)

这种方式显然不符合我们对`原子性`的定义，也就是Redis的事务无法实现原子性，无法保证数据一致。

针对这种缺陷，Redis官方也是做了说明的。

## 4. Redis事务为什么不支持回滚

引自Redis[官方文档](https://redis.io/topics/transactions/)。

![](http://qiniu.chanmufeng.com/2022-02-16-075214.png#alt=%E5%AE%98%E6%96%B9%E7%94%A9%E9%94%85%E8%AF%B4%E8%BE%9E)

为了方便大家理解，我翻译一下就是：

> 你们程序员的锅，关我们Redis屁事儿！


Redis官方认为，只有在命令语法错误或者类型错误的时候，Redis命令才会执行失败。而且他们认为有这种错误的语法一般也不会进入到生产环境。而且不支持回滚可以使~~他们有更多时间玩儿~~Redis运行得更简单快捷。

这种说法多牛！如果出问题就是程序员的问题，写错了还让代码进入生产环境，那就是罪上加罪，你永远赖不着Redis官方。

这可能就是不推荐使用Redis事务的原因了吧，鸡肋是一方面，万一被官方打脸了呢？所以Redis事务的知识稍微了解一下就好，面试被问到能回到上来就可以了。

---

下期见！

## 5. 推荐阅读

- [就这？Redis持久化策略——AOF](https://mp.weixin.qq.com/s?__biz=MzI1MDU0MTc2MQ==&mid=2247483972&idx=1&sn=3194ed597d62420a1c54bef082ddd3aa&chksm=e981e1eadef668fc8230913dea198d44a54eba1b97a528739e282d471841588e83ceee7116f8&token=1440471649&lang=zh_CN#rd)
- [就这？Redis持久化策略——RDB](https://mp.weixin.qq.com/s?__biz=MzI1MDU0MTc2MQ==&mid=2247483952&idx=1&sn=e9982700a75eae5c2471dcfa459ae3e3&chksm=e981e19edef66888f2da69ce26c164682b552f5ffd838ff027a85f7e1e1f156640c6d55ab6ae#rd)
- [到底应该先操作缓存还是先操作数据库？](https://mp.weixin.qq.com/s?__biz=MzI1MDU0MTc2MQ==&mid=2247484147&idx=1&sn=ea13298c7235ed181c0d832a97f2117b&chksm=e981e15ddef6684ba4f8b7279d0802673d5a91d73bfd224167a46d30ce1845c3429ee74da615#rd)
