<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      absolute
      temporary
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="gradient" dark app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="font-weight-light">paon</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <v-layout v-bind="binding" align-space-around justify-space-around column fill-height>
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
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2019, paon</span>
    </v-footer>
  </v-app>
</template>

<script>
import MapView from './MapView'
import MemberTable from './MemberTable'
import CalendarView from './CalendarView'

  export default {
    data: () => ({
      drawer: null,
    }),
    props: {
      source: String
    },
    computed: {
      binding () {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

        return binding
      }
    },
    components: {
      MapView,
      MemberTable,
      CalendarView
    }
  }
</script>

<style lang="stylus" scoped>
  .gradient{
    background: linear-gradient(90deg, teal 30%, indigo 150%);
  }
</style>