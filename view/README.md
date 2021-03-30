## 概要
paonのUI

## セットアップ
credentials.jsonを作成してyolp.appidを設定する。  
credentials.json
```
{
    "yolp": {
        "appid": "***"
    }
}

```
## インストール
```
npm install
```

起動（開発）
```
npm run serve
```

## ビルド（デプロイ向け）  
serverをデプロイし、ドメインをserverurl.jsに設定する。  
AWSのAPI Gatewayへデプロイしたときは、払いだされるAPI Gatewayのエンドポイントを設定する。  
src/const/serverurl.js
```js
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
ビルドした結果はdistディレクトリに出力される。  
distには直下にindex.htmlやjsが生成される。  
vue.config.jsにpublicPathを設定する。
index.htmlやjsなどをドメインのルート直下に設置する場合は"/"を設定する  
```
module.exports = {
    ...,
    publicPath: "/"
};
```
buildコマンドでビルドする。  
distディレクトリが作成される。  
```
npm run build
```
ローカルで確認する場合は、ローカルにサーバーを立てる。  
serveコマンドの実行はdistディレクトリで行う。  
-lはリスニングポート  
http://localhost:9090/でアクセス可能  
```
npm install -g serve
serve -l 9090
```

## デプロイ
### viewのデプロイ
CloudFrontとS3へデプロイする。  

S3は静的コンテンツ(ここではビルドしたdistの中身)のホスティングに使用する。
ビルド結果はSPA(Single Page Application)になっている。  
CloudFrontはS3に格納したSPAが意図しないURLでアクセスされたとき、400系エラーではなく200ステータスに書き換えて返す用途に使用する。  

通常はS3側が意図しないURLでアクセスされると403/404を返してしまう。  
SPAでブラウザリロードすると、ブラウザはサーバーにリクエストを発行するが、サーバー側ではURLに対応するルートは定義していないためエラーが発生する。  

S3側で403などのエラーのとき、任意のファイル(index.htmlなど)を返す仕組みはあるが、レスポンスコードの書き換えまでは対応していない。  
CloudFrontではレスポンスコードの書き換え、およびステータスコードの書き換えに対応している。そのため、CloudFrontを利用する。  


1.生成されたdistをS3バケットに手動でアップロードする
* バケット直下にdist配下の内容を任意に作成したs3パケットにアップロードする
* プロパティ＞静的Webホスティングを有効にし、インデックスドキュメントをindex.htmlにする
* アクセス許可＞ブロックパブリックアクセスのすべてブロックをオフにする  

上記はpackage.configを設定し、viewディレクトリ内で2コマンド実行で実施できる  

package.jsonはconfigでバケット名とcloudformationのスタック名を任意の名前で設定する
```json
  "config": {
    "s3BucketName": "s3-bucket-sample-2021-03-293",
    "cloudFormationStackName": "MyS3Stack"
  }
```

package.json設定後、コマンドを実行する
```sh
# S3バケット作成
npm run create-stack

# S3へファイルアップロード
npm run s3-upload
```
  
2.S3のホスティングのエンドポイントを確認後、CloudFrontを設定する。
* S3のホスティングのエンドポイントをCloudFrontディストリビューションのOrigin Domain Nameにする
* Origin Pathは/に設定(index.htmlを示す)し、他は初期値でディストリビューションを作成する。
* ディストリビューション設定のError Pagesで403エラー時に、ResponsePath:/、HTTPステータス200を返すように設定する  

CloudFrontで払いだされるエンドポイントでブラウザからアクセスし、アクセスできることを確認する  

オプション.CloudFrontのエンドポイントに対して、Route53でドメインを設定する。  
CloudFrontのエンドポイントに対して、ドメインをCNAME設定するときドメインに対してSSL証明書を発行する必要がある。    
ドメインのパブリックSSL証明書はCertificate Managerより発行できる。  
* Certificate Managerで設定したいドメインの証明書を発行する
* Route53でドメインのホストゾーンを作成し、Certificate Managerで払いだされるキーをレコードに設定して、SSL証明書の検証を完了させる
* Route53でCloudFrontのエンドポイントに対して、ドメインのCNAMEレコードで設定する
* CloudFrontのAlternate Domain Namesにドメインの設定をする。

# my-vuetify

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

