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
インストール
```
npm install
```

起動（開発）
```
npm run serve
```

ビルド（デプロイ向け）  
vue.config.jsにpublicPathを設定する  
ドメインのルート直下の場合は"/"を設定する  
```
module.exports = {
    ...,
    publicPath: "/"
};
```
buildコマンドでビルドする  
distディレクトリが作成される  
```
npm run build
```
ローカルで確認する場合は、ローカルにサーバーを立てる  
serveコマンドの実行はdistディレクトリで行う  
-lはリスニングポート  
http://localhost:9090/でアクセス可能  
```
npm install -g serve
serve -l 9090
```

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

