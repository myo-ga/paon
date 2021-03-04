const request = require("supertest");
const app = require("../app");
var member = {};

describe("Integration Test", () => {

  function postValidateFailTest(done, uri, field) {
    request(app).post(uri)
    .send(member)
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

  describe("POST /member/create", () => {
    var event_id = "";
    var event_rev = "";

    beforeAll(async () => {
      try {
        let data = {
          eventName: "飲み会",
          eventMemo: "のみましょう",
          eventAddDays: "2021-01-01 18:00,2021-01-01 21:00,2021-01-02 20:00,2021-01-03 19:00",
          storeId: "1234567890",
          storeLatitude: "23.12",
          storeLongitude: "135.12",
          storeName: "鳥貴族",
          storeAddress: "東京都新宿区東口",
          storeUrl: "http://sp.torikizoku.co.jp"
        };
        let response = await request(app).post("/event/create").send(data);
        if (response.body.ok === false) {
          throw new Error("response ok failed.");
        }
        event_id = response.body.id;
        event_rev = response.body.rev;
      } catch (err) {
        console.log(err);
      }
    });

    afterAll(async () => {
      try {
        let data = {
          id: event_id
        };
        let response = await request(app).get("/event/get").query(data);
        data = {
          id: response.body.id,
          rev: response.body.rev
        };
        response = await request(app).post("/event/delete").send(data);
        if (response.body.ok === false) {
          throw new Error("response ok failed.");
        }
      } catch (err) {
        console.log(err);
      }
    });

    beforeEach(() => {
      member = {
        id: "12345",
        memberName: "田中",
        memberComment: "たなか",
        day0: "OK",
        day1: "NG",
        day2: "UnKnown",
        day3: "None"
      };
    })

    test("idの文字数超過でバリデーションに失敗する", (done) => {
      let id = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      member.id = id;
      postValidateFailTest(done, "/member/create", "id");
    });

    test("memberNameの文字数超過でバリデーションに失敗する", (done) => {
      let memberName = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      member.memberName = memberName;
      postValidateFailTest(done, "/member/create", "memberName");
    });

    test("memberCommentの文字数超過でバリデーションに失敗する", (done) => {
      let memberComment = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
      member.memberComment = memberComment;
      postValidateFailTest(done, "/member/create", "memberComment");
    });

    test("idが空のためdbのイベントレコード取得に失敗する", (done) => {
      member.id = "";
      request(app).post("/member/create")
      .send(member)
      .expect(422)
      .expect((res) => {
        let ret = {
          ok: false,
          type: "record create error",
          errors: [{msg: "Empty id"}]
        };
        expect(res.body).toEqual(ret);
      })
      .end((err, res) => {
        if (err) {
          console.log(res.body);
          done(err);
        }
        done();
      });
    });

    test("dayNでOK/NG/UnKnown/None以外の値のため、dayNの設定がスキップされる", async () => {
      member = {
        id: event_id,
        memberName: "田中",
        memberComment: "たなか",
        day0: "OK", // 正常
        daa1: "NG", // 異常、スキップ
        dab2: "UnKnown",  // 異常、スキップ
        dac3: "None", // 異常、スキップ
        day3: "OK" // 正常
      };
      let response = await request(app).post("/member/create").send(member);
      expect(response.body.ok).toBe(true);

      let event = {id: event_id};
      response = await request(app).get("/event/get").query(event);
      
      let ret = {
        memberName: "田中",
        memberComment: "たなか",
        memberDays: {
          day0: "OK",
          day1: "None", // Noneのまま
          day2: "None", // Noneのまま
          day3: "OK"
        }
      }
      expect(response.body.ok).toBe(true);
      expect(response.body.eventMembers.member0).toEqual(ret);

      // 後処理：追加されたメンバー削除
      let data = {
        id: event_id,
        memberId: "member0"
      };
      response = await request(app).post("/member/delete").send(data);
      expect(response.res.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);

    });

    test("dbのイベントレコード更新中に処理に失敗する", (done) => {

      let model = require("../model/couchdb.js");
      let spy = jest.spyOn(model.DB.prototype, "updateOneRecord").mockImplementation((currentEvent) => {
        throw new Error("member update error.");
      });

      let data = {
        id: event_id,
        memberName: "田中",
        memberComment: "たなか",
        day0: "OK"
      };
      request(app).post("/member/create")
      .send(data)
      .expect(422)
      .expect((res) => {
        expect(res.body.ok).toBe(false);
        expect(res.body.type).toBe("record update error");
      })
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

    test("dbのイベントレコード更新に成功する(OK/NG/Unknown/None)", async () => {
      // メンバー追加
      member = {
        id: event_id,
        memberName: "田中",
        memberComment: "たなか",
        day0: "OK",
        day1: "NG",
        day2: "UnKnown",
        day3: "None",
      };
      let response = await request(app).post("/member/create").send(member);
      expect(response.body.ok).toBe(true);

      // 追加したメンバーチェック
      let event = {id: event_id};
      response = await request(app).get("/event/get").query(event);
      let ret_correct= {
        memberName: "田中",
        memberComment: "たなか",
        memberDays: {
          day0: "OK",
          day1: "NG",
          day2: "UnKnown",
          day3: "None"
        }
      }
      expect(response.res.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.eventMembers.member0).toEqual(ret_correct);

      // 後処理：追加されたメンバー削除
      let data = {
        id: event_id,
        memberId: "member0"
      };
      response = await request(app).post("/member/delete").send(data);
      expect(response.res.statusCode).toBe(200);
      expect(response.body.ok).toBe(true);
    });


  });


  describe("POST /member/update", () => {

  });


  describe("POST /member/delete", () => {

  });
});