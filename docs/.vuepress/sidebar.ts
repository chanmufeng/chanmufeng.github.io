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
                    "MySQL锁开篇",
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
            {
                text: "3. 高性能网络模型",
                icon: "condition",
                children: [
                    "BIO与非阻塞IO",
                    "彻底搞懂IO多路复用",
                    "同步异步与阻塞非阻塞"
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

    }
);
