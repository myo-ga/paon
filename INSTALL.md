# 開発環境インストール手順

## 概要
3つのサーバーをコンテナで動かしている
- view: SPAを格納しているサーバ
- server: SPAからのWeb APIを処理するサーバ
- couchdb: Web API内でデータのやり取りをするデータベースサーバ

## 動作確認環境
WSL2 + Docker Desktop

## インストール手順
serverにcouchdbの設定ファイルを用意する。  

./server/couchdb.json
```
{
	"credentials": {
		"user": "admin",
		"password": "password",
		"port": "5984",
		"url":"couchdb"
	}
}
```

viewにYahoo Open Local Platform (YOLP)のappidを設定する。   
appidはYahoo!デベロッパーネットワークより取得する必要あり。  

./view/credentials.json
```
{
  "yolp":{
    "appid":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

viewにWeb APIのURLを設定する。  
serverへのアクセスするドメイン名に設定する。  

./view/src/const/serverurl.js
```
export default Object.freeze({
    EVENT_CREATE_URL : "http://localhost:8081/event/create", 
    EVENT_UPDATE_URL : "http://localhost:8081/event/update",
    EVENT_DELETE_URL : "http://localhost:8081/event/delete",
    EVENT_GET_URL    : "http://localhost:8081/event/get",

    MEMBER_CREATE_URL: "http://localhost:8081/member/create",
    MEMBER_UPDATE_URL: "http://localhost:8081/member/update",
    MEMBER_DELETE_URL: "http://localhost:8081/member/delete"
})
```

docker-composeで実行させる。  
起動
```
docker-compose up -d
```

停止
```
docker-compose down
```

