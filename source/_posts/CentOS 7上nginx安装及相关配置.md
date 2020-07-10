---
title: CentOS 7上Nginx的安装及基本配置
tags: [学习笔记, 服务器]
categories: 中间件
---

<!-- more -->

*Nginx* (engine x) 是一个高性能的`HTTP`和`反向代理`服务，也是一个`IMAP/POP3/SMTP`服务。由俄罗斯人伊戈尔·赛索耶夫为Rambler.ru站点用**C语言**开发的，第一个公开版本0.1.0发布于2004年10月4日，2011年成立同名公司，以提供支持。其源代码以BSD-like 许可证的形式发布，作为一款轻量级 Web/反向代理 服务器以及电子邮件（IMAP/POP3）代理服务器，其主要特点是每条连接占有内存少，并发能力强，常用于Web服务器、反向代理、负载均衡以及HTTP缓存等场景。

## 编译安装(推荐)

### 环境准备

#### gcc

> 安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境，如果没有 gcc 环境，则需要安装：

```shell
yum install gcc-c++
```

#### PCRE pcre-devel

> PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库，nginx也需要此库。

```shell
yum install -y pcre pcre-devel
```

#### zlib

> zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 CentOS上安装 zlib 库。

```shell
yum install -y zlib zlib-devel
```

#### OpenSSL

> OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。
> nginx 不仅支持 http 协议，还支持 https（即在ssl协议上传输http），所以需要在 CentOS上 安装 OpenSSL 库。

```shell
yum install -y openssl openssl-devel
```

- 安装环境综合命令

```shell
yum -y install gcc gcc-c++ autoconf automake zlib zlib-devel openssl openssl-devel pcre-devel
```

### Nginx下载及安装

