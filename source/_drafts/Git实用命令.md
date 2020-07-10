---
title: Git实用命令
date: 2019-08-23 10:52:24
tags:
categories:
---

git status  

查看下当前代码状态，有需要提交的就提交，没用需要提交的就保持原样
git pull
拉取远程代码，使得本地代码保持最新
git branch -a 
查看最新代码所在分支
remotes/origin/HEAD -> origin/master
最新的分支会有remotes/origin/HEAD ->指明
git merge origin/master
执行合并命令把最新分支代码合并到本地当前分支
git diff
查看冲突信息
git status 
查看下状态看看那些文件需要手工调整
git add .
把修改好的文件添加到索引
git commit -m  '合并XXX分支代码'
提交代码
git push
把合并好的代码推送到远程



git stash 