
jest.mock("nano");

var nano = require('nano')
nano.mockImplementation((url)=>{
  nano.config = {url};
  nano.db = {};
  return nano;
});

const model = require("../model/couchdb");


describe("Unit Test", () => {

  
  // DB初期化
  describe("DB.init", () => {
    test("DB一覧の取得に失敗し、例外が発生すること", async () => {
      nano.db.list = jest.fn(() => {
        throw new Error("nano.db.list error");
      });
      let database = new model.DB();
      try {
        await database.init("paon");
      } catch (e) {
        // listで指定した例外が発生すること
        expect(e.message).toMatch("nano.db.list error");
      }
    });

    test("DBが存在せず生成を試みるが失敗し、例外が発生すること", async () => {
      nano.db.list = jest.fn(() => {
        return [];
      });
      nano.db.create = jest.fn((dbName) => {
        throw new Error("nano.db.create error");
      });
      let database = new model.DB();
      try {
        await database.init("paon");
      } catch (e) {
        // createで指定した例外が発生すること
        expect(e.message).toMatch("nano.db.create error");
      }
    });

    test("DBが存在せず生成を行い、処理が成功すること", async () => {
      nano.db.list = jest.fn(() => {
        return [];
      });
      nano.db.create = jest.fn((dbName) => {
        return dbName;
      });
      nano.db.use = jest.fn((dbName) => {
        return dbName;
      });
      let database = new model.DB();
      let ret = await database.init("paon");
      // createのDB生成メソッドが呼ばれていること
      expect(nano.db.create).toHaveBeenCalled();
      // 処理が成功(true)で終えていること
      expect(ret).toBeTruthy();

    });

    test("DBが存在して、処理が成功すること", async () => {
      nano.db.list = jest.fn(() => {
        return ["paon"];
      });
      nano.db.create = jest.fn((dbName) => {
        return dbName;
      });
      nano.db.use = jest.fn((dbName) => {
        return dbName;
      });
      let database = new model.DB();
      let ret = await database.init("paon");
      // createのDB生成メソッドが呼ばれていないこと
      expect(nano.db.create).not.toHaveBeenCalled();
      // 処理が成功(true)で終えていること
      expect(ret).toBeTruthy();
    });
  })


  // レコード取得
  describe("DB.getOneRecord", () => {
    test("DBからレコードの取得に失敗し、例外が発生すること", async () => {
      let db = new model.DB();
      db.dbIf = {
        get: jest.fn(async (id) => {
          throw new Error("DB.getOneRecord error");
        })
      }
      try {
        await db.getOneRecord("12345");
      } catch (e) {
        // dbIf.getで発生したエラーが取得できること
        expect(e.message).toMatch("DB.getOneRecord error")
      }
    });

    test("DBからレコードの取得に成功し、getのリターンが返されること", async () => {
      let db = new model.DB();
      db.dbIf = {
        get: jest.fn(async (id) => {
          return new Promise((resolve, reject) => {
            resolve({id});
          });
        })
      }
      let output = await db.getOneRecord("12345");
      // dbIf.getで指定したidが取得できること
      expect(output).toEqual({id:"12345"});
    });

  });


  // レコード挿入
  describe("DB.insertOneRecord", () => {
    test("DBへレコードの挿入に失敗し、例外が発生すること", async () => {
      let db = new model.DB();
      db.dbIf = {
        insert: jest.fn(async (data, param) => {
          throw new Error("DB.insertOneRecord error");
        })
      }
      try {
        await db.insertOneRecord({data: "test"});
      } catch (e) {
        // dbIf.getで発生したエラーが取得できること
        expect(e.message).toMatch("DB.insertOneRecord error");
      }
    });

    test("DBへレコードの挿入に成功し、insertのリターンが返されること", async () => {
      let db = new model.DB();
      db.dbIf = {
        insert: jest.fn(async (data, param) => {
          return new Promise((resolve, reject) => {
            resolve({_id: "12345"});
          });
        })
      }
      let output = await db.insertOneRecord({data: "test"});
      // dbIf.insertでリターンされる値を返すこと
      expect(output).toEqual({_id: "12345"});
    });

  });


  // レコード更新
  describe("DB.updateOneRecord", () => {
    test("DBへレコードの更新に失敗し、例外が発生すること", async () => {
      let db = new model.DB();
      db.dbIf = {
        insert: jest.fn(async (data, param) => {
          throw new Error("DB.updateOneRecord error");
        })
      }
      try {
        await db.updateOneRecord({data: "test"});
      } catch (e) {
        // dbIf.insertで発生したエラーが取得できること
        expect(e.message).toMatch("DB.updateOneRecord error");
      }
    });

    test("DBへレコードの更新に成功し、insertのリターンが返されること", async () => {
      let db = new model.DB();
      db.dbIf = {
        insert: jest.fn(async (data, param) => {
          return new Promise((resolve, reject) => {
            resolve({_id: "12345", _rev: "2-12345"});
          });
        })
      }
      let output = await db.updateOneRecord({_id: "12345", _rev: "1-12345", data: "test"});
      // dbIf.insertでリターンされる値を返すこと
      expect(output).toEqual({_id: "12345", _rev: "2-12345"});
    });
  });


  // レコード削除
  describe("DB.deleteOneRecord", () => {
    test("DBへレコードの削除に失敗し、例外が発生すること", async () => {
      let db = new model.DB();
      db.dbIf = {
        destroy: jest.fn(async (id, rev) => {
          throw new Error("DB.deleteOneRecord error");
        })
      }
      try {
        await db.deleteOneRecord("12345", "1-12345");
      } catch (e) {
        // dbIf.destroyで発生したエラーが取得できること
        expect(e.message).toMatch("DB.deleteOneRecord error");
      }
    });

    test("DBへレコードの削除に成功し、deleteのリターンが返されること", async () => {
      let db = new model.DB();
      db.dbIf = {
        destroy: jest.fn(async (id, rev) => {
          return new Promise((resolve, reject) => {
            resolve({_id: id, _rev: rev});
          });
        })
      }
      let output = await db.deleteOneRecord("12345", "1-12345");
      // dbIf.insertでリターンされる値を返すこと
      expect(output).toEqual({_id: "12345", _rev: "1-12345"});
    });
  });


  // レコード全取得
  describe("DB.getAllRecord", () => {
    test("DBから全レコードの取得に失敗し、例外が発生すること", async () => {
      let db = new model.DB();
      db.dbIf = {
        list: jest.fn(async () => {
          throw new Error("DB.getAllRecord error");
        })
      }
      try {
        await db.getAllRecord();
      } catch (e) {
        // dbIf.listで発生したエラーが取得できること
        expect(e.message).toMatch("DB.getAllRecord error")
      }
    });

    test("DBからレコードの取得に成功し、listのリターンが返されること", async () => {
      let record_list = [
        {_id:"12345", _rev:"1-12345"},
        {_id:"23456", _rev:"1-23456"}
      ];
      let db = new model.DB();
      db.dbIf = {
        list: jest.fn(async () => {
          return new Promise((resolve, reject) => {
            resolve(record_list);
          });
        })
      };
      let output = await db.getAllRecord();
      // dbIf.getで指定したidが取得できること
      for (let i = 0; i < output.length; i++) {
        expect(output[i]).toEqual(record_list[i]);
      }
    });

  });

})

