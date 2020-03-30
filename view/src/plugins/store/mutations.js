export const state = {
    eventid: '',
    eventrev: '',
    eventname: '',
    comments: '',
    dates: [],

    storeId:  '',
    storeLatitude: '',
    storeLongitude: '',
    storeName: '',
    storeAddress: '',
    storeUrl: ''
};

export const mutations = {

    submit(state, payload){
        state.eventid = payload.eventid;
        state.eventname = payload.eventname;
        state.comments = payload.comments;
    },
    updaterev(state, payload){
        state.eventrev = payload.eventrev;
    },
    datesSelect(state, payload){  
        state.dates = payload.dates;
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