var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
var cloudant = require('../model/cloudant.js');
var memberValidator = require('../validator/member_validator.js');

router.post('/create', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberName').isLength({max: config.get('member.memberNameMaxLength')}),
    check('memberComment').isLength({max: config.get('member.memberCommentMaxLength')}),
], async function(req, res, next) {

    try {
        let id = req.body.id;
        let memberName = req.body.memberName;
        let memberComment = req.body.memberComment;

        // dbより読み込み、idよりevent照会
        let db = new cloudant.DB();
        db.init('paon');
        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            throw "id is not correct.";
        }

        // eventDaysより日付を取得
        let memberDays = {}
        let eventDays = currentEvent.eventDays;

        // eventDaysのdayNをキーに候補日を設定
        for (dayN in eventDays) {
            memberDays[dayN] = config.get("member.candidate.None");
            if (req.body[dayN] !== void 0 &&
                memberValidator.validateCandidate(req.body[dayN])) {
                // TODO: フォーマット範囲外は例外とするべきか？
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
    
        // 結果をレスポンス
        res.send(body);
    } catch (error) {
        res.send(error);
    }

});


router.post('/update', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberId').isLength({max: config.get('member.memberIdMaxLength')}),
    check('memberName').isLength({max: config.get('member.memberNameMaxLength')}),
    check('memberComment').isLength({max: config.get('member.memberCommentMaxLength')}),
], async function(req, res, next) {

    try {
        let id = req.body.id;
        let memberId = req.body.memberId;
        let memberName = req.body.memberName;
        let memberComment = req.body.memberComment;

        // dbより読み込み、idよりevent照会
        let db = new cloudant.DB();
        db.init('paon');
        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            throw "id is not correct.";
        }

        // メンバーの取得
        let member = currentEvent.eventMembers[memberId];
        // TODO: メンバーが取得できているか確認
        if (member === void 0) {
            throw "memberId is not correct.";
        }

        // 名前とコメント更新
        member.memberName = memberName;
        member.memberComment = memberComment;

        // 候補日を更新
        for (dayN in member.memberDays) {
            if (req.body[dayN] !== void 0 &&
                memberValidator.validateCandidate(req.body[dayN])) {
                // TODO: フォーマット範囲外は例外とするべきか？
                member.memberDays[dayN] = req.body[dayN];
            }
        }

        // memberはcurrentEventより参照渡しされているので代入の必要なし

        // dbに書き込み
        let body = await db.updateOneRecord(currentEvent);
    
        // 結果をreturn
        res.send(body);
    } catch (error) {
        res.send(error);
    }
});


router.post('/delete', [
    check('id').isLength({max: config.get('event.eventIdMaxLength')}),
    check('memberId').isLength({max: config.get('member.memberIdMaxLength')})
], async function(req, res, next) {

    try {
        let id = req.body.id;
        let memberId = req.body.memberId;

        // dbより読み込み、idよりevent照会
        let db = new cloudant.DB();
        db.init('paon');
        let currentEvent = await db.getOneRecord(id);
        if (currentEvent === void 0) {
            throw "id is not correct.";
        }
        
        // メンバーの取得
        let member = currentEvent.eventMembers[memberId];
        if (member === void 0) {
            throw "memberId is not correct.";
        }

        // メンバー削除
        delete currentEvent.eventMembers[memberId];

        // dbに書き込み
        let body = await db.updateOneRecord(currentEvent);
    
        // 結果をreturn
        res.send(body);
    } catch (error) {
        res.send(error);
    }
    return true;
});


module.exports = router;