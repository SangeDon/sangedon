---
title: Mac下K8S环境搭建
date: 2020-06-23 09:50:12
tags: [Mac, docker]
categories: 环境搭建
---

## 搭建K8S环境

参考文档：https://github.com/AliyunContainerService/k8s-for-docker-desktop

1. ###### docker 已安装，版本为

   ![image-20200810214022444](Mac下K8S环境搭建/image-20200810214022444.png)

2. ###### 下载和 Kubernetes 版本匹配的k8s相关依赖镜像资源，配置好docker 的阿里云或者中科大的镜像加速

```shell
# 下载命令
git clone git@github.com:AliyunContainerService/k8s-for-docker-desktop.git -b v1.16.5
```

3. ###### 进入到下载的 k8s-for-docker-desktop 目录，执行如下命令

```shell
./load_images.sh
```

4. ###### 勾选如下，重启即可

   ![image-20200810215529829](Mac下K8S环境搭建/image-20200810215529829.png)



5. ###### 部署 Kubernetes dashboard（执行了第二条）

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc5/aio/deploy/recommended.yaml
# 或
kubectl create -f kubernetes-dashboard.yaml
```

6. 检查 kubernetes-dashboard 应用状态

```shell
kubectl get pod -n kubernetes-dashboard
```

7. 开启 API Server 访问代理

```shell
kubectl proxy
```

8. 进入k8s仪表盘

链接：http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login

9. 配置控制台访问令牌

```shell
# 获取登陆 token
TOKEN=$(kubectl -n kube-system describe secret default| awk '$1=="token:"{print $2}')
kubectl config set-credentials docker-for-desktop --token="${TOKEN}"
echo $TOKEN
```

- token

```shell
User "docker-for-desktop" set.
eyJhbGciOiJSUzI1NiIsImtpZCI6Ilp3bUthZkNlZzh3bWlsNDJoTkMxVS1nbm1RSU9TM1VPbXhDcURleG9WRnMifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZWZhdWx0LXRva2VuLWtmeDI3Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlZmF1bHQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIzMGM4MWU0OS1lY2QxLTQ1NjktOGY1Mi02OWZiNTMyOWNmYTgiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06ZGVmYXVsdCJ9.uasjTbEU1YEnsYJZ48SK6RBZ9f-SNw9UWimAPe4VQ-2YBExruye04FFREPKXIQw6TJCQ83Vh35kNNXQgYVjEhPMFbgG1oASJZ1fskEul8lBVD2jh41Ul7xrIs4DhADAGpov8nHib7OHN7pkEh8h3UicRdOlYD6pYw2hFvxmHy_ZZwZ8WFXlOeKxh-VT9PYx_LMsNHcZzySO7sQMq7N3jQN7eI8ZFIhoXkA0PaSIb4L0FPYqY0OpwKth0KB6E0181CWUdJVlcICpATL8KPR8HobbGn6uTF5r6gLSX58af1bxGeK4JvKf2sypMcoOdr1s-AYJ8ur7-3E98XWoqsW7UZQ
```

- 安装 ingress失败解决方案

```shell
# 报错如下
The connection to the server raw.githubusercontent.com was refused - did you specify the right host or port?

# 解决如下
sudo vi /etc/hosts

# 添加如下配置即可解决
151.101.76.133 raw.githubusercontent.com
```

- 安装kubesphere-minimal，参考：https://kubesphere.com.cn/docs/zh-CN/installation/prerequisites/

```shell
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

- 安装helm

  下载：https://github.com/helm/helm/releases

  版本：2.16.2

  解压下载的文件后将可执行文件helm添加到path

  ```shell
  mv helm /usr/local/bin/
  
  # 验证安装
  helm version
  
  # 输出
  Client: &version.Version{SemVer:"v2.16.2", GitCommit:"bbdfe5e7803a12bbdf97e94cd847859890cf4050", GitTreeState:"clean"}
  ```

- 初始化 helm 并安装 Tiller

```shell
helm init --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.2 --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
```

