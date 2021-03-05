const { ExpectationFailed } = require("http-errors");
const { TestScheduler } = require("jest");
const member_validator = require("../validator/member_validator");

describe("Unit Test", () => {

  describe("validateCandidate", () => {

    test("OK/NG/UnKnown/Noneの入力でチェックが成功する", () => {
      let ret = member_validator.validateCandidate("OK");
      expect(ret).toBe(true);
      ret = member_validator.validateCandidate("NG");
      expect(ret).toBe(true);
      ret = member_validator.validateCandidate("UnKnown");
      expect(ret).toBe(true);
      ret = member_validator.validateCandidate("None");
      expect(ret).toBe(true);
    });

    test("OK/NG/UnKnown/None以外の入力でチェックが失敗する", () => {
      let ret = member_validator.validateCandidate("abc");
      expect(ret).toBe(false);
    });

  });

});