<template>
  <v-list>

    <template v-for="(link, index) in links">

      <v-list-tile 
        color="teal"
        ripple 
        v-bind:to="link.path"
        :key="index">

        <v-list-tile-content>
          <v-list-tile-title v-html="link.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    
    <template v-for="(eventHistory, index) in eventHistoryList">

        <v-list-tile 
        color="purple"
        ripple
        :replace="true"
        :to="'/ReferEvent/' + eventHistory.id"
        :key="index+links.length">

        <v-list-tile-content>
          <v-list-tile-title>
            {{textEventHistory(eventHistory)}}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>

  </v-list>
</template>



<script>
export default {
  data: () => ({
    // drawer: false,
    links:[
      {title: "イベントを計画する", icon: "assignment", path: "/RegisterEvent" },
      // {title: "イベントに参加する", icon: "today", path: "/AdjustEvent" },
      // {title: "テスト", icon: "assignment", path: "/VueTest" },
      // {title: "テスト２", icon: "assignment", path: "/VueTest2" },
    ],
    // viewing: 0,

  }),

  created() {
    let eventHistoryMap = this.$localStorage.get("eventHistoryMap");
    if (eventHistoryMap === null) {
      this.$localStorage.set("eventHistoryMap", {});
    }
    this.$store.dispatch("setEventHistoryMap", {
      eventHistoryMap: eventHistoryMap
    });
  },

  computed: {
    eventHistoryList: {
      get() {
        let ret = [];
        let eventHistoryMap = this.$store.getters.eventHistoryMap;
        for (let event_id in eventHistoryMap) {
          ret.push(eventHistoryMap[event_id]);
        }
        return ret;
      }
    }
  },

  
  methods: {
    textEventHistory(eventHistory) {
      let ret = "";
      if (eventHistory.eventTempDays.length == 0) {
        ret += "日付未定　";
      } else if (eventHistory.eventTempDays.length == 1) {
        ret += eventHistory.eventTempDays[0] + "～ ";
      } else {
        ret += eventHistory.eventTempDays[0] + "～ 他　"
      }
      ret += eventHistory.eventName;
      return ret;
    }
  }
  
}
</script>



<style scoped>

</style>