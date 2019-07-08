var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var cloudant = require('../model/cloudant.js');

// イベント生成
// ・イベント名
// ・メモ
// ・候補日程（複数）
router.post('/create', [
  // TODO: validation実装
], function (req, res, next) {
    let eventName = req.body.eventName;
    let eventMemo = req.body.eventMemo;
    let eventDays = req.body.eventDays;

    // TODO: validation評価
    // let errors = validationResult(req);
    // console.log(errors);

    // key名とvalue同じため、value省略
    let data = {
      eventName,
      eventMemo,
      eventDays,
    };

    let db = new cloudant.DB();
    db.init('paon');

    db.insertOneRecord(data).then((body) => {
      res.send(body);
    }).catch((err) => {
      res.send(err);
    })
});

// イベント更新
// ・イベントID
// ・イベント名
// ・メモ
// ・候補日程（複数）
router.post('/update', [
  // TODO: validation実装
  ], function (req, res, next) {
  // TODO: validation評価
  
  let _id = req.body.id;
  let _rev = req.body.rev;
  let eventName = req.body.eventName;
  let eventMemo = req.body.eventMemo;
  let eventDays = req.body.eventDays;

  let data = {
    _id,
    _rev,
    eventName,
    eventMemo,
    eventDays
  };

  let db = new cloudant.DB();
  db.init('paon');

  db.updateOneRecord(data).then((body) => {
    res.send(body);
  }).catch((err) => {
    res.send(err);
  })

});

// イベント参照
// ・イベントID
router.get('/get', [
    // TODO: validation実装
  ], function (req, res, next) {
  
  // TODO: validation評価

  let id = req.query.id;

  let db = new cloudant.DB();
  db.init('paon');

  db.getOneRecord(id).then((body) => {
    res.send(body);
  }).catch((err) => {
    res.send(err);
  });

});

// 参加追加
// ・イベントID
// ・名前
// ・候補日程（複数、それに対して、丸罰）
// ・コメント

// 参加更新
// ・参加ID
// ・名前
// ・候補日程（複数、それに対して、丸罰）
// ・コメント

// 参加削除
// ・参加ID


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('debug')
});

module.exports = router;
