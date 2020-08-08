---

title: ElasticSearch的使用
date: 2019-09-17 15:29:51
tags: [查询]
categories: NOSQL
---

### 安装

使用`docker`安装，具体操作命令见下

```shell
# docker 拉取 elasticsearch 和 配套 kibana
docker pull elasticsearch:7.4.2
docker pull kibana:7.4.2

# 创建挂载目录 /path 目录为创建的elasticsearch挂载根目录
mkdir /path/config
cd /path/config && touch elasticsearch.yml && echo "http.host: 0.0.0.0"
mkdir /path/data
mkdir /path/plugins

# 授权，否则 docker 中启动会报错
cd /path
chmod -R 777

# 启动 elasticsearch，开发测试环境，为节约服务器资源，设置JVM最大可用内存为128M
docker run --name es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms64m -Xmx128m" -v /opt/docker/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /opt/docker/es/data:/usr/share/elasticsearch/data -v /opt/docker/es/plugins:/usr/share/elasticsearch/plugins -d elasticsearch:7.4.2

# 启动 kibana 并关联 elasticsearch，IP一定要改为实际宿主机IP地址
docker run --name kibana -p 5601:5601 -e ELASTICSEARCH_HOSTS=http://123.56.130.109:9200/ -d kibana:7.4.2
```

启动后通过 **http://hostname:9200** ，`elasticsearch`成功访问如下

![image-20200711222638114](/Users/dongliangqiong/Library/Application Support/typora-user-images/image-20200711222638114.png)

通过  **http://hostname:5601**访问 `kibana`，成功如下

![image-20200711224650442](/Users/dongliangqiong/Library/Application Support/typora-user-images/image-20200711224650442.png)

### 使用-HTTP

##### _cat 查询，查看ES信息

- 查看`ElasticSearch`所有节点

```http
GET http://elasticsearch/_cat/nodes
```

- 查看`ElasticSearch`健康状况

```http
GET http://elasticsearch/_cat/health
```

- 查看`ElasticSearch`主节点

```http
GET http://elasticsearch/_cat/master
```

- 查看`ElasticSearch`所有索引，类似于`mysql`的`show databases;`

```http
GET http://elasticsearch/_cat/indices
```



##### 新建-更新

- POST 方式

如下 `customer`为索引（`mysql`中数据库概念），`external`为类型（mysql中表概念），1为插入表中数据的ID，POST方式如果不指定ID（下面URL中的**`1`**），则会在类型中新增一条数据，指定ID时如果没有对应ID记录则新增，有则为修改（会增加版本号）

```http
http://elasticsearch/customer/external/1
{
	"name": "sange don"
}
```

- PUT 方式

和 POST 方式一样可新增、可修改，**必须**指定ID，否则会**报错**，因此 PUT 一般用来做修改操作

```http
http://elasticsearch/customer/external/1
{
	"name": "sange don"
}
```

插入成功返回，如下

```json
{
  "_index" : "customer",  // 索引，相当于mysql中数据库的概念
  "_type" : "external",   // 类型，相当于mysql中表的概念
  "_id" : "1",						// ID，记录的唯一标识，新增时不指定时会自动生成唯一标识
  "_version" : 1,					// 版本号，记录被修改的次数
  "result" : "created",   // 操作状态，created为创建，update为修改
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,         // 并发控制字段，每次修改会 +1 ，用来做乐观锁控制
  "_primary_term" : 1    // 并发控制字段，主分片重新分配，重启会变化
}
```

更新返回，如下

```json
{
  "_index" : "customer",
  "_type" : "external",
  "_id" : "1",
  "_version" : 2,				// 版本号 +1
  "result" : "updated", // 本次为修改操作
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 1,				// 并发控制字段 +1
  "_primary_term" : 1
}
```

- 乐观锁操作（PUT ）

当当前没有其他用户将`ID`为`1`的记录修改，从而造成`_seq_no`改变时更新才会成功，该字段才会 `+1`

```shell
http://elasticsearch/customer/external/1?if_seq_no=1&if_primary_term=1
{
	"name": "sangedon"
}
```

##### 批量操作

- _bulk 操作，样例如下，通过kibana操作 

```http
 POST /_bulk
{"delete":{"_index": "website", "_type": "sangedon", "_id": "1"}}
{"create": {"_index": "website", "_type": "sangedon", "_id": "1"}}
{"title": "First Blog Name"}
{"index":{"_index": "website", "_type": "sangedon"}}
{"title": "Second Blog Name"}
{"update": {"_index": "website", "_type": "sangedon", "_id": "1"}}
{"doc": {"title": "Update Blog Name"}}
```

成功如下

```json
{
  "took" : 402,
  "errors" : false,        // 成功
  "items" : [
    {
      "delete" : {				//删除操作
        "_index" : "website",
        "_type" : "sangedon",
        "_id" : "1",
        "_version" : 1,
        "result" : "not_found",  // 不存在该索引
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 0,
        "_primary_term" : 1,
        "status" : 404		
      }
    },
    {
      "create" : {				// 创建操作
        "_index" : "website",
        "_type" : "sangedon",
        "_id" : "1",
        "_version" : 2,
        "result" : "created",
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 1,
        "_primary_term" : 1,
        "status" : 201
      }
    },
    {
      "index" : {         // 创建
        "_index" : "website",
        "_type" : "sangedon",
        "_id" : "r2KHPnMB0QL-k2fieMeI",
        "_version" : 1,
        "result" : "created",
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 2,
        "_primary_term" : 1,
        "status" : 201
      }
    },
    {
      "update" : {			// 更新操作
        "_index" : "website",
        "_type" : "sangedon",
        "_id" : "1",
        "_version" : 3,
        "result" : "updated",
        "_shards" : {
          "total" : 2,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 3,
        "_primary_term" : 1,
        "status" : 200
      }
    }
  ]
}
```



##### 查询