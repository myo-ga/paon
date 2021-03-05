const { ExpectationFailed } = require("http-errors");
const { TestScheduler } = require("jest");
const event_validator = require("../validator/event_validator");

describe("Unit Test", () => {

  // day0,day1,...のフォーマットかチェックする
  describe("validateEventDelDays", () => {

    test("チェックする値がundefinedでエラーになる", () => {
      try {
        let arg = {req: null};
        event_validator.validateEventDelDays(undefined, arg);
      } catch (err) {
        expect(err.message).toBe("Undefined parameter");
      }
    });

    test("チェックする値がdayNのフォーマットでなくエラーになる", () => {
      try {
        let arg = {req: null};
        event_validator.validateEventDelDays(",abc,def", arg);
      } catch (err) {
        expect(err.message).toBe("Invalid value");
      }
    })

    test("チェックに成功する", ()=> {
      let arg = {req: null};
      let ret = event_validator.validateEventDelDays("day0,day1,day2", arg);
      expect(ret).toBe(true);
    });
  });

  // yyyy-mm-dd hh:mm,yyyy-mm-dd hh:mm,...のフォーマットかチェックする
  describe("validateEventAddDays", () => {

    test("チェックする値がundefinedでエラーになる", () => {
      try {
        let arg = {req: null};
        event_validator.validateEventAddDays(undefined, arg);
      } catch (err) {
        expect(err.message).toBe("Undefined parameter");
      }
    });

    test("チェックする値がyyyy-mm-dd hh:mm,yyyy-mm-dd hh:mm,..のフォーマットでなくエラーになる", () => {
      try {
        let arg = {req: null};
        event_validator.validateEventAddDays(",abc,def", arg);
      } catch (err) {
        expect(err.message).toBe("Invalid value");
      }
    });

    test("チェックする値が実在しない日付でエラーになる", () => {
      try {
        let arg = {req: null};
        event_validator.validateEventAddDays("2022-99-99 99:99", arg);
      } catch (err) {
        expect(err.message).toBe("Invalid value");
      }
    });   

    test("チェックに成功する", ()=> {
      let arg = {req: null};
      let ret = event_validator.validateEventAddDays("2021-01-01 00:00,2021-12-31 23:59", arg);
      expect(ret).toBe(true);
    });

  });

});


