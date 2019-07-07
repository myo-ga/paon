<template>
  <v-app id="inspire">

    <v-navigation-drawer
      v-model="drawer"
      clipped 
      absolute 
      temporary 
    >
      <v-list dense>
        <router-link to="/">
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>assignment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>イベントを登録する</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
        <router-link to="/AdjustEvent">
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>today</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>イベントに参加する</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar height=35 color="gradient" dark app fi xed clipped-left >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="font-weight-light">paon</v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <router-view/>    
    </v-content>

    <v-footer app fixed>
      <span>&copy; 2019, paon</span>
    </v-footer>
  </v-app>
</template>

<script>
import RegistEvent from "./components/RegistEvent"

  export default {
    name: "App",
    components: {
      RegistEvent
    },
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
    }
  }
</script>

<style lang="stylus" scoped>
  .gradient{
    background: linear-gradient(90deg, teal 30%, purple 150%);
  }
</style>