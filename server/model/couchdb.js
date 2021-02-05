readCredentialUrl = function () {
    let appEnv = null;
    appEnv= require('../couchdb.json');
    let url = 'http://'
        + appEnv.credentials.user + ':'
        + appEnv.credentials.password + '@'
        + appEnv.credentials.url + ':'
        + appEnv.credentials.port;
    return url;
}
var nano = require('nano')(readCredentialUrl());

var DB = function() {

    // 初期化
    this.init = function (dbName) {
        nano.config.url = readCredentialUrl();
        
        //console.log('URL:' + nano.url);
        nano.db.list(
            (err, body) => {
                if(err){
                    return console.log('Failed to initialize Couchdb: ' + err.message);
                }
                else if(body.indexOf(dbName) == -1){
                    nano.db.create(dbName);
                    console.log('*****test');
                }
            }
        );
        this.dbIf = nano.db.use(dbName);
    };

    // id検索
    this.getOneRecord = async function (id) {
        // id check
        try {
            let result = await this.dbIf.get(id);
            return result;
        } catch(err) {
            throw err;
        };
    }
    // 挿入
    // awaitでinsertを同期処理する
    // asyncはPreomiseを返し、returnでresolveの引数にする
    // throwはPromiseを返し、rejectの引数にする
    // awaitはpromiseがresolveされるまで待つ。その結果(resolveされた結果）を返す
    // ※Promiseは非同期する処理を記述し、成功時、失敗時にコールバック関数を定義できる
    this.insertOneRecord = async function (data, param) {
        try {
            let result = await this.dbIf.insert(data, param);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // 更新
    this.updateOneRecord = async function (data, param) {
        try {
            // _id, _revも合わせて指定すること
            let result = await this.dbIf.insert(data, param);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // 削除
    this.deleteOneRecord = async function (id, rev) {
        try {
            let result = await this.dbIf.destroy(id, rev);
            return result;
        } catch (err) {
            throw err;
        }
    }

    // リスト全て
    this.getAllRecord = async function () {
        try {
            let result = await this.dbIf.list();
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = {DB: DB}



