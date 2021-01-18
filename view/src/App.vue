<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      clipped
      v-model="drawer"
      app
    >
      <Navigation/>
    </v-navigation-drawer>

    <v-toolbar height=35 color="gradient" dark app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="font-weight-light">
        <router-link to="/" style="color: white; text-decoration: none;">paon</router-link>
      </v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <router-view/>    
    </v-content>

    <!--v-footer app fixed>
      <span>&copy; 2019, paon</span>
    </v-footer-->
  </v-app>
</template>

<script>

import Navigation from './components/Navigation.vue'

  export default {
    name: "App",
    components: {
      Navigation
    },
    data: () => ({
      drawer: false,
      // links:[
      //   {title: "イベントを登録する", icon: "assignment", path: "/" },
      //   {title: "イベントに参加する", icon: "today", path: "/AdjustEvent" },
      //   {title: "テスト", icon: "assignment", path: "/VueTest" },
      //   {title: "テスト２", icon: "assignment", path: "/VueTest2" },
      // ],
      // viewing: 0,
    }),
    props: {
      source: String
    },
  }
</script>

<style lang="stylus" scoped>
  .gradient{
    background: linear-gradient(90deg, teal 30%, purple 150%);
    z-index: 1000 !important;
  }
</style>