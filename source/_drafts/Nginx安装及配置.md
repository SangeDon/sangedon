---
title: Nginx安装及配置
date: 2020-07-12 11:30:54
tags:[web, 服务器, 负载均衡]
categories: web
---

## 安装

使用docker安装，具体命令如下

```shell
# 创建 nginx 挂载目录 /path/nginx，并在挂载目录下放置一份 nginx.conf 配置文件
mkdir /path/nginx

# 获取 nginx
docker pull nginx:1.18

# 启动
docker run --name nginx -p 80:80 -v /opt/docker/nginx/html:/usr/share/nginx/html -v /opt/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /opt/docker/nginx/logs:/var/log/nginx -d nginx:1.18
```

## 配置

