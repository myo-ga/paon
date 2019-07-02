<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
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
    <v-toolbar color="amber" app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>行くとこ調整</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container grid-list-xl>
        <v-layout v-bind="binding">
          <v-flex>
              <template>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  class="elevation-1"
                >
                  <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.calories }}</td>
                    <td class="text-xs-center">{{ props.item.fat }}</td>
                    <td class="text-xs-center">{{ props.item.carbs }}</td>
                    <td class="text-xs-center">{{ props.item.protein }}</td>
                    <td class="text-xs-center">{{ props.item.iron }}</td>
                  </template>
                </v-data-table>
              </template>
          </v-flex>
          <v-flex>
            <template>
              <v-layout>
                <v-flex>
                  <v-sheet height="500">
                    <v-calendar
                      :now="today"
                      :value="today"
                      color="primary"
                    >
                      <template v-slot:day="{ date }">
                        <template v-for="event in eventsMap[date]">
                          <v-menu
                            :key="event.title"
                            v-model="event.open"
                            full-width
                            offset-x
                          >
                            <template v-slot:activator="{ on }">
                              <div
                                v-if="!event.time"
                                v-ripple
                                class="my-event"
                                v-on="on"
                                v-html="event.title"
                              ></div>
                            </template>
                            <v-card
                              color="grey lighten-4"
                              min-width="350px"
                              flat
                            >
                              <v-toolbar
                                color="primary"
                                dark
                              >
                                <v-btn icon>
                                  <v-icon>edit</v-icon>
                                </v-btn>
                                <v-toolbar-title v-html="event.title"></v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon>
                                  <v-icon>favorite</v-icon>
                                </v-btn>
                                <v-btn icon>
                                  <v-icon>more_vert</v-icon>
                                </v-btn>
                              </v-toolbar>
                              <v-card-title primary-title>
                                <span v-html="event.details"></span>
                              </v-card-title>
                              <v-card-actions>
                                <v-btn
                                  flat
                                  color="secondary"
                                >
                                  Cancel
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-menu>
                        </template>
                      </template>
                    </v-calendar>
                  </v-sheet>
                </v-flex>
              </v-layout>
            </template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>&copy; 2019, Chosei</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      headers: [
        {
          text: '参加者',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '6/27（木）', value: 'calories' },
        { text: '6/28（金）', value: 'fat' },
        { text: '6/29（土）', value: 'carbs' },
        { text: '6/30（日）', value: 'protein' },
        { text: '7/1（月）', value: 'iron' }
      ],
      desserts: [
        {
          name: 'そめや',
          calories: '〇',
          fat: '〇',
          carbs: '△',
          protein: '〇',
          iron: '×'
        },
        {
          name: 'だいも',
          calories: '〇',
          fat: '〇',
          carbs: '〇',
          protein: '〇',
          iron: '〇'
        },
        {
          name: 'dimon',
          calories: '-',
          fat: '-',
          carbs: '-',
          protein: '-',
          iron: '-'
        },
        {
          name: 'たこやき',
          calories: '〇',
          fat: '〇',
          carbs: '△',
          protein: '〇',
          iron: '×'
        },
        {
          name: 'おこのみ',
          calories: '〇',
          fat: '〇',
          carbs: '△',
          protein: '〇',
          iron: '×'
        },
        {
          name: 'たなか',
          calories: '×',
          fat: '×',
          carbs: '×',
          protein: '×',
          iron: '×'
        }
      ],
            today: '2019-01-08',
      events: [
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2018-12-30',
          open: false
        },
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2018-12-31',
          open: false
        },
        {
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2019-01-01',
          open: false
        },
        {
          title: 'Meeting',
          details: 'Spending time on how we do not have enough time',
          date: '2019-01-07',
          open: false
        },
        {
          title: '30th Birthday',
          details: 'Celebrate responsibly',
          date: '2019-01-03',
          open: false
        },
        {
          title: 'New Year',
          details: 'Eat chocolate until you pass out',
          date: '2019-01-01',
          open: false
        },
        {
          title: 'Conference',
          details: 'Mute myself the whole time and wonder why I am on this call',
          date: '2019-01-21',
          open: false
        },
        {
          title: 'Hackathon',
          details: 'Code like there is no tommorrow',
          date: '2019-02-01',
          open: false
        }
      ]
    }),
    props: {
      source: String
    },
    computed: {
      // convert the list of events into a map of lists keyed by date
      eventsMap () {
        const map = {}
        this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
        return map
      },
      binding () {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

        return binding
      }
    },
    methods: {
      open (event) {
        alert(event.title)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    width: 100%;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
  }
</style>