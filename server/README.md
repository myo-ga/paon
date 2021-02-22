## 概要
paonのサーバー

## セットアップ
- serverディレクトリ直下にcouchdb.jsonを作成する  
※paonのサーバはcouchdbにデータを保存する
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
- インストール
```
npm install
```

- 起動
```
npm start
```

## テスト

- jestによるテスト
```
npm test
```

- テストの網羅性のレポート作成
```
npm test -- --coverage
```
