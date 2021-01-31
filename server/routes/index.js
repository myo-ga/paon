var express = require('express');
var router = express.Router();
var model = require('../model/couchdb.js');
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/debug', async function(req, res, next) {
  try {
    let db = new model.DB();
    db.init('paon');
    let all_record = await db.getAllRecord();
    let id_list = [];
    for (let record of all_record.rows) {
      id_list.push(record['id']);
    }
    // configはconfigオブジェクトであるが、renderに渡したときには
    // JSONオブジェクト（Object型）に変換される模様. id_listもArrayからObjectに変換される
    res.render('debug', {const_value: config, id_list: id_list});
  } catch (err) {
    res.send(err);
  }
});

router.get('/debug/getall', async function(req, res, next) {
  try {
    let db = new model.DB();
    db.init('paon');
    let all_record = await db.getAllRecord();
    let id_list = [];
    for (let record of all_record.rows) {
      id_list.push({id:record['id']});
    }
    res.send(id_list);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
