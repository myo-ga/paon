export const state = {
    count: 0,
    eventname: "",
    eventexplain: "",
    dates: [],
};

export const mutations = {
    increment (state) {
      state.count++
    },
    submit(state, payload){
        state.eventname = payload.eventname;
        state.comments = payload.comments;
        state.dates = payload.dates;
    }
};