## 概要
couchdbのコンテナ

## セットアップ
- docker-compose.ymlを修正する
DB認証情報（COUCHDB_USER・COUCHDB_PASSWORD・PORTS）を適切に変更する。

- serverディレクトリにcouchdb.jsonを作成する。
couchdbの中身は下記の通り。ユーザ・パス等は上記のDB認証情報による。

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

## 起動方法
- Dockerを起動する。
```
docker-compose up -d
```

- 初回起動時はDB(paon)を作成する必要がある。

### 方法１：server起動
couchdb.jsでDB作成してる

### 方法２：curlでPUT実行
```
curl -X PUT http://admin:password@localhost:5984/paon
```
