const config = require('config');

function validateEventDelDays(value, {req}) {
  let dayPattern = new RegExp(config.get("event.eventDelDaysRegExp"));
  if (value === void 0) {
      throw new Error ('Undefined parameter');
  }
  for (let dayN of value.split(',')) {
    // 空入力対策
    if (dayN == '') {
      continue;
    }
    // yyyy-MM-dd hh:mmのフォーマットチェック
    if (dayN.match(dayPattern) == null) {
      throw new Error('Invalid value');
    }
  }
  return true;
}

// 関数の引数に{}をつける
// 引数分割束縛
// a={num:10}
// f=({num})=>{console.log(num)}
// f(a)で自動的にプロパティnumを引数にとる
function validateEventAddDays(value, {req}) {
    let datePattern = new RegExp(config.get("event.eventAddDaysRegExp"));
   if (value === void 0) {
       throw new Error ('Undefined parameter');
   }
   for (let day of value.split(',')) {
     // 空入力対策
     if (day == '') {
       continue;
     }
     // yyyy-MM-dd hh:mmのフォーマットチェック
     if (day.match(datePattern) == null) {
       throw new Error('Invalid value');
     }
     // 実在する日付かチェック
     let date = new Date(day);
     if (isNaN(date)) {
       throw new Error('Invalid value');
     }
   }
   return true;
}

// キー名、値同一のため、記述省略
module.exports = {
    validateEventAddDays,
    validateEventDelDays,
}