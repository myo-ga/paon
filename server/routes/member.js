var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
var model = require('../model/couchdb.js');
var memberValidator = require('../validator/member_validator.js');

router.post('/create', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberName').isLength({max: config.get('member.memberNameMaxLength')}),
    check('memberComment').isLength({max: config.get('member.memberCommentMaxLength')}),
], async function(req, res, next) {

    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let ret = {
              ok: false,
              type: config.get("common.error.validation"),
              errors: errors.array()
            };
            return res.status(422).json(ret);
        }

        let id = req.body.id;
        let memberName = req.body.memberName;
        let memberComment = req.body.memberComment;

        // dbより読み込み、idよりevent照会
        let db = new model.DB();
        await db.init('paon');

        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            let ret = {
                ok: false,
                type: config.get('common.error.createRecord'),
                errors: [{'msg': 'Empty id'}]
            };
            return res.status(422).json(ret);
        }

        // eventDaysより日付を取得
        let memberDays = {}
        let eventDays = currentEvent.eventDays;

        // eventDaysのdayNをキーに候補日を設定
        for (dayN in eventDays) {
            memberDays[dayN] = config.get("member.candidate.None");
            if (req.body[dayN] !== void 0 &&
                memberValidator.validateCandidate(req.body[dayN])) {
                memberDays[dayN] = req.body[dayN];
            }
        }

        // memberNの最大値を取得
        let maxN = -1;
        for (memberN in currentEvent.eventMembers) {
            let curN = parseInt(memberN.replace("member", ""));
            maxN = Math.max(maxN, curN)
        }
        maxN += 1;

        // memberを作成
        let member = {
            memberName,
            memberComment,
            memberDays
        };
        currentEvent.eventMembers['member' + String(maxN)] = member;

        // dbに書き込み
        let body = await db.updateOneRecord(currentEvent);
        res.send(body);

    } catch (err) {
        console.log(err);
        let ret = {
          ok: false,
          type: config.get('common.error.createRecord'),
          errors: [{msg:err.message}]
        };
        res.send(ret);
    }

});


router.post('/update', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberId').isLength({max: config.get('member.memberIdMaxLength')}),
    check('memberName').isLength({max: config.get('member.memberNameMaxLength')}),
    check('memberComment').isLength({max: config.get('member.memberCommentMaxLength')}),
], async function(req, res, next) {

    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let ret = {
              ok: false,
              type: config.get("common.error.validation"),
              errors: errors.array()
            };
            return res.status(422).json(ret);
        }

        let id = req.body.id;
        let memberId = req.body.memberId;
        let memberName = req.body.memberName;
        let memberComment = req.body.memberComment;

        // dbより読み込み、idよりevent照会
        let db = new model.DB();
        await db.init('paon');

        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            let ret = {
                ok: false,
                type: config.get('common.error.updateRecord'),
                errors: [{'msg': 'Empty id'}]
            };
            return res.status(422).json(ret);
        }

        // メンバーの取得
        let member = currentEvent.eventMembers[memberId];
        if (member === void 0) {
            let ret = {
                ok: false,
                type: config.get('common.error.updateRecord'),
                errors: [{'msg': 'memberId does not exist'}]
            };
            return res.status(422).json(ret);
        }

        // 名前とコメント更新
        member.memberName = memberName;
        member.memberComment = memberComment;

        // 候補日を更新
        for (dayN in member.memberDays) {
            if (req.body[dayN] !== void 0 &&
                memberValidator.validateCandidate(req.body[dayN])) {
                member.memberDays[dayN] = req.body[dayN];
            }
        }

        // memberはcurrentEventより参照渡しされているので代入の必要なし

        // dbに書き込み
        let body = await db.updateOneRecord(currentEvent);
        res.send(body);

    } catch (err) {
        console.log(err);
        let ret = {
          ok: false,
          type: config.get('common.error.updateRecord'),
          errors: [{msg:err.message}]
        };
        res.send(ret);
    }
});


router.post('/delete', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberId').isLength({max: config.get('member.memberIdMaxLength')})
], async function(req, res, next) {

    try {

        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let ret = {
              ok: false,
              type: config.get("common.error.validation"),
              errors: errors.array()
            };
            return res.status(422).json(ret);
        }

        let id = req.body.id;
        let memberId = req.body.memberId;

        // dbより読み込み、idよりevent照会
        let db = new model.DB();
        await db.init('paon');

        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            let ret = {
                ok: false,
                type: config.get('common.error.deleteRecord'),
                errors: [{'msg': 'Empty id'}]
            };
            return res.status(422).json(ret);
        }
        
        // メンバーの取得
        let member = currentEvent.eventMembers[memberId];
        if (member === void 0) {
            let ret = {
                ok: false,
                type: config.get('common.error.deleteRecord'),
                errors: [{'msg': 'memberId does not exist'}]
            };
            return res.status(422).json(ret);
        }

        // メンバー削除
        delete currentEvent.eventMembers[memberId];

        // dbに書き込み
        let body = await db.updateOneRecord(currentEvent);
        res.send(body);

    } catch (err) {
        console.log(err);
        let ret = {
          ok: false,
          type: config.get('common.error.deleteRecord'),
          errors: [{msg:err.message}]
        };
        res.send(ret);
    }
    return true;
});


module.exports = router;