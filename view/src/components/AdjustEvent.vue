<template>
  <v-container>
    <v-layout 
      v-bind="binding" 
      align-space-around 
      justify-space-around 
      column
      fill-height 
    >
      <v-flex>
          {{ name }}
      </v-flex>
      <v-flex>
          {{ comments }}
      </v-flex>
      <v-flex>
        <MapView/>
      </v-flex>
      <v-flex>
        <MemberTable/>
      </v-flex>
      <v-flex>
        <CalendarView/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MapView from './testlist'
import MemberTable from './MemberTable'
import CalendarView from './CalendarView'

export default {
  components: {
    MapView,
    MemberTable,
    CalendarView
  },
  data: () => ({
    name: '',
    comments: '',
  }),
  mounted(){
    this.name = this.$store.state.eventname;
    this.comments = this.$store.state.comments;
  }
}
</script>
