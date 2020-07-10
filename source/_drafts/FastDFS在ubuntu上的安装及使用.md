---

title: FastDFS在Ubuntu上的安装及使用

tags: 学习笔记

---



libfatscommon 是 fastdfs 常用函数封装的库，需要从github上clone到本地编译安装，如果没有安装git需先安装。

<!-- more -->

```shell
# 安装 git
apt-get install git
```

> 下载安装libfastcommon

```shell
# 克隆项目
git clone https://github.com/happyfish100/libfastcommon.git

# 进入目录
cd libfastcommon/

# 编译
./make.sh

# 安装
sudo ./make.sh install

# 设置环境变量
export LD_LIBRARY_PATH=/usr/lib64/

# 建立软连接
ln -s /usr/lib64/libfastcommon.so /usr/local/lib64/libfastcommon.so
```

> 安装FastDFS

```shell
# 下载 FastDFS
git clone https://github.com/happyfish100/fastdfs.git

# 进入目录
cd fastdfs/

# 编译安装
./make.sh && ./make.sh install
```

```shell
#暂时直接复制到目标目录，没有其他修改，相关配置可以在跑通后详细阅读和修改
cp /usr/local/src/fastdfs/conf/http.conf /etc/fdfs/ #供nginx访问使用
cp /usr/local/src/fastdfs/conf/mime.types /etc/fdfs/ #供nginx访问使用

#配置文件准备(Notice: 根据本机的角色，按需复制粘贴配置文件!)
cp /etc/fdfs/tracker.conf.sample /etc/fdfs/tracker.conf
cp /etc/fdfs/storage.conf.sample /etc/fdfs/storage.conf
cp /etc/fdfs/client.conf.sample /etc/fdfs/client.conf #客户端文件，测试用
```

> 获取 fastdfs-nginx-module
>
> 此 module 用于避免上传完成后，且 group storage 同步文件完成前，客户端从正在同步的主机处下载文件导致的出错

```shell
cd /usr/local/src

git clone https://github.com/happyfish100/fastdfs-nginx-module.git --depth 1

cp /usr/local/src/fastdfs-nginx-module/src/mod_fastdfs.conf /etc/fdfs
```

> 安装Nginx
>
> - tracker 和 storage 均需要安装 nginx
> -  对于 tracker, nginx 可以均衡负载到不同的 storage
> - 对于 storage, nginx 可以提供反向代理，从而访问数据存储位置的文件
> - 由于需要使用启用非默认 module , 故需要通过源码编译安装，不能使用 yum . 使用源码安装 nginx 的注意事项见《nginx - make install》

```shell
# 安装nginx依赖环境
apt-get install libpcre3 libpcre3-dev
apt-get install zlib1g-dev
```

- 将下载好的nginx移动到Ubuntu自定义目录下

```shell
# 解压nginx
tar -xvf nginx-1.14.1.tar.gz

# 进入nginx目录
cd nginx-1.14.1

# 预编译Nginx, 并指定nginx安装目录，增加fastdfs模块
./configure --prefix=/usr/local/nginx --add-module=/home/sange/Downloads/fastdfs-nginx-module/src/

# 编译安装
$ make && make install
```

> - 需要配置 nginx, tracker, storage 和 client
> - tracker 和 storage 需要搭配 nginx 使用，故在本教程中， nginx 的配置都是关于 tracker 和 storage 的，与 client 无关。
> - tracker, storage 和 client 都有自身的配置项，需要单独配置。

```shell
vim /etc/fdfs/tracker.conf

base_path=/home/yuqing/FastDFS
改为:
base_path=/home/dfs

#将 tracker 和 storage 的 http.server_port 统一改为80可以正常访问，但是否最优方案，还需要观察
http.server_port=8080
改为:
http.server_port=80
```

