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

  describe("POST /event/create", () => {
    var event_id = "";
    var event_rev = "";
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

    afterEach(async () => {
      if (event_id === "") return;
      if (event_rev === "") return;
      let data = {
        id: event_id,
        rev: event_rev
      }
      await request(app).post("/event/delete").send(data);
      event_id = "";
      event_rev = "";
    })

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
        event_id = res.body.id;
        event_rev = res.body.rev;
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
        event_id = res.body.id;
        event_rev = res.body.rev;
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

  });



  describe("POST /event/delete", () => {
    var event_id = "";
    var event_rev = "";

    beforeAll(async () => {
      // 前処理として、db削除テスト用途に1レコード登録する
      let data = {
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
        let response = await request(app).post("/event/create").send(data);
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
      // 後処理として、db削除用途に登録したレコードを削除する
      try {
        let data = {id: event_id};
        let response = await request(app).get("/event/get").query(data);
        if (response.body.ok === false) {
          return;
        }
        data = {
          id: event_id,
          rev: event_rev
        };
        response = await request(app).post("/event/delete").send(data);
        if (response.body.ok === false) {
          throw new Error("response ok field fail.");
        }
      } catch (err) {
        console.log("A test record of /event/delete is already deleted !");
      }
    });

    // idの文字数超過のバリデーションエラー
    test("idの文字数超過によりバリデーションが失敗する", (done) => {
      let id = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      let rev = "12345";
      event = {id, rev};
      postValidateFailTest(done, "/event/delete", "id");
    });

    // revの文字数超過のバリデーションエラー
    test("revの文字数超過によりバリデーションが失敗する", (done) => {
      let id = "12345";
      let rev = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      event = {id, rev};
      postValidateFailTest(done, "/event/delete", "rev");
    });

    // 指定されたidが正しくない
    test("idのフォーマットが正しくないため削除に失敗する", (done) => {
      let data = {
        id: "",
        rev: ""
      };
      request(app).post("/event/delete")
      .send(data)
      .expect(422)
      .expect((res) => {
        let ret = {
          ok: false,
          type: "record delete error",
          errors: [{msg: "Invalid doc id"}]
        }
        expect(res.body).toEqual(ret);
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    // 指定されたrevが正しくない
    test("revのフォーマットが正しくないため削除に失敗する", (done) => {
      let data = {
        id: event_id,
        rev: "123"
      };
      request(app).post("/event/delete")
      .send(data)
      .expect(422)
      .expect((res) => {
        let ret = {
          ok: false,
          type: "record delete error",
          errors: [{msg: "Invalid rev format"}]
        }
        expect(res.body).toEqual(ret);
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    // 指定されたidのレコードが存在しない
    test("idが存在しないため削除に失敗する", (done) => {
      let data = {
        id: "0a1945a9296c62d2867d1d77d7000010",
        rev: "123"
      };
      request(app).post("/event/delete")
      .send(data)
      .expect(422)
      .expect((res) => {
        let ret = {
          ok: false,
          type: "record delete error",
          errors: [{msg: "missing"}]
        }
        expect(res.body).toEqual(ret);
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      })
    });

    // 削除成功
    test("dbからレコード削除に成功する", (done) => {
      let data = {
        id: event_id,
        rev: event_rev
      };
      request(app).post("/event/delete")
      .send(data)
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
  });


  describe("POST /event/update", () => {

    var event_id = "";
    var event_rev = "";

    beforeEach(async () => {
      // 前処理として、db削除テスト用途に1レコード登録する
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

    afterEach(async () => {
      // 後処理として、db削除用途に登録したレコードを削除する
      try {
        let event = {
          id: event_id,
          rev: event_rev
        };
        let response = await request(app).post("/event/delete").send(event);
        if (response.body.ok === false) {
          throw new Error("response ok field fail.");
        }
      } catch (err) {
        console.log("A test record of /event/delete is already deleted !");
      }
    });

    test("idの文字数超過でバリデーションに失敗する", (done) => {
      event.id = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      postValidateFailTest(done, "/event/update", "id");
    });

    test("revの文字数超過でバリデーションに失敗する", (done) => {
      event.id = event_id;
      event.rev = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      event.eventDelDays = "day0,day1";
      postValidateFailTest(done, "/event/update", "rev");
    });

    test("eventNameの文字数超過でバリデーションに失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.eventName = "のみかいをやります。。あいうえおかきくけこさしすせそた０１２３４５６７８９abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'())-=^~|[{}]`*:;+,<.>/_";
      postValidateFailTest(done, "/event/update", "eventName");
    });

    test("eventMemoの文字数超過でバリデーションに失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.eventMemo = "のみかいをやります。。あいうえおかきくけこさしすせそた０１２３４５６７８９abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'())-=^~|[{}]`*:;+,<.>/_";
      postValidateFailTest(done, "/event/update", "eventMemo");
    });

    // eventAddDaysのバリデーションエラー
    test("eventAddDaysのフォーマットエラーによりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.eventAddDays = "2021/01/01 18:00,2021/01/01 19:00";
      postValidateFailTest(done, "/event/update", "eventAddDays");
    });

    test("eventAddDaysの存在しない日付によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.eventAddDays = "2021/13/01 18:00,2021/01/01 19:00";
      postValidateFailTest(done, "/event/update", "eventAddDays");
    });

    test("eventAddDaysの未定義によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      delete event.eventAddDays;
      postValidateFailTest(done, "/event/update", "eventAddDays");
    });

    // eventDelDaysのバリデーションエラー
    test("eventDelDaysのフォーマットエラーによりバリデーションに失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "abcdefg";
      postValidateFailTest(done, "/event/update", "eventDelDays");
    });

    test("eventDelDaysの未定義によりバリデーションに失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      postValidateFailTest(done, "/event/update", "eventDelDays");
    });


    // storeIdのバリデーションエラー
    test("storeIdの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeId = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeId");
    });

    // storeLatitudeのバリデーションエラー
    test("storeLatitudeの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeLatitude = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeLatitude");
    });

    // storeLongitudeのバリデーションエラー
    test("storeLongitudeの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeLongitude = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeLongitude");
    });

    // storeNameのバリデーションエラー
    test("storeNameの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeName = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeName");
    });

    // storeAddressのバリデーションエラー
    test("storeAddressの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeAddress = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeAddress");
    });

    // storeUrlのバリデーションエラー
    test("storeUrlの文字数超過によりバリデーションが失敗する", (done) => {
      event.id = event_id;
      event.rev = event_rev;
      event.eventDelDays = "day0,day1";
      event.storeUrl = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      postValidateFailTest(done, "/event/update", "storeUrl");
    });

    // id空による更新失敗
    test("idが空のため、dbの更新に失敗する", (done) => {
      let data = {
        id: "",
        rev: event_rev,
        eventName: "忘年会",
        eventMemo: "ぼうねんかいです",
        eventAddDays: "2021-12-31 18:00,2021-12-31 21:00",
        eventDelDays: "day0,day1",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
      request(app).post("/event/update")
      .send(data)
      .expect(422)
      .expect((res) => {
        let ret = {
          ok: false,
          type: "record update error",
          errors: [{msg: "Empty id"}]
        }
        expect(res.body).toEqual(ret);
      })
      .end((err, res) => {
        if (err) {
          console.log(res);
          return done(err);
        }
        else  done();
      });
    });

    // db更新時にエラー
    test("dbのイベント更新時にエラーが発生する", (done) => {

      let model = require("../model/couchdb.js");
      let spy = jest.spyOn(model.DB.prototype, "updateOneRecord").mockImplementation((data, param) => {
        throw new Error("db update error.");
      });

      let data = {
        id: event_id,
        rev: event_rev,
        eventName: "忘年会",
        eventMemo: "ぼうねんかいです",
        eventAddDays: "2021-12-31 18:00,2021-12-31 21:00",
        eventDelDays: "day0,day1",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
      request(app).post("/event/update")
      .send(data)
      .expect(422)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record update error");
      })
      .end((err, res) => {
        spy.mockRestore();
        if (err) {
          //console.log(res);
          done(err);
        }
        else  done();
      });
    });

    // dbのイベント更新に成功する
    test("dbのイベント更新に成功する", async () => {

      // メンバーを追加1
      let data = {
        id: event_id,
        memberName: "Duo",
        memberComment: "wryyyy",
        day0: "OK",
        day1: "OK"
      };
      let response = await request(app).post("/member/create")
      .send(data)
      .expect(200);

      // メンバーを追加2
      data = {
        id: event_id,
        memberName: "Johtaro",
        memberComment: "oraoraora",
        day0: "NG",
        day1: "UnKnown"
      };
      response = await request(app).post("/member/create")
      .send(data)
      .expect(200)
      .expect((res) => {
        event_id = res.body.id;
        event_rev = res.body.rev;
      });
      
      // イベント更新処理
      data = {
        id: event_id,
        rev: event_rev,
        eventName: "忘年会",
        eventMemo: "ぼうねんかいです",
        eventAddDays: "2021-12-31 18:00,2021-12-31 21:00",
        eventDelDays: "day0",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
      response = await request(app).post("/event/update")
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
        event_id = res.body.id;
        event_rev = res.body.rev;
      });

      // 更新確認
      data = {id: event_id};
      response = await request(app).get("/event/get")
      .query(data)
      .expect(200)
      .expect((res) => {
        let ret_event = {
          ok: true,
          id: event_id,
          rev: event_rev,
          eventName: "忘年会",
          eventMemo: "ぼうねんかいです",
          eventDays: {
            day1: "2021-01-01 21:00",
            day2: "2021-12-31 18:00",
            day3: "2021-12-31 21:00"
          },
          eventMembers: {
            member0: {
              memberName: "Duo",
              memberComment: "wryyyy",
              memberDays: {
                day1: "OK",
                day2: "None",
                day3: "None"
              }
            },
            member1: {
              memberName: "Johtaro",
              memberComment: "oraoraora",
              memberDays: {
                day1: "UnKnown",
                day2: "None",
                day3: "None"
              }
            }
          },
          storeId: "1234567890",
          storeLatitude: "23.12",
          storeLongitude: "135.12",
          storeName: "鳥貴族",
          storeAddress: "東京都新宿区東口",
          storeUrl: "http://sp.torikizoku.co.jp"
        };
        expect(res.body).toEqual(ret_event);
      });

    });

    test("dbのイベント追加日、削除日なしにイベント更新に成功する", async () => {

      // メンバー1人いる状態,
      // メンバーいる状態で、日付追加がスキップされるルートを通すため
      let data = {
        id: event_id,
        memberName: "佐藤",
        memberComment: "さとう",
      };
      let response = await request(app).post("/member/create").send(data);
      expect(response.body.ok).toBe(true);
      event_id = response.body.id;
      event_rev = response.body.rev;

      // イベント更新処理
      data = {
        id: event_id,
        rev: event_rev,
        eventName: "忘年会",
        eventMemo: "ぼうねんかいです",
        eventAddDays: "",
        eventDelDays: "",
        storeId: "1234567890",
        storeLatitude: "23.12",
        storeLongitude: "135.12",
        storeName: "鳥貴族",
        storeAddress: "東京都新宿区東口",
        storeUrl: "http://sp.torikizoku.co.jp"
      };
      response = await request(app).post("/event/update")
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
        event_id = res.body.id;
        event_rev = res.body.rev;
      });

      // 更新確認
      data = {id: event_id};
      response = await request(app).get("/event/get")
      .query(data)
      .expect(200)
      .expect((res) => {
        let ret_event = {
          ok: true,
          id: event_id,
          rev: event_rev,
          eventName: "忘年会",
          eventMemo: "ぼうねんかいです",
          eventDays: {
            day0: "2021-01-01 18:00",
            day1: "2021-01-01 21:00",
          },
          eventMembers: {
            member0: {
              memberName: "佐藤",
              memberComment: "さとう",
              memberDays: {
                day0: "None",
                day1: "None"
              }
            }
          },
          storeId: "1234567890",
          storeLatitude: "23.12",
          storeLongitude: "135.12",
          storeName: "鳥貴族",
          storeAddress: "東京都新宿区東口",
          storeUrl: "http://sp.torikizoku.co.jp"
        };
        expect(res.body).toEqual(ret_event);
      });

    });
    
  });

});