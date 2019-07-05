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
import MapView from './MapView'
import MemberTable from './MemberTable'
import CalendarView from './CalendarView'

  export default {
    components: {
      MapView,
      MemberTable,
      CalendarView
    }
  }
</script>
