---
title: Docker中安装MySQL
tags: docker
categories: 环境搭建
date: 2019-09-20 15:05:52
---


## 单实例安装

- 下载镜像

```shell
docker pull mysql:5.7
```

- 安装

```shell
docker run -p 3306:3306 --name mysql -v /opt/docker/mysql/log:/var/log/mysql -v /opt/docker/mysql/data:/var/lib/mysql -v /opt/docker/mysql/conf:/etc/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```

参数说明：

1. -p 3306:3306 将容器的3306端口映射到主机的3306端口
2. -v 同步主机目录和容器目录
3. -e 初始化mysql的root用户密码

- 配置文件设置

```shell
# 在/opt/docker/mysql/conf下执行
vi my.cnf

# 文件中将下列配置拷贝进去即可
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
init_connect='SET collation_connection=utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve
```

- 重启

```shell
docker restart mysql
```

> MYSQL 服务启动成功！

