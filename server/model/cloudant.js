var Cloudant = require('@cloudant/cloudant');

var DB = function() {

    // 資格情報読み込み
    this.readCredentialUrl = function () {
        let appEnv = null;
        if (process.env.VCAP_SERVICES) {
            appEnv = JSON.parse(process.env.VCAP_SERVICES);
        } else {
            appEnv= require('../vcap-local.json');
        }
        let url = appEnv['cloudantNoSQLDB'][0].credentials.url;
        return url;
    }


    // 初期化
    this.init = function (dbName) {
        let url = this.readCredentialUrl();
        this.cloudant = Cloudant(url,
            (err, cloudant, pong) => {
                if (err) {
                    return console.log('Failed to initialize Cloudant: ' + err.message);
                }
            }
        )
        this.dbIf = this.cloudant.use(dbName);
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



