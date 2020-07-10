title: linux关于profile 、bashrc 、.bash_profile、.bashrc的区别
date: 2019-07-24 11:15:24
tags: 配置
categories: linux



|                |     /etc/profile     | /etc/bashrc                      |                       ~/.bash_profile                        | ~/.bashrc                                     |
| :------------: | :------------------: | -------------------------------- | :----------------------------------------------------------: | --------------------------------------------- |
|    作用范围    |   系统全局所有用户   | 系统全局所有用户                 | 针对单个用户有效，如/home/user1/.bash_profile 中设定了环境变量，只针对 user1 这个用户生效. | 针对单个用户有效                              |
|    作用内容    | 设置全局系统环境参数 | 设置全局系统bash shell相关的配置 |                    功能和/etc/profile类似                    | 类似于/etc/bashrc                             |
| 是否loginshell |     login shell      | non-loginshell                   |                      交互式 login shell                      | non-loginshell                                |
|    生效时间    |    所有用户登入时    | 所有用户登入时                   |               针对的用户，在登入的时候加载一次               | 针对的用户，每次执行shell脚本时都会使用它一次 |

- 修改配置文件后即时生效命令

```shell
# source 命令后跟需要生效的配置文件即可
source /ext/profile
```

