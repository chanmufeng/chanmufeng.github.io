---
title: 后端开发者M1版Mac开发环境搭建
index: false
icon: creative
category:
- 开发工具
# 设置写作时间
date: 2023-01-31
description: 介绍M1芯片的MacBook Pro搭建后端开发环境，包括常用效率软件、数据库软件、以及使用Docker快速搭建数据库环境
# 一个页面可以有多个标签
tag:
- Mac

---
## 1. JDK

JDK下载地址：https://www.azul.com/downloads/?package=jdk

![image-20220218091853090](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3da2a939e4544eb3bfc69f662a887ca7~tplv-k3u1fbpfcp-zoom-1.image)

```bash
chanmufeng@chanmufengdeMacBook-Pro ~ % java -version
openjdk version "1.8.0_322"
OpenJDK Runtime Environment (Zulu 8.60.0.21-CA-macos-aarch64) (build 1.8.0_322-b06)
OpenJDK 64-Bit Server VM (Zulu 8.60.0.21-CA-macos-aarch64) (build 25.322-b06, mixed mode)
```

## 2. IDEA

先创建个项目，不出意外的话一开始会让我们首先设置JDK

![image-20220218094513067](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4536616cf16847c096144c5665457359~tplv-k3u1fbpfcp-zoom-1.image)

![image-20220218094656590](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a68638eb67b4c6596aab0b5c43d17f8~tplv-k3u1fbpfcp-zoom-1.image)

找到我们刚刚安装的JDK，然后随便新建一个项目就可以了。

### 2.1. 导入IDEA配置

可以直接导入之前自己备份的IDEA配置，非常方便！也可以通过

![image-20220218094846204](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2d606172865414fa7de98072407df91~tplv-k3u1fbpfcp-zoom-1.image)

## 3. 安装git

打开终端，输入`git`，会直接跳出对话框，点击安装即可

![image-20220218100831086](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46bb45f8a97a414e870eb0fb13df3172~tplv-k3u1fbpfcp-zoom-1.image)

## 4. homebrew

> 注意，这里我安装的是ARM版本的homebrew，X86版本的请查阅相关资料

```bash
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
```

**设置环境变量**

