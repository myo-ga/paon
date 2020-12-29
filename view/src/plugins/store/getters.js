export const getters = {
    eventId: state => state.eventId,
    eventRev: state => state.eventRev,
    eventName: state => state.eventName,
    eventMemo: state => state.eventMemo,    
    eventDays: state => state.eventDays,
    storeId: state => state.storeId,
    storeLatitude: state => state.storeLatitude,
    storeLongitude: state => state.storeLongitude,
    storeName: state => state.storeName,
    storeAddress: state => state.storeAddress,
    storeUrl: state => state.storeUrl,

    eventHistoryMap: state => state.eventHistoryMap
};
