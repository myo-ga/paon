export const state = {
    eventid: '',
    eventrev: '',
    eventname: '',
    comments: '',

    // eventDays = [{date:'2020-12-01', time:'19:00'}, {date: '2020-12-02', time:'18:00'},...]
    eventDays: [],
    dates: [],
    times: [],

    storeId:  '',
    storeLatitude: '',
    storeLongitude: '',
    storeName: '',
    storeAddress: '',
    storeUrl: ''
};

export const mutations = {
    setEventDays(state, val) {
        state.eventDays = val;
    },

    eventid(state,val){state.eventid=val},
    eventrev(state,val){state.eventrev=val},
    eventname(state,val){state.eventname=val},
    comments(state,val){state.comments=val},
    storeId(state,val){state.storeId=val},
    storeLatitude(state,val){state.storeLatitude=val},
    storeLongitude(state,val){state.storeLongitude=val},
    storeName(state,val){state.storeName=val},
    storeAddress(state,val){state.storeAddress=val},
    dates(state,val){state.dates=val.concat();},

    submit(state, payload){
        state.eventid = payload.eventid;
        state.eventname = payload.eventname;
        state.comments = payload.comments;
    },
    updaterev(state, payload){
        state.eventrev = payload.eventrev;
    },
    setDates(state, payload){  
        state.dates = payload.dates;
    },
    setTimes(state, payload){  
        state.times = payload.times;
    },
    storeSelect(state, payload){
        state.storeId = payload.storeId;
        state.storeLatitude = payload.storeLatitude;
        state.storeLongitude = payload.storeLongitude;
        state.storeName = payload.storeName;
        state.storeAddress = payload.storeAddress;
        state.storeUrl = payload.storeUrl;
    },
    update(state, payload){
        state.eventname = payload.eventname;
        state.comments = payload.comments;
        state.dates = payload.dates;
        state.storeId = payload.storeId;
        state.storeLatitude = payload.storeLatitude;
        state.storeLongitude = payload.storeLongitude;
        state.storeName = payload.storeName;
        state.storeAddress = payload.storeAddress;
        state.storeUrl = payload.storeUrl;
    }
};

