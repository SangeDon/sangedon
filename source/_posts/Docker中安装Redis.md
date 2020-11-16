---
title: Docker中安装Redis
tags: docker
categories: 环境搭建
date: 2019-09-20 15:51:27
---

<!-- more -->

## 单机安装

- 下载

```shell
docker pull redis
```

- 安装运行

```shell
docker run --name redis -p 6379:6379 -v /opt/docker/redis/data:/data -v /opt/docker/redis/conf/redis.conf:/etc/redis/redis.conf -d redis redis-server /etc/redis/redis.conf
```

- 设置配置文件

```shell
# 在/opt/docker/redis/conf/目录下生成配置文件即可，后续可补充配置，重启即可
touch redis.conf
```

