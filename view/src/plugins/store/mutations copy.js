export const state = {
    eventid: '',
    eventrev: '',
    eventname: '',
    comments: '',

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



export const actions = {

    async getEvent(context) {
        const payload = {
          eid: '',
          rev: '',
          name: '',
          comments: '',
          dates: {},      
          location: {lid:'',lat:'',lng:'',name:'',address:''}
        };
        await axios
          .get("https://nikujaga.mybluemix.net/event/get", {
            params: { id: payload.eid }
          })
          .then(response => {
            payload.rev = response.data.rev;
            payload.name = response.data.eventName;
            payload.comments = response.data.eventMemo;  
            payload.dates = response.data.eventAddDays;  
            payload.location.lid = response.data.storeId;
            payload.location.lat = response.data.storeLatitude;
            payload.location.lng = response.data.storeLongitude;
            payload.location.name = response.data.storeName;
            payload.location.address = response.data.storeAddress;
          });
        context.commit("update", payload);
    },
};