export const mutations = {
    setEventId(state, val){
        state.eventId=val;
    },
    setEventRev(state,val){
        state.eventRev = val;
    },
    setEventName(state,val){
        state.eventName = val;
    },
    setEventDays(state, val) {
        state.eventDays = val;
    },
    setEventMemo(state,val){
        state.eventMemo = val;
    },
    setStoreId(state, val){
        state.storeId = val;
    },
    setStoreLatitude(state, val){
        state.storeLatitude = val;
    },
    setStoreLongitude(state, val){
        state.storeLongitude = val;
    },
    setStoreName(state, val){
        state.storeName = val;
    },
    setStoreAddress(state, val){
        state.storeAddress = val;
    },
    setStoreUrl(state,val){
        state.storeUrl = val;
    },

    setEventHistoryMap(state, val) {
        state.eventHistoryMap = val;
    },
    setEvent(state, event) {
        state.eventName = event.eventName;
        state.eventMemo = event.eventMemo;
        state.storeId = event.storeId;
        state.storeLatitude = event.storeLatitude;
        state.storeLongitude = event.storeLongitude;
        state.storeName = event.storeName;
        state.storeAddress = event.storeAddress;
        state.storeUrl = event.storeUrl;
    },


    updaterev(state, payload){
        state.eventrev = payload.eventrev;
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

