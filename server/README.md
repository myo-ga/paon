## 概要
paonのサーバー

## セットアップ
サーバーはDBにデータを保存する。  
保存先のDBは2種類設定できる。  

- couchdb
- cloudant

いずれかを設定する  

### couchdbを使用する場合
serverディレクトリ直下にcouchdb.jsonを作成する  
```js
{
	"credentials": {
		"user": "admin",
		"password": "password",
		"port": "5984",
		"url":"couchdb"
	}
}
```
server/config/default.jsonのdb_typeを"couchdb"にする
```js
  "env": {
      "//": "コメント db_type: cloudant or couchdb",
      "db_type": "couchdb"
  }
```

### cloudantを使用する場合
serverディレクトリ直下にvcap-local.jsonを作成する
```js
{
  "cloudantNoSQLDB": [
    {
      "credentials": {
        "url": "IBM Cloudantより払い出されるusername,password,hostのURL"
      }
    }
  ]
}
```
server/config/default.jsonのdb_typeを"cloudant"にする
```js
  "env": {
      "//": "コメント db_type: cloudant or couchdb",
      "db_type": "cloudant"
  }
```

### インストール/起動

インストール
```
npm install
```

起動
```
npm start
```

## テスト

jestによるテスト
```
npm test
```

テストの網羅性のレポート作成
```
npm test -- --coverage
```

## API GatewayとLambdaへデプロイ  
aws-cliをインストールし、設定済みであることを前提とする。  
serverless-expressを使うことで、expressをlambdaアプリケーションとしてデプロイできる。  
1. s3バケットの名称を定義する
2. lambdaアプリケーションを設置するs3バケットを作成する
3. expressをパッケージにして、lambdaアプリケーションに設置する

1.s3バケットの名称を定義する  
package.json
```js
  "config": {
    "s3BucketName": "任意の名前",
    "region": "us-east-1",
    "cloudFormationStackName": "ServerlessExpressHttpApiStack",
    "functionName": "",
    "domain": ""
  }
```

2.lambdaアプリケーションを設置するs3バケットを作成する。
```
npm run create-bucket
```

3.expressをパッケージにして、lambdaアプリケーションとしてデプロイする。  
このとき、アプリケーションの実体はs3に設置される。
```
npm run package-deploy
```

4.AWSのWebコンソールにログインし、API Gatewayを参照しエンドポイントのURLを確認してアクセスする。
