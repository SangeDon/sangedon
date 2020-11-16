---
title: 升级Mac下node版本
date: 2020-11-15 18:04:42
tags: Mac
categories: 环境搭建
---

> 可通过 `n` 工具 或者 `nvm` 工具进行升级，具体方式如下

<!-- more -->

## 通过 n 工具升级

1. **查看本机 `nodejs` 版本**

```shell
node -v
```

2. **清除 `nodejs` 的缓存**

```shell
sudo npm cache clean -f
```

3. **安装 `nodejs` 管理工具 `n` 工具，对，名字就叫 `n`**

```shell
sudo npm install -g n
```

4. **安装最新稳定版本的 `nodejs`**

```shell
sudo n stable
```

5. **查看本机 `nodejs` 版本，见步骤 1**

6. **更新 `npm` 到最新版**

```shell
sudo npm install npm@latest -g
```

7. **验证**

```shell
# 验证 node 版本
node -v

# 验证 npm 版本
npm -v
```

## 通过 nvm 工具升级

1. `nvm` 安装

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

2. 检查是否安装成功

```shell
nvm --version
```

> 若不成功，执行 `source ~/.bash_profile` 即可，若还不成功，需配置nvm环境变量信息

3. 安装 `nodejs` 

```shell
# version字段为要安装的node版本
nvm  install version

# 如要安装12.9.0
nvm install 12.9.0
```

4. 查看 `nodejs` 版本

```shell
node -v
```

5. 使用 `nvm` 管理 `nodejs` 版本

```shell
# 查看 nodejs 版本
nvm list

# 使用某个版本 nodejs
nvm use 12.9.0
```

