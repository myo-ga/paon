<template>
  <v-container>
    <v-layout row wrap justify-center>
    <!--地図-->
      <v-flex shrink>
        <v-card max-width="320" min-width="320" class="mx-1 pa-3" tile dark color="teal lighten-1">
          どこに行きますか？
        </v-card>
        <v-card max-width="320" min-width="320" class="mx-1 mb-3" tile>
          <v-layout column>
            <v-flex class="ma-3">
              <MapView/>
            </v-flex>
            <v-flex class="ma-3">
              <v-text-field
                v-model="search"
                label="場所を検索"
                data-vv-name="search"></v-text-field>
            </v-flex>
            <v-flex class="ma-3">
              <v-list>
                <v-subheader>候補日</v-subheader>
                  <v-list-tile v-for="(name, i) in candidates" :key="i">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="name"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MapView from './MapView'

export default {
  components: {
    MapView
  },
  data: () => ({
    search: "",
    candidates: [],
    name: "",
    place: "",
  }),
  mounted () {
    //this.name = this.$store.state.eventname;
  }
}
</script>


<style scooped>

</style>
