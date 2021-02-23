const request = require("supertest");
const app = require("../app");
var event = {};



describe("Integration Test", () => {

  function postValidateFailTest(done, uri, field) {
    request(app).post(uri)
    .send(event)
    .expect(422)
    .expect((res) => {
      expect(res.body.ok).toBe(false);
      expect(res.body.type).toBe("validation error");
      expect(res.body.errors[0].param).toBe(field);})
    .end((err, res) => {
      if (err) {
        console.log(res);
        return done(err);
      }
      else  done();
    })
  }

  function getValidateFailTest(done, uri, field) {
    request(app).get(uri)
    .send(event)
    .expect(422)
    .expect((res) => {
      expect(res.body.ok).toBe(false);
      expect(res.body.type).toBe("validation error");
      expect(res.body.errors[0].param).toBe(field);})
    .end((err, res) => {
      if (err) {
        console.log(res);
        return done(err);
      }
      else  done();
    })
  }

  describe("POST /event/create", () => {

    beforeEach(() => {
      event = {
        eventName: "飲み会",
        eventMemo: "のみましょう",
        eventAddDays: "2021-01-01 18:00,2021-01-01 19:00",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
    });

    // eventNameのバリデーションエラー
    test("eventNameの文字数超過によりバリデーションが失敗する",  (done) => {
      event.eventName = "のみかいをやります。。あいうえおかきくけこさしすせそた０１２３４５６７８９abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'())-=^~|[{}]`*:;+,<.>/_";
      postValidateFailTest(done, "/event/create", "eventName");
    });

    // eventMemoのバリデーションエラー
    test("eventMemoの文字数超過によりバリデーションが失敗する", (done) => {
      event.eventMemo = "のみかいをやります。。あいうえおかきくけこさしすせそた０１２３４５６７８９abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'())-=^~|[{}]`*:;+,<.>/_";
      postValidateFailTest(done, "/event/create", "eventMemo");
    });

    // eventAddDaysのバリデーションエラー
    test("eventAddDaysのフォーマットエラーによりバリデーションが失敗する", (done) => {
      event.eventAddDays = "2021/01/01 18:00,2021/01/01 19:00";
      postValidateFailTest(done, "/event/create", "eventAddDays");
    });

    test("eventAddDaysの存在しない日付によりバリデーションが失敗する", (done) => {
      event.eventAddDays = "2021/13/01 18:00,2021/01/01 19:00";
      postValidateFailTest(done, "/event/create", "eventAddDays");
    });

    test("eventAddDaysの未定義によりバリデーションが失敗する", (done) => {
      delete event.eventAddDays;
      postValidateFailTest(done, "/event/create", "eventAddDays");
    });

    // storeIdのバリデーションエラー
    test("storeIdの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeId = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeId");
    });

    // storeLatitudeのバリデーションエラー
    test("storeLatitudeの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeLatitude = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeLatitude");
    });

    // storeLongitudeのバリデーションエラー
    test("storeLongitudeの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeLongitude = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeLongitude");
    });

    // storeNameのバリデーションエラー
    test("storeNameの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeName = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeName");
    });

    // storeAddressのバリデーションエラー
    test("storeAddressの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeAddress = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeAddress");
    });

    // storeUrlのバリデーションエラー
    test("storeUrlの文字数超過によりバリデーションが失敗する", (done) => {
      event.storeUrl = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/create", "storeUrl");
    });

    // 登録失敗
    test("dbにレコード登録時にエラーが発生する", (done) => {

      // model.DB.insertOneRecordがエラーするようにmock
      // クラスのメンバはprototypeで定義すること
      // ※classでメソッド定義すれば自動的にクラス名.prototype.メソッド名で定義していることになる
      let model = require("../model/couchdb.js");
      let spy = jest.spyOn(model.DB.prototype, "insertOneRecord").mockImplementation((data, param) => {
        throw new Error("db insert error.");
      });

      request(app).post("/event/create")
      .send(event)
      .expect(422)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record create error");})
      .end((err, res) => {
        spy.mockRestore();
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    // 登録成功
    test("イベント項目をすべて設定し、dbにレコード登録に成功する", (done) => {
      request(app).post("/event/create")
      .send(event)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
        expect(typeof res.body.id).toBe("string");
        expect(typeof res.body.rev).toBe("string");
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    test("イベント日付以外を設定し、dbにレコード登録に成功する", (done) => {
      event.eventAddDays = "";
      request(app).post("/event/create")
      .send(event)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
        expect(typeof res.body.id).toBe("string");
        expect(typeof res.body.rev).toBe("string");
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });
  })



  describe("GET /event/get", () => {
    var event_id = "";
    var event_rev = "";

    beforeAll(async () => {
      // 前処理として、db取得テスト用途に1レコード登録する
      event = {
        eventName: "飲み会",
        eventMemo: "のみましょう",
        eventAddDays: "2021-01-01 18:00,2021-01-01 21:00",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
      try {
        let response = await request(app).post("/event/create").send(event);
        if (response.body.ok === false) {
          throw new Error("response ok field fail.");
        }
        event_id = response.body.id;
        event_rev = response.body.rev;
      } catch (err) {
        console.log(err);
      }
    });

    afterAll(async () => {
      // 後処理として、db取得用途に登録したレコードを削除する
      try {
        let data = {
          id: event_id,
          rev: event_rev
        };
        let response = await request(app).post("/event/delete").send(data);
        if (response.body.ok === false) {
          throw new Error("response ok field fail.");
        }
      } catch (err) {
        console.log(err);
      }
    });

    // idのバリデーションエラーし、レコード取得失敗
    test("idの文字数超過によりバリデーションが失敗する", async (done) => {
      let id = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      let data = {id};
      request(app).get("/event/get")
      .query(data)
      .expect(422)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("validation error");
        expect(res.body.errors[0].param).toBe("id");})
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    // 空のid指定し、レコード取得失敗
    test("空のidを指定し、レコードの取得に失敗する", async (done) => {
      let id = "";
      let data = {id};
      request(app).get("/event/get")
      .query(data)
      .expect(422)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record refer error");})
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

     // dbに存在しないidを指定して、レコード取得失敗
     test("dbに存在しないidを指定して、レコード取得に失敗する", async (done) => {
      let data = {id: "hogehoge"};
      request(app).get("/event/get")
      .query(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record refer error");})
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  {
          done();
        }
      });
    });   

    // dbがid取得中にエラーが発生して、レコード取得失敗
    test("dbからレコード取得中にエラーが発生して、レコード取得に失敗する", async (done) => {

      let model = require("../model/couchdb.js");
      let spy = jest.spyOn(model.DB.prototype, "getOneRecord").mockImplementation((_id) => {
        throw new Error("db get error.");
      });

      let data = {id: event_id};
      request(app).get("/event/get")
      .query(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record refer error");})
      .end((err, res) => {
        spy.mockRestore();
        if (err) {
          console.log(res);
          return done(err);
        }
        else  {
          done();
        }
      });
    });

    // dbからレコード取得に成功する
    test("dbkからレコード取得に成功する", async (done) => {
      let data = {id: event_id};
      request(app).get("/event/get")
      .query(data)
      .expect(200)
      .expect((res) => {
        let ret_event = {
          ok: true,
          id: event_id,
          rev: event_rev,
          eventName: event.eventName,
          eventMemo: event.eventMemo,
          eventDays: {
            day0: "2021-01-01 18:00",
            day1: "2021-01-01 21:00"
          },
          eventMembers: {},
          storeId: event.storeId,
          storeLatitude: event.storeLatitude,
          storeLongitude: event.storeLongitude,
          storeName: event.storeName,
          storeAddress: event.storeAddress,
          storeUrl: event.storeUrl
        }
        expect(res.body).toEqual(ret_event);
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  {
          done();
        }
      });

    });

  })
});