var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
var model = null;
if (config.get("env.db_type") === "cloudant") {
  model = require('../model/cloudant.js');
} else {
  model = require('../model/couchdb.js');
}
var eventValidator = require('../validator/event_validator.js');

// イベント生成
router.post('/create', [
  check('eventName').isLength({max: config.get('event.eventNameMaxLength')}),
  check('eventMemo').isLength({max: config.get('event.eventMemoMaxLength')}),
  check('eventAddDays').custom(eventValidator.validateEventAddDays),
  check('storeId').isLength({max: config.get('event.storeIdMaxLength')}),
  check('storeLatitude').isLength({max: config.get('event.storeLatitudeMaxLength')}),
  check('storeLongitude').isLength({max: config.get('event.storeLongitudeMaxLength')}),
  check('storeName').isLength({max: config.get('event.storeNameMaxLength')}),
  check('storeAddress').isLength({max: config.get('event.storeAddressMaxLength')}),
  check('storeUrl').isLength({max: config.get('event.storeUrlMaxLength')})
], async function (req, res, next) {
  try {
    // validation評価
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let ret = {
        ok: false,
        type: config.get("common.error.validation"),
        errors: errors.array()
      };
      return res.status(422).json(ret);
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

    let db = new model.DB();
    await db.init('paon');
    let body = await db.insertOneRecord(data);
    res.send(body);

  } catch (err) {
    console.log(err);
    let ret = {
      ok: false,
      type: config.get('common.error.createRecord'),
      errors: [{msg:err.message}]
    };
    res.status(422).json(ret);
  }

});

// イベント更新
router.post('/update', [
  check('id').isLength({max: config.get('event.eventIdMaxLength')}),
  check('rev').isLength({max: config.get('event.eventRevMaxLength')}),
  check('eventName').isLength({max: config.get('event.eventNameMaxLength')}),
  check('eventMemo').isLength({max: config.get('event.eventMemoMaxLength')}),
  check('eventAddDays').custom(eventValidator.validateEventAddDays),
  check('eventDelDays').custom(eventValidator.validateEventDelDays),
  check('storeId').isLength({max: config.get('event.storeIdMaxLength')}),
  check('storeLatitude').isLength({max: config.get('event.storeLatitudeMaxLength')}),
  check('storeLongitude').isLength({max: config.get('event.storeLongitudeMaxLength')}),
  check('storeName').isLength({max: config.get('event.storeNameMaxLength')}),
  check('storeAddress').isLength({max: config.get('event.storeAddressMaxLength')}),
  check('storeUrl').isLength({max: config.get('event.storeUrlMaxLength')})
], async function (req, res, next) {
  try {
    // validation評価
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let ret = {
        ok: false,
        type: config.get("common.error.validation"),
        errors: errors.array()
      };
      return res.status(422).json(ret);
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
    let db = new model.DB();
    await db.init('paon');

    let currentEvent = await db.getOneRecord(_id);
    if (currentEvent === void 0) {
      let ret = {
        ok: false,
        type: config.get('common.error.updateRecord'),
        errors: [{'msg': 'Empty id'}]
      };
      return res.status(422).json(ret);
    }

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
      let curN = parseInt(dayN.replace('day', ''));
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
        if (eventDateList[i] == '') {
          continue;
        }
        memberDays['day' + String(i + maxN)] = config.get("member.candidate.None");
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

  } catch (err) {
    console.log(err);
    let ret = {
      ok: false,
      type: config.get('common.error.updateRecord'),
      errors: [{msg:err.message}]
    };
    res.status(422).json(ret);
  }
});

// イベント参照
router.get('/get', [
  check('id').isLength({max: config.get('event.eventIdMaxLength')}),
], async function (req, res, next) {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let ret = {
        ok: false,
        type: config.get("common.error.validation"),
        errors: errors.array()
      };
      return res.status(422).json(ret);
    }

    let id = req.query.id;

    let db = new model.DB();
    await db.init('paon');
    let currentEvent = await db.getOneRecord(id);
    if (currentEvent === void 0) {
      let ret = {
        ok: false,
        type: config.get('common.error.referRecord'),
        errors: [{'msg': 'Empty id'}]
      };
      return res.status(422).json(ret);
    }
    
    currentEvent["ok"] = true;
    currentEvent["id"] = currentEvent._id;
    currentEvent["rev"] = currentEvent._rev;
    delete currentEvent._id;
    delete currentEvent._rev;

    res.send(currentEvent);

  } catch (err) {
    console.log(err);
    let ret = {
      ok: false,
      type: config.get('common.error.referRecord'),
      errors: [{msg:err.message}]
    };
    // dbから取得できない場合は、422にしない。現状レコードがないものとして扱う。
    // errorのmsg見て、deletedのときのみview側でキャッシュ削除したほうがよいかも
    res.send(ret);
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
      let ret = {
        ok: false,
        type: config.get("common.error.validation"),
        errors: errors.array()
      };
      return res.status(422).json(ret);
    }

    let _id = req.body.id;
    let _rev = req.body.rev;

    let db = new model.DB();
    await db.init('paon');

    let body = await db.deleteOneRecord(_id, _rev);
    res.send(body);
    
  } catch (err) {
    let msg = (err.message === void 0) ? err : err.message;
    let ret = {
      ok: false,
      type: config.get('common.error.deleteRecord'),
      errors: [{msg:msg}]
    };
    return res.status(422).json(ret);
  }
});





module.exports = router;
