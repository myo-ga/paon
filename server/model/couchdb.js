function readCredentialUrl() {
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

class DB {

    // 初期化
    async init(dbName) {

        let db_list = [];

        try {
            db_list = await nano.db.list();
        } catch (err) {
            console.log('Failed to initialize Couchdb: ' + err.message);
            throw err;
        }

        if (db_list.indexOf(dbName) === -1) {
            try {
                await nano.db.create(dbName);
            } catch (err) {
                console.log('Failed to create Couchdb: ' + err.message);
                throw err;
            }
        }

        this.dbIf = nano.db.use(dbName);
        return true;
    };

    // id検索
    async getOneRecord(id) {
        // id check
        try {
            let result = await this.dbIf.get(id);
            return result;
        } catch(err) {
            throw err;
        }
    }
    // 挿入
    // awaitでinsertを同期処理する
    // asyncはPreomiseを返し、returnでresolveの引数にする
    // throwはPromiseを返し、rejectの引数にする
    // awaitはpromiseがresolveされるまで待つ。その結果(resolveされた結果）を返す
    // ※Promiseは非同期する処理を記述し、成功時、失敗時にコールバック関数を定義できる
    async insertOneRecord(data, param) {
        try {
            let result = await this.dbIf.insert(data, param);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // 更新
    async updateOneRecord(data, param) {
        try {
            // _id, _revも合わせて指定すること
            let result = await this.dbIf.insert(data, param);
            return result;
        } catch (err) {
            throw err;
        }
    }
    // 削除
    async deleteOneRecord(id, rev) {
        try {
            let result = await this.dbIf.destroy(id, rev);
            return result;
        } catch (err) {
            throw err;
        }
    }

    // リスト全て
    async getAllRecord() {
        try {
            let result = await this.dbIf.list();
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = {DB: DB}



