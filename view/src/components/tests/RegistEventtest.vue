<template>
  <v-container>
    <v-layout row wrap justify-center>
    <!--イベント情報-->
      <v-flex shrink>
        <v-card max-width="320" min-width="320" class="mx-1 pa-3" tile dark color="teal lighten-1">
          あなたのイベントについて教えてください。
        </v-card>
        <v-card max-width="320" min-width="320" class="mx-1 mb-3" tile>
          <v-layout column>
            <v-flex class="ma-3">
              <v-text-field
                v-model="name"
                v-validate="'required|max:25'"
                :counter="25"
                :error-messages="errors.collect('name')"
                label="イベント名"
                data-vv-name="name"
                required ></v-text-field>
            </v-flex>
            <v-flex class="ma-3">
              <v-textarea
                v-model="comments"
                v-validate="'max:120'"
                label="イベントの説明"
                maxlength="120"
                rows="10"
                row-height="35"
                counter full-width solo></v-textarea>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    <!--候補日-->
      <v-flex shrink>
        <v-card max-width="320" min-width="320" class="mx-1 pa-3" tile dark color="teal lighten-1">
          候補日を選択してください。
        </v-card>
        <v-card max-width="320" min-width="320" class="mx-1 mb-3" tile>
          <v-layout column wrap >
            <v-flex class="ma-3">
              <!--DatePickDialog/-->
              <v-date-picker
                v-model="dates"
                color="teal"
                locale="ja-JP" 
                :day-format="date => new Date(date).getDate()" 
                class="picker" 
                no-title multiple></v-date-picker>
            </v-flex>
            <v-flex>
              <v-list>
                <v-subheader>候補日</v-subheader>
                <v-list-tile v-for="(date, i) in dates" :key="i">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="date"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
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
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  <!--ボタン-->
    <v-layout justify-center  class="ma-3">
      <v-btn @click="submit" color="teal white--text">登録</v-btn>
      <v-btn @click="clear">クリア</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
//import ja from 'vee-validate/dist/locale/ja'

import MapView from './MapView'
//import DatePickDialog from './DatesPickList'

Vue.use(VeeValidate)

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    //DatePickDialog,
    MapView
  },
  data: () => ({
    name: '',
    comments: '',
    dictionary: {
      custom: {
        name: {
          required: () => '必ず入力してください',
          max: '25文字まで入力可能です。'
        }
      }
    },
    dates: [],
    date: '',
    items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
    ],
    item: 1,
  }),
  mounted () {
    this.$validator.localize('ja', this.dictionary);
    this.name = this.$store.state.eventname;
    this.comments = this.$store.state.comments;
    this.dates = this.$store.state.dates;
  },
  methods: {
    submit () {
      this.$validator.validateAll()
      this.$store.commit(
        'submit', 
        {
          eventname: this.name,
          comments: this.comments,
          dates: this.dates,
        });
    },
    clear () {
      this.name = ''
      this.$validator.reset()
    }
  },
  watch:{
    dates(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.dates.pop())
      }
    }
  }
}
</script>


<style scooped>
.picker {
  font-size: 120%;
}
.picker th {
  font-size: 100%;
}
.v-btn__content {
  font-size: 150%;
}
.v-date-picker-header__value {
    border-bottom:solid 1px teal;
}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(7) {
    color:teal
}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(1) {
    color:red
}
.v-date-picker-table.v-date-picker-table--date > table > tbody tr td:nth-child(7) .v-btn__content {
    color:teal
}
.v-date-picker-table.v-date-picker-table--date > table > tbody tr td:nth-child(1) .v-btn__content {
    color:red
}
</style>
