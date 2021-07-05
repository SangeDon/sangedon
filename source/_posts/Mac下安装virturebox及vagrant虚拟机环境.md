---
title: Mac下安装virturebox及vagrant虚拟机环境
tags: Mac
categories: 环境搭建
date: 2020-06-22 14:32:15
---

<!-- more -->

## 安装virturebox

下载：https://www.virtualbox.org/wiki/Downloads

版本：6.1.18

安装步骤：双击下一步即可



## 安装vagrant

下载：https://www.vagrantup.com/downloads.html

版本：2.2.14

安装步骤：双击下一步即可

- 虚拟机Box下载地址

> 官方虚拟机box下载地址：https://app.vagrantup.com/boxes/search
>
> 仓库虚拟机box下载地址：http://www.vagrantbox.es/



## 配置vagrant

查看vagrant安装版本

```shell
# 输入
vagrant -v
# 输出
Vagrant 2.2.9
```

- 检查已有的虚拟机列表vagrant box list，提示还没有任何虚拟机

```shell
dongliangqiong@dongliaongdeMBP sangedon % vagrant box list
There are no installed boxes! Use `vagrant box add` to add some.
```

- 将官网box下载下来的 `CentOS-7-x86_64-Vagrant-1902_01.VirtualBox.box`放入 `/Users/dongliangqiong/Documents/sangedon/devtools/software/vagrant`目录，后执行如下操作

```shell
vagrant box add centos7 /Users/dongliangqiong/Documents/sangedon/devtools/software/vagrant/CentOS-7-x86_64-Vagrant-1902_01.VirtualBox.box
```

- 执行`vagrant init centos7`，即可在当前目录生成此虚拟机的配置文件Vagrantfile

```shell
dongliangqiong@dongliaongdeMBP sangedon % vagrant init centos7
A `Vagrantfile` has been placed in this directory. You are now
ready to `vagrant up` your first virtual environment! Please read
the comments in the Vagrantfile as well as documentation on
`vagrantup.com` for more information on using Vagrant.
```

- 执行命令`vagrant up`，启动虚拟机（参考：http://www.voidcn.com/article/p-zmehqqii-bdx.html）

- 链接虚拟机

```shell
vagrant ssh
```

- 设置root用户登陆

```shell
# vagrant登陆进去之后跳转root账户
sudo -s

# 设置root账户账号
passwd

# 修改 /etc/ssh/sshd_config 文件，下面两项改为yes
PermitRootLogin yes
PasswordAuthentication yes

# 重启服务
service sshd restart
```

> 虚拟机创建成功，可通过 `ssh root@ip` 命令连接