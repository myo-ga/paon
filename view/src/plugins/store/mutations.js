export const state = {
    count: 0,
    eventid: "",
    eventname: "",
    comments: "",
    dates: [],

    storeId:  "",                       //テスト:店のID固定
    storeLatitude: "",            //テスト:店の緯度固定
    storeLongitude: "",           //テスト:店の経度固定
    storeName: "",                      //テスト:店名固定
    storeAddress: "",                   //テスト:店の住所固定
    storeUrl: ""                        //テスト:店のURL固定
};

export const mutations = {
    increment (state) {
      state.count++
    },
    submit(state, payload){
        state.eventid = payload.eventid
        state.eventname = payload.eventname;
        state.comments = payload.comments;
        state.dates = payload.dates;
    },
    storeSelect(state, payload){
        state.storeId = payload.storeId
        state.storeLatitude = payload.storeLatitude
        state.storeLongitude = payload.storeLongitude
        state.storeName = payload.storeName
        state.storeAddress = payload.storeAddress
        state.storeUrl = payload.storeUrl
    },
};