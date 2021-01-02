# 概要
couchdbのコンテナ

# 起動方法
docker-compose up -d

# セットアップ
- serverディレクトリにcouchdb.jsonを作成する。

couchdb.json
```
{
    "credentials": {
        "user": "admin",
        "password": "password",
        "port": "5984",
        "url":"localhost"
    }
}
```
- 初回起動時はDB(paon)を作成する必要がある。

## 方法１：server起動
couchdb.jsでDB作成してる

## 方法２：curlでPUT実行
```
curl -X PUT http://admin:password@localhost:5984/paon
```
