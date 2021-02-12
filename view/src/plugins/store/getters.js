export const getters = {
    eventId: state => state.eventId,
    eventRev: state => state.eventRev,
    eventName: state => state.eventName,
    eventMemo: state => state.eventMemo,    
    eventAddDays: state => state.eventAddDays,
    eventDelDays: state => state.eventDelDays,
    storeId: state => state.storeId,
    storeLatitude: state => state.storeLatitude,
    storeLongitude: state => state.storeLongitude,
    storeName: state => state.storeName,
    storeAddress: state => state.storeAddress,
    storeUrl: state => state.storeUrl,

    eventDays: state => state.eventDays,
    eventMembers: state => state.eventMembers,

    eventHistoryMap: state => state.eventHistoryMap
};
