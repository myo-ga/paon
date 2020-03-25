const config = require('config');

function validateEventDelDays(value, {req}) {
  let dayPattern = new RegExp(config.get("event.eventDelDaysRegExp"));
  if (value === void 0) {
      throw new Error ('Parameter is undefined.');
  }
  for (let dayN of value.split(',')) {
    // 空入力対策
    if (dayN == '') {
      continue;
    }
    // yyyy-MM-dd hh:mmのフォーマットチェック
    if (dayN.match(dayPattern) == null) {
      throw new Error('Day format is invalid.');
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
       throw new Error ('Parameter is undefined.');
   }
   for (let day of value.split(',')) {
     // 空入力対策
     if (day == '') {
       continue;
     }
     // yyyy-MM-dd hh:mmのフォーマットチェック
     if (day.match(datePattern) == null) {
       throw new Error('Date format is invalid.');
     }
     // 実在する日付かチェック
     let date = new Date(day);
     if (isNaN(date)) {
       throw new Error('Date is not existed.');
     }
   }
   return true;
}

// sotre latitude and longitude
function validateStoreLL(dataPattern, errorMessage) {
    let re = new RegExp(dataPattern);
    return (value, {req}) => {
        if (value.match(re) == null) {
            throw new Error(errorMessage);
        }
        return true;
    };
}


// キー名、値同一のため、記述省略
module.exports = {
    validateEventAddDays,
    validateEventDelDays,
    validateStoreLatitude: 
        validateStoreLL(config.get("event.storeLatitudeRegExp"), 'Store Latitude is invalid.'),
    validateStoreLongitude:
        validateStoreLL(config.get("event.storeLongitudeRegExp"), 'Store Longitude is invalid.')
}