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
}

module.exports = {DB: DB}



