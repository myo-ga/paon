var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
var cloudant = require('../model/cloudant.js');
var event_validator = require('../validator/event_validator.js');
//var JSONFormatter = require('json-formatter-js');

// イベント生成
router.post('/create', [
  check('eventName').isLength({max: config.get('event.eventNameMaxLength')}),
  check('eventMemo').isLength({max: config.get('event.eventMemoMaxLength')}),
  check('eventAddDays').custom(event_validator.validateEventAddDays),
  check('storeId').isLength({max: config.get('event.storeIdMaxLength')}),
  check('storeLatitude').custom(event_validator.validateStoreLatitude),
  check('storeLongitude').custom(event_validator.validateStoreLongitude),
  check('storeName').isLength({max: config.get('event.storeNameMaxLength')}),
  check('storeAddress').isLength({max: config.get('event.storeAddressMaxLength')}),
  check('storeUrl').isLength({max: config.get('event.storeUrlMaxLength')})
], async function (req, res, next) {
  try {
    // validation評価
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let eventName = req.body.eventName;
    let eventMemo = req.body.eventMemo;
    let eventAddDays = req.body.eventAddDays;
    let eventMembers = {};
    let storeId = req.body.storeId;
    let storeLatitude = req.body.storeLatitude;
    let storeLongitude = req.body.storeLongitude;
    let storeName = req.body.storeName;
    let storeAddress = req.body.storeAddress;
    let storeUrl = req.body.storeUrl;

    // 日付のパース
    let eventDateList = eventAddDays.split(',');
    let eventDays = {};
    for (let i = 0; i < eventDateList.length; i++) {
      // 入力がない場合
      if (eventDateList[i] == '') {
        continue;
      }
      eventDays['day' + String(i)] = eventDateList[i];
    }

    // key名とvalue同じため、value省略
    let data = {
      eventName,
      eventMemo,
      eventDays,
      eventMembers,
      storeId,
      storeLatitude,
      storeLongitude,
      storeName,
      storeAddress,
      storeUrl
    };

    let db = new cloudant.DB();
    db.init('paon');
    let body = await db.insertOneRecord(data);
    res.send(body);

  } catch (err) {
    res.send(err);
  }

});

// イベント更新
router.post('/update', [
  check('id').isLength({max: config.get('event.eventIdMaxLength')}),
  check('rev').isLength({max: config.get('event.eventRevMaxLength')}),
  check('eventName').isLength({max: config.get('event.eventNameMaxLength')}),
  check('eventMemo').isLength({max: config.get('event.eventMemoMaxLength')}),
  check('eventAddDays').custom(event_validator.validateEventAddDays),
  check('eventDelDays').custom(event_validator.validateEventDelDays),
  check('storeId').isLength({max: config.get('event.storeIdMaxLength')}),
  check('storeLatitude').custom(event_validator.validateStoreLatitude),
  check('storeLongitude').custom(event_validator.validateStoreLongitude),
  check('storeName').isLength({max: config.get('event.storeNameMaxLength')}),
  check('storeAddress').isLength({max: config.get('event.storeAddressMaxLength')}),
  check('storeUrl').isLength({max: config.get('event.storeUrlMaxLength')})
], async function (req, res, next) {
  try {
    // validation評価
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    let _id = req.body.id;
    let _rev = req.body.rev;
    let eventName = req.body.eventName;
    let eventMemo = req.body.eventMemo;
    let eventAddDays = req.body.eventAddDays;
    let eventDelDays = req.body.eventDelDays;
    let eventMembers = {};
    let storeId = req.body.storeId;
    let storeLatitude = req.body.storeLatitude;
    let storeLongitude = req.body.storeLongitude;
    let storeName = req.body.storeName;
    let storeAddress = req.body.storeAddress;
    let storeUrl = req.body.storeUrl;

    // _id, _revよりメンバーを取得する
    let db = new cloudant.DB();
    db.init('paon');
    let currentEvent = await db.getOneRecord(_id);
    // TODO: idが正しくなく、currentEvent==undefinedの場合の処理

    // deleteEventDays();

    // addEventDays();

    // eventDaysより削除
    let tmpEventDays = {};
    let eventDelList = eventDelDays.split(",");
    for (let dayN in currentEvent.eventDays) {
      if (eventDelList.indexOf(dayN) >= 0) {
        continue;
      }
      tmpEventDays[dayN] = currentEvent.eventDays[dayN];
    }
    currentEvent.eventDays = tmpEventDays;

    // memberNより削除
    eventMembers = currentEvent.eventMembers;
    for (let memberN in currentEvent.eventMembers) {
      let memberDays = currentEvent.eventMembers[memberN].memberDays;
      let tmpMemberDays = {};
      for (let dayN in memberDays) {
        if (eventDelList.indexOf(dayN) >= 0) {
          continue;
        }
        tmpMemberDays[dayN] = memberDays[dayN];
      }
      currentEvent.eventMembers[memberN].memberDays = tmpMemberDays;
    }

    // 最大のdayN算出
    let maxN = -1;
    for (let dayN in currentEvent.eventDays) {
      let curN = parseInt(dayN.replace("day", ""));
      maxN = Math.max(maxN, curN)
    }
    maxN += 1;

    // 日付の追加
    let eventDateList = eventAddDays.split(',');
    for (let i = 0; i < eventDateList.length; i++) {
      // 入力がない場合
      if (eventDateList[i] == '') {
        continue;
      }
      currentEvent.eventDays['day' + String(i + maxN)] = eventDateList[i];
    }

    // evnetMenberに日付を追加
    eventMembers = currentEvent.eventMembers;
    for (let memberN in currentEvent.eventMembers) {
      let memberDays = currentEvent.eventMembers[memberN].memberDays;
      for (let i = 0; i < eventDateList.length; i++) {
        memberDays['day' + String(i + maxN)] = 0;
      }
    }

    // key名とvalue同じため、value省略
    let data = {
      _id,
      _rev,
      eventName,
      eventMemo,
      eventDays: currentEvent.eventDays,
      eventMembers,
      storeId,
      storeLatitude,
      storeLongitude,
      storeName,
      storeAddress,
      storeUrl
    };

    let body = await db.updateOneRecord(data);
    res.send(body);

  } catch (error) {
    res.send(error);
  }
});

// イベント参照
router.get('/get', [
  check('id').isLength({max: config.get('event.eventIdMaxLength')}),
], async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let id = req.query.id;
  
    let db = new cloudant.DB();
    db.init('paon');
    let body = await db.getOneRecord(id);
    body["id"] = body._id;
    body["rev"] = body._rev;
    delete body._id;
    delete body._rev;
    res.send(body);

  } catch (err) {
    res.send(err);
  }
});

// イベント削除
router.post('/delete', [
  check('id').isLength({max: config.get('event.eventIdMaxLength')}),
  check('rev').isLength({max: config.get('event.eventRevMaxLength')})
], async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let _id = req.body.id;
    let _rev = req.body.rev;

    let db = new cloudant.DB();
    db.init('paon');
    let body = await db.deleteOneRecord(_id, _rev);
    res.send(body);
    
  } catch (err) {
    res.send(err);
  }
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
router.get('/', async function(req, res, next) {
  try {
    let db = new cloudant.DB();
    db.init('paon');
    let all_record = await db.getAllRecord();
    let id_list = [];
    for (let record of all_record.rows) {
      id_list.push(record['id']);
    }
    // configはconfigオブジェクトであるが、renderに渡したときには
    // JSONオブジェクト（Object型）に変換される模様
    res.render('debug', {const_value: config, id_list: id_list});
  } catch (err) {

  }


});

module.exports = router;