- [官方下载地址](https://nginx.org/en/download.html)
- 命令行下载


```shell
wget -c https://nginx.org/download/nginx-1.14.1.tar.gz
```

成功结果如下

```shell
[sange@centos-7 java]$ wget -c https://nginx.org/download/nginx-1.14.1.tar.gz
--2019-04-15 22:58:27--  https://nginx.org/download/nginx-1.14.1.tar.gz
Resolving nginx.org (nginx.org)... 95.211.80.227, 62.210.92.35, 2001:1af8:4060:a004:21::e3
Connecting to nginx.org (nginx.org)|95.211.80.227|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1014040 (990K) [application/octet-stream]
Saving to: ‘nginx-1.14.1.tar.gz’

100%[======================================>] 1,014,040    210KB/s   in 4.7s   

2019-04-15 22:58:33 (210 KB/s) - ‘nginx-1.14.1.tar.gz’ saved [1014040/1014040]
```

### 解压

```shell
tar -zxvf nginx-1.14.1.tar.gz
```

#### 目录

```shell
drwxr-xr-x. 6 sange sange   4096 Apr 15 23:16 auto   # 
-rw-r--r--. 1 sange sange 287441 Nov  6 21:52 CHANGES
-rw-r--r--. 1 sange sange 438114 Nov  6 21:52 CHANGES.ru
drwxr-xr-x. 2 sange sange    168 Apr 15 23:16 conf
-rwxr-xr-x. 1 sange sange   2502 Nov  6 21:52 configure
drwxr-xr-x. 4 sange sange     72 Apr 15 23:16 contrib
drwxr-xr-x. 2 sange sange     40 Apr 15 23:16 html
-rw-r--r--. 1 sange sange   1397 Nov  6 21:52 LICENSE
drwxr-xr-x. 2 sange sange     21 Apr 15 23:16 man
-rw-r--r--. 1 sange sange     49 Nov  6 21:52 README
drwxr-xr-x. 9 sange sange     91 Apr 15 23:16 src
```

### 配置

使用默认配置即可，也可自定义配置

1. 使用默认配置

```shell
# 安装完成后nginx.conf等相关文件及目录即在 /usr/local/nginx 目录下
[sange@centos-7 nginx-1.14.1]$ ./configure --prefix=/usr/local/nginx
```

2. 自定义配置（不推荐）

```shell
./configure 
# 以下为’./configure‘ 命令的参数，’=‘后为各项参数的默认值
--prefix=/usr/local/nginx  # Nginx安装路径。
--conf-path=/usr/local/nginx/conf/nginx.conf  # 在没有给定-c选项下默认的nginx.conf的路径
--sbin-path=/usr/local/nginx/sbin  # Nginx可执行文件安装路径。
--pid-path=/usr/local/nginx/conf/nginx.pid  # 在nginx.conf中没有指定pid指令的情况下，默认的nginx.pid的路径
--lock-path=/var/lock/nginx.lock  # nginx.lock文件的路径
--error-log-path=/var/log/nginx/error.log  # 在nginx.conf中没有指定error_log指令的情况下，默认的错误日志的路径
--http-log-path=/var/log/nginx/access.log  # 在nginx.conf中没有指定access_log指令的情况下，默认的访问日志的路径

# 其他参数含义，一般默认即可
--with-*  # 表明启用某些功能模块
--without-*  # 表明禁用某些功能模块
```

### 编译及安装

```shell
[sange@centos-7 nginx-1.14.1]$ sudo make & make install
```

### 操作命令

```shell
[sange@centos-7 nginx-1.14.1]$ whereis nginx  # 查找安装目录
nginx: /usr/local/nginx

# 进入安装目录下的二进制执行文件目录进行相关操作
[sange@centos-7 nginx-1.14.1]$ cd /usr/local/nginx/sbin/  

# 以下为nginx操作命令
./nginx  # 启动 nginx
./nginx -s stop  # 此方式相当于先查出nginx进程id再使用kill命令强制杀掉进程
./nginx -s quit  # 此方式停止步骤是待nginx进程处理任务完毕进行停止
./nginx -s reload  # 当修改 nginx.conf 后重新加载配置文件令其生效
```

### 开机自启动

即在`rc.local`增加启动代码就可以了。

```shell
vi /etc/rc.local
```

增加一行 `/usr/local/nginx/sbin/nginx`，具体如下：

```shell
#!/bin/bash
# THIS FILE IS ADDED FOR COMPATIBILITY PURPOSES
#
# It is highly advisable to create own systemd services or udev rules
# to run scripts during boot instead of using this file.
#
# In contrast to previous versions due to parallel execution during boot
# this script will NOT be run after all other services.
#
# Please note that you must run 'chmod +x /etc/rc.d/rc.local' to ensure
# that this script will be executed during boot.

touch /var/lock/subsys/local
/usr/local/nginx/sbin/nginx  # 增加的一行
```

设置`rc.local`非root用户执行权限：

```shell
chmod 755 rc.local
```

## YUM安装

在CentOS下，yum源不提供nginx的安装，可以通过切换yum源的方法获取安装yum源，下例为官网的yum源。

```shell
sudo rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

安装命令

```shell
yum install -y nginx
```

通过`whereis nginx`查看nginx默认安装路径

```shell
/etc/nginx/  # Nginx默认配置路径，nginx.conf在此
/var/run/nginx.pid  # PID目录
/var/log/nginx/error.log  # 错误日志
/var/log/nginx/access.log  # 访问日志
/usr/share/nginx/html  # 默认站点目录
```

测试命令

```shell
nginx -t 
# 测试成功结果
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

开机自启动

```shell
sudo systemctl enable nginx
```

操作命令

```shell
sudo systemctl start nginx  # 启动服务
sudo systemctl restart nginx  # 停止服务
sudo systemctl reload nginx  # 重新加载配置
```

yum卸载nginx命令

```shell
yum remove -y nginx 
```



## 防火墙问题

> 因CentOS 7 防火墙未开放80端口导致本机不能成功访问虚拟机问题

### CentOS 7 防火墙相关命令

查看已开放端口

```shell
sudo firewall-cmd --list-ports
```

开放`80`端口

```shell
# ContOS 7 防火墙命令改为 `firewall`, 而7以下的防火墙命令为 `iptables`(且具体命令也不同)
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent

# 其他指令含义：
–zone  #作用域
–add-port=80/tcp  #添加端口，格式为：端口/通讯协议
–permanent  #永久生效，没有此参数重启后失效
```

设置完成之后需**重启**防火墙

```shell
sudo firewall-cmd --reload  #重启firewall
sudo systemctl stop firewalld.service  #停止firewall
sudo systemctl disable firewalld.service  #禁止firewall开机启动
```

### CentOS 7以下防火墙相关命令

开放80端口

```shell
sudo /sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT
```

保存

```shell
sudo /etc/rc.d/init.d/iptables save
```

查看开放的端口

```shell
sudo /etc/init.d/iptables status
```

开启与关闭防火墙

```shell
# 永久性生效，重启后不会复原
sudo chkconfig iptables on  # 开启
sudo chkconfig iptables off  # 关闭

# 即时生效，重启后复原
sudo service iptables start  # 开启
sudo service iptables stop  # 关闭
```



- 参考文章

  [mafly](https://www.linuxidc.com/Linux/2016-09/134907.htm)

  [Deep_Deep_Learning](https://blog.csdn.net/jack85986370/article/details/51169203)

  [金武飞扬](https://segmentfault.com/a/1190000014750417)

  [Guoye](https://segmentfault.com/a/1190000018791822)



