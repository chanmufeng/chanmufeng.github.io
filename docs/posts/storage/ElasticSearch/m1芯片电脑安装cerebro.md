---
title: m1芯片电脑安装cerebro
index: false
icon: creative
category:
- MySQL
# 设置写作时间
date: 2022-07-15
# 一个页面可以有多个标签
tag:
- ES
---

`cerebro`是一款`Elasticsearch`集群的监控工具，界面美观又简洁，是学习`Elasticsearch`的好工具。

![image-20220609155947859](http://qiniu.chanmufeng.com/2022-06-09-075948.png)

官方地址：https://github.com/lmenezes/cerebro/releases

我用的是`M1`芯片的Mac笔记本，在安装`cerebro`的过程中遇到两个问题。

1. `cerebro`的最新版本（0.9.4）并未提供适配`M1`芯片的发行版；
2. `cerebro`要求JDK版本最低是11，而我本地开发用的是JDK8，我并不想因为这个软件再多折腾JDK的版本。因此我选择使用`Docker`来跑`cerebro`。

不出意外，官网的`cerebro`的`Docker`镜像无法在我的`M1`电脑上正常运行。

于是自己动手编译适合M1芯片的`Dockerfile`，并生成了镜像文件传到了自己的仓库，如果不想折腾就直接拉这个镜像运行就可以了。

```bash
docker pull chanmufeng/cerebro:0.9.4
```



想折腾的继续往下看，`Dockerfile`文件内容如下：

```dockerfile
# 使用 arm64v8 架构的 jdk11版本
FROM docker.io/arm64v8/openjdk:11 

# cerebro 版本号
ENV CEREBRO_VERSION 0.9.4

RUN  apt-get update \
    && apt-get install -y wget \
    && apt-get install -y apt-transport-https \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /opt/cerebro/logs \
    && wget -qO- https://github.com/lmenezes/cerebro/releases/download/v${CEREBRO_VERSION}/cerebro-${CEREBRO_VERSION}.tgz \
    | tar xzv --strip-components 1 -C /opt/cerebro \
    && sed -i '/<appender-ref ref="FILE"\/>/d' /opt/cerebro/conf/logback.xml \
    && addgroup -gid 1000 cerebro \
    && adduser -gid 1000 -uid 1000 cerebro \
    && chown -R cerebro:cerebro /opt/cerebro

WORKDIR /opt/cerebro
USER cerebro

ENTRYPOINT [ "/opt/cerebro/bin/cerebro" ]

```

开始构建镜像

```
docker build -t my-cerebro:0.9.4 .
```

构建过程很慢，可能某些文件还需要翻qiang才能下载成功，构建成功之后看一下你本地的镜像文件列表吧

```bash
➜  bin docker images
REPOSITORY                                      TAG       IMAGE ID       CREATED        SIZE
my-cerebro                                      0.9.4     4c103685731e   3 days ago     713MB
```

运行镜像

```
docker run -p 9000:9000 my-cerebro:0.9.4
```

---

收工！