从macOS `Catalina(10.15.x)` 版开始，Mac使用`zsh`作为默认Shell，使用`.zprofile`，所以对应命令：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```


如果是`macOS Mojave` 及更低版本，并且没有自己配置过`zsh`，使用`.bash_profile`：

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.bash_profile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

验证是否安装成功，输入

```bash
brew
```



参考链接：https://zhuanlan.zhihu.com/p/341831809

## 5. 数据库连接工具TablePlus

https://tableplus.com/



## 6. 虚拟机

https://www.parallels.cn/pd/general/

![image-20220218082630096](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54e639c4e3d5477b9ece18e03104130e~tplv-k3u1fbpfcp-zoom-1.image)

## 7. 截图工具iShot

![image-20220218082652425](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcc4c6859f0f499c80e615ca1461a741~tplv-k3u1fbpfcp-zoom-1.image)




## 8. 图床工具ipic

下载安装

![image-20220218093650789](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bcc98215a704e74a650e8777a136422~tplv-k3u1fbpfcp-zoom-1.image)

### 8.1. 图床设置

![image-20220218093621274](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6628d5b4c0e74da1ae282fc817ac6090~tplv-k3u1fbpfcp-zoom-1.image)

![image-20220218093827541](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d07d3f0979b64d88bd81471d776449b9~tplv-k3u1fbpfcp-zoom-1.image)

设置完之后点击验证按钮，如果出现通过的字样说面设置成功，直接点击应用即可，否则检查信息重新填写

## 9. 最好用的md写作工具
Typora是我目前通过的体验最好的markdown写作工具，没有之一！V1.0之后变成收费产品了，但是新产品并没有让我值得付费的新功能。

因此我们只需要使用V1.0之前的版本就可以了。
> 可以关注「蝉沐风」公众号，回复「typora」获取Windows和Mac的安装包
### 9.1. 设置图床

打开偏好设置，选择「图像」，按照下图进行设置（需要安装ipic）

![image-20220218094058704](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/312aa5c453664e679cd4410bd032c792~tplv-k3u1fbpfcp-zoom-1.image)

点击「验证图片上传选项」按钮，出现以下提示说明配置成功，之后再Typora中粘贴的图片就会自动上传到你的图床。

![image-20220218094150355](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f90cd15def214ce4aea184760149d5ec~tplv-k3u1fbpfcp-zoom-1.image)

## 10. 解压缩软件

![image-20220218095306409](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bfd84d433bb4628807e37c63f89caf7~tplv-k3u1fbpfcp-zoom-1.image)

## 11. Docker Desktop

https://www.docker.com/products/docker-desktop

![image-20220218095801784](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/843bfd112b394258b0022307e0310617~tplv-k3u1fbpfcp-zoom-1.image)

安装完毕之后登录[dockerhub](https://login.docker.com/u/login/password?state=hKFo2SAtRWxaR0NpeUt1VXBKOHVCUzlpdXpNRTVPbkFockY1eKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGRBbGpHVFM5QzVlVHNDUDVjNTVlSl9SVHB5MGRwbUVio2NpZNkgbHZlOUdHbDhKdFNVcm5lUTFFVnVDMGxiakhkaTluYjk)，然后找到你想下载的软件，接下来我会把链接直接放到每个软件的下方

### 11.1. 11.1 MySQL

https://hub.docker.com/r/mysql/mysql-server

#### 11.1.1. 下载镜像

> 需要下载的镜像是`mysql/mysql-server`，这是社区版本，因为docker官方没有提供适配m1芯片的5.7.X版本的MySQL（arm64）

在终端中直接输入下面的指令，拉取mysql镜像

```bash
# 不加tag默认下载最新版mysql服务器
docker pull mysql/mysql-server
```

你也可以选择mysql镜像提供的tag，下载对应的版本

![image-20220218122739940](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5bf8f448ddb47b18c44a4007ef26a16~tplv-k3u1fbpfcp-zoom-1.image)

```bash
# 下载指定版本的mysql
docker pull mysql/mysql-server
```

下载完成之后打开我们的Docker Desktop就可以看到我们下载的镜像了

![image-20220218134135613](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/197b2e56692946f2bc833a45fd184c26~tplv-k3u1fbpfcp-zoom-1.image)

#### 11.1.2. 运行MySQL实例

```bash
docker run -d --name mysql-server-8 -v /Users/chanmufeng/Docker/mysql8/data:/var/lib/mysql -v /Users/chanmufeng/Docker/mysql8/my.cnf.d:/etc/mysql/my.cnf.d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql/mysql-server
```

下面解释一下这个指令

- `docker run`是docker的指令，表示运行容器
- `-d`标识后台运行容器
- `--name mysql-server-8`：给容器起个名字叫mysql-server-8
- `-v /Users/chanmufeng/Docker/mysql8/data:/var/lib/mysql`：将MySQL容器中的`/var/lib/mysql`目录（这是默认的数据目录）映射到本机的`/Users/chanmufeng/Docker/mysql8/data`目录
- `-v /Users/chanmufeng/Docker/mysql8/my.cnf.d:/etc/mysql/my.cnf.d`：将MySQL容器中的配置文件所在目录`/etc/mysql/my.cnf.d`映射到本机的`/Users/chanmufeng/Docker/mysql8/my.cnf.d`目录

你可能会问，容器中的目录位置我是怎么知道的，看一下官方文档就知道了，如果你懒得看，恰好用的镜像和我是同一个，那就直接照抄，如果是其他版本，我不敢保证目录对不对哦

- `-p 3306:3306`：容器的3306端口映射到本机的3306端口，这样一来你访问本机3306就相当于访问了容器的3306端口
- `-e MYSQL_ROOT_PASSWORD=123456`：root用户的登录密码
- `mysql/mysql-server`：我们刚刚拉取的镜像名称

执行命令之后可能会挂载失败（如果成功了就直接跳到第3步），信息如下

```
docker: Error response from daemon: Mounts denied:
The path XXXXXX/mysql57/data is not shared from the host and is not known to Docker.
You can configure shared paths from Docker -> Preferences... -> Resources -> File Sharing.
```

解决方法，按照下图顺序添加自己的共享路径就可以了

![image-20220218132811271](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4592f205e1974105814df20c65449f7d~tplv-k3u1fbpfcp-zoom-1.image)

再执行指令，mysql就运行成功了

```
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
6f2496a1f77961c27e9ff6d509162af0246dfa00380d110fb06bec22d7ee481a
```

#### 11.1.3. 配置远程连接

接下来用数据连接工具连接一下本地的MySQL试一下吧，如果能成功连接，则跳过接下来的步骤）；

![image-20220218135153548](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca9724a5f79a4d7799e1ca6436e018db~tplv-k3u1fbpfcp-zoom-1.image)

很遗憾，我这里连接不了，接下来我们配置一下远程连接

为了简单，我们创建一个非root用户`chanmufeng`

```bash
# 切换数据库
use mysql;
# 创建用户和密码
CREATE USER 'chanmufeng'@'%' IDENTIFIED BY '123456';
# 授权chanmufeng用户
grant all on *.* to 'chanmufeng'@'%';
```

为了以防万一，我还创建了一个`my.cnf`文件放在了`/Users/chanmufeng/Docker/mysql8/my.cnf.d`，因为这个目录和容器内的配置文件所在的目录做了映射，所以我们写得配置能被容器直接读取

```
[mysqld]
bind-address=0.0.0.0
```

当前只有一个配置，表示接受客户端远程连接，如果有其他配置需求，自己接着写就可以了。

然后试一下远程连接，成功！

![image-20220218141246263](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b73de04b34b4a3faafe08e79b00ec40~tplv-k3u1fbpfcp-zoom-1.image)

#### 11.1.4. 如何通过终端连接MySQL

![image-20220218141854176](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de2708abffe34324bd01100b8c8320ed~tplv-k3u1fbpfcp-zoom-1.image)

### 11.2. 11.2 Redis

https://hub.docker.com/_/redis

#### 11.2.1. 下载镜像

```bash
docker pull redis:6
```

#### 11.2.2. 配置环境

创建目录`/Users/chanmufeng/Docker/redis6/conf`，然后在该目录下创建`redis.conf`文件，内容如下

```
# 记得把这个配置屏蔽掉，否则你会浪费很多时间
# bind 127.0.0.1

