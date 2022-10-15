import {sidebar} from "vuepress-theme-hope";

export default sidebar({
        "/guide": [
            "",
            "home",
            "slide",
            {
                text: "如何使用",
                icon: "creative",
                prefix: "/guide/",
                link: "/guide/",
                children: "structure",
            },

        ],
        "/posts/basic/": [
            {
                text: "设计模式",
                icon: "guide",
                prefix: "design-pattern/",
                children: [
                    "单例模式",
                    "工厂模式",
                    "静态代理模式",
                    "动态代理模式",
                ]
            },
            {
                text: "设计原则",
                icon: "guide",
                prefix: "design-principle/",
                children: [
                    "开闭原则",
                    "依赖倒置原则",
                ]
            },
        ],

        // MySQL
        "/posts/storage/MySQL": [
            {
                text: "1. 基础篇",
                icon: "strong",
                children: [
                    "一条SELECT语句是如何执行的",
                    "一条UPDATE语句是如何执行的",
                ]
            },
            {
                text: "2. 索引篇",
                icon: "condition",
                children: [
                    "为什么MySQL的主键查询这么快",
                    "从根儿上理解索引",
                    "MySQL索引的正确使用姿势",
                    "为什么不建议你使用SELECT*"
                ]
            },
            {
                text: "3. 事务与锁",
                icon: "lock",
                children: [
                    "事务的隔离性与MVCC",
                ]
            },
            {
                text: "4. 数据一致性",
                icon: "lock",
                children: [
                    "MySQL与Redis的数据一致性",
                ]
            },
            {
                text: "5. 优化",
                icon: "cycle",
                children: [
                    "MySQL优化的5个维度",
                ]
            },
        ],

        // Redis
        "/posts/storage/Redis": [
            {
                text: "1. 持久化",
                icon: "strong",
                children: [
                    "Redis持久化——AOF",
                    "Redis持久化——RDB",
                ]
            },
            {
                text: "2. 事务",
                icon: "condition",
                children: [
                    "鸡肋的Redis事务",
                ]
            },

        ],

        // ES
        "/posts/storage/ElasticSearch": [
            "m1芯片电脑安装cerebro",
            "Google搜索为什么不能无限分页？",

        ],

        // 并发
        "/posts/concurrency": [
            {
                text: "0. 趣谈",
                children: [
                    "用「闪电侠」解释一下进程和线程.md",
                ]
            },
            {
                text: "1. 硬件篇",
                children: [
                    "CPU流水线与指令重排序",
                    "缓存一致性与内存屏障",
                ]
            },

        ],

        // 并发
        "/posts/network-programming": [
            {
                text: "什么是socket",
                // 可选的, 分组标题对应的链接
                link: "什么是socket.md",
                children: [
                    "两种Internet-Socket.md",
                    "漫谈网络",
                ]
            },
            {
                text: "IP地址、struct以及地址转换",
                link: "IP.md",
                children: [
                    "IPv4-IPv6",
                    "字节序",
                    "6种socket数据结构",
                    "IP与二进制转换",
                ]
            },
            {
                text: "从IPv4迁移到IPv6",
                link: "从IPv4迁移到IPv6.md",
            },
            {
                text: "socket编程相关函数",
                link: "socket编程相关函数.md",
                children: [
                    "getaddrinfo.md",
                    "socket.md",
                    "bind.md",
                    "listen.md",
                    "accept.md",
                    "send-recv.md",
                    "sendto-recvfrom.md",
                    "close-shutdown.md",
                    "getpeername.md",
                    "gethostname.md",
                ]
            },
            {
                text: "Client-Server基础",
                link: "client-server.md",
                children: [
                    "stream-server-sample.md",
                    "stream-client-sample.md",
                    "Datagram-Sockets.md",
                ]
            },
        ]

    }
);
