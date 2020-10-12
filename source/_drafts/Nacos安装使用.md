---
title: Nacos安装使用
date: 2020-07-12 11:50:05
tags:
categories:
---

## 安装



###  使用docker安装，具体命令如下

```shell
# 下载
docker pull nacos/nacos-server:latest

# 启动
docker run --name nacos -p 8848:8848 -e MODE=standalone -v /opt/docker/nacos/logs:/home/nacos/logs -v /opt/docker/nacos/data:/home/nacos/data -v /opt/docker/nacos/conf:/home/nacos/conf -d nacos/nacos-server:latest
```



### 下载安装

- 下载地址：https://github.com/alibaba/nacos/releases
- 安装命令

```shell
# 解压
tar -xvf nacos-server-1.3.2.tar.gz

# 单机运行
cd bin && sh startup.sh -m standalone
```

