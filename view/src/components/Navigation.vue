<template>
  <v-list>

    <template v-for="(link, index) in links">
      <v-list-tile 
        color="teal"
        ripple 
        v-bind:to="link.path"
        @click="viewing=index" 
        :key="index">
        <!-- <v-list-tile-action>
          <v-icon v-if="viewing==index" color="primary">{{link.icon}}</v-icon>
          <v-icon v-else>{{link.icon}}</v-icon>
        </v-list-tile-action> -->
        <v-list-tile-content>
          <v-list-tile-title v-html="link.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    
    <template v-for="(eventHistory, index) in eventHistoryList">
      <v-list-tile 
        color="teal"
        ripple 
        v-bind:to="'/UpdateEvent/?id=' + eventHistory.id" 
        @click="viewing=(index+links.length)" 
        :key="index+links.length">
        <!-- <v-list-tile-action>
          <v-icon v-if="viewing==(index+links.length)" color="primary">assignment</v-icon>
          <v-icon v-else>assignment</v-icon>
        </v-list-tile-action> -->
        <v-list-tile-content>
          <v-list-tile-title>{{eventHistory.eventName}}</v-list-tile-title>
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
      {title: "イベントを登録する", icon: "assignment", path: "/" },
      // {title: "イベントに参加する", icon: "today", path: "/AdjustEvent" },
      // {title: "テスト", icon: "assignment", path: "/VueTest" },
      // {title: "テスト２", icon: "assignment", path: "/VueTest2" },
    ],
    viewing: 0,

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

  }
  
}
</script>



<style scoped>

</style>