protected-mode no
port 6379
tcp-backlog 511
timeout 0

tcp-keepalive 300

# 如果命令行使用了-d 这个地方必须设置为no，否则容器无法启动
daemonize no
supervised no
pidfile /var/run/redis_6379.pid
loglevel notice

# 这个目录也会针对本机做一个映射
logfile "/var/log/redis/6379.log"


databases 16
always-show-logo yes

```



#### 11.2.3. 运行容器

```bash
docker run -d -v /Users/chanmufeng/Docker/redis6/conf:/usr/local/etc -p 6379:6379 -v /Users/chanmufeng/Docker/redis6/log:/var/log/redis --name myredis redis:6 redis-server /usr/local/etc/redis.conf
```

接下来讲解一下指令

- `-v /Users/chanmufeng/Docker/redis6/conf:/usr/local/etc`：我们在`/Users/chanmufeng/Docker/redis6/conf`目录下创建了redis的配置文件，就等同于在`/usr/local/etc`目录下也创建了同一个配置文件（这个很重要，仔细体会）
- `-v /Users/chanmufeng/Docker/redis6/log:/var/log/redis`我们在redis.conf文件中设置了redis容器日志文件的地址，然后把日志文件所在的目录映射到了本机的`/Users/chanmufeng/Docker/redis6/log`目录下，方便我们查看日志

最终的文件映射效果

![image-20220218145342778](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9b604382e784ae3b69696b44b7f0539~tplv-k3u1fbpfcp-zoom-1.image)

- `/usr/local/etc/redis.conf`：指定redis服务启动时使用的配置文件，这个配置文件的地址是容器中文件的地址，实际是由我们本地映射的，参见第一条映射关系



## 12. 配置iTem2 + Zsh + Oh My Zsh

Mac OS，虽然内置了很多开发工具，但是兵器还是要自己亲手调教后才是顺手用的。接下来介绍Mac下的iTerm2 + Zsh + Oh My Zsh 终端环境配置

### 12.1. iTem2下载安装

https://iterm2.com/index.html

### 12.2. Zsh

mac从Catalina开始已经默认使用Zsh了，所以无需多余设置

### 12.3. Oh My Zsh

Zsh虽然好用，但是配置起来还是挺繁琐的。Oh My Zsh开源项目就是为了解决这个问题，他自带了基本配置和非常多的皮肤设置，我们只需要选择喜欢的主题即可

**先安装wget**

```bash
brew install wget
```

安装Oh My Zsh

```bash
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

这一步如果没什么问题那就恭喜你了

如果你遇到了`git clone of oh-my-zsh repo failed`的问题，你可以这样

1. 先下载git仓库

```bash
git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
```

2. 替换zshrc（**替换之前请记得备份！**）

```bash
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

重启终端，你就会看到花花绿绿的终端了。

我习惯使用默认主题了，怎么替换主题大家自行百度一下。

## 13. VSCode

VSCode官方已经完美适配M1芯片，下载的时候需要注意下载指定版本

https://code.visualstudio.com/#alt-downloads

![image-20220219133804670](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/598b09e9a23946158a20ff6cf0ef1daf~tplv-k3u1fbpfcp-zoom-1.image)

## 14. NodeJS

https://nodejs.org/zh-cn/download/

![image-20220219133937717](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dfb4d7cb14943a1a74986e548a2396b~tplv-k3u1fbpfcp-zoom-1.image)

验证安装

```bash
➜  ~ node -v
v16.14.0
➜  ~ npm -v
8.3.1
```