export const actions = {

    setEventId({commit}, {eventId}) {
        commit('setEventId', eventId);
    },
    setEventRev({commit}, {eventRev}) {
        commit('setEventRev', eventRev);
    },
    setEventName({commit}, {eventName}){
        commit('setEventName', eventName);
    },
    setEventMemo({commit}, {eventMemo}) {
        commit('setEventMemo', eventMemo);
    },
    setEventAddDays({commit}, {eventAddDays}) {
        commit('setEventAddDays', eventAddDays);
    },
    setEventDelDays({commit}, {eventDelDays}) {
        commit('setEventDelDays', eventDelDays)
    },
    setStoreId({commit}, {storeId}) {
        commit('setStoreId', storeId);
    },
    setStoreLatitude({commit}, {storeLatitude}) {
        commit('setStoreLatitude', storeLatitude);
    },
    setStoreLongitude({commit}, {storeLongitude}) {
        commit('setStoreLongitude', storeLongitude);
    },
    setStoreName({commit}, {storeName}) {
        commit('setStoreName', storeName);
    },
    setStoreAddress({commit}, {storeAddress}) {
        commit('setStoreAddress', storeAddress);
    },
    setStoreUrl({commit}, {storeUrl}) {
        commit('setStoreUrl', storeUrl)
    },

    setEventHistoryMap({commit}, {eventHistoryMap}) {
        commit('setEventHistoryMap', eventHistoryMap);
    },

    setEvent({commit}, {event}) {
        console.log(event);
        commit('setEvent', event);
    }

};
