<template>
  <v-container grid-list-xl>
      <v-layout row wrap>
      <!--イベント情報-->
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">
              あなたのイベントについて教えてください。
            </v-toolbar>
            <v-layout column justify-center class="pa-3">
              <v-flex class="mx-3">
                <v-text-field
                  v-model="name"
                  v-validate="'required|max:25'"
                  :counter="25"
                  :error-messages="errors.collect('name')"
                  label="イベント名"
                  data-vv-name="name"
                  required ></v-text-field>
              </v-flex>
              <v-flex class="mx-3">
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
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">
              候補日を選択してください。
            </v-toolbar>
            <v-layout row wrap class="pa-3" justify-center>
              <v-flex shrink class="my-3" style="max-width: 300px">
                <v-date-picker
                  v-model="dates"
                  color="teal"
                  locale="ja-JP" 
                  :day-format="date => new Date(date).getDate()" 
                  class="picker" 
                  no-title multiple></v-date-picker>
              </v-flex>
              <v-flex shrink class="my-3">
                <v-list style="max-height: 300px; width: 200px">
                  <v-subheader>候補日</v-subheader>
                  <v-list-tile v-for="(date, i) in dates" :key="i">
                    <v-list-tile-action>
                      <v-icon>calendar_today</v-icon>
                    </v-list-tile-action>
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
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">
              どこに行きますか。
            </v-toolbar>
            <SerchMap/>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout class="pa-3" row justify-center>
          <v-btn @click="submit" color="teal white--text">登録</v-btn>
          <v-btn @click="clear">クリア</v-btn>
      </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
//import ja from 'vee-validate/dist/locale/ja'

import SerchMap from './SearchMap'
//import DatePickDialog from './DatesPickList'

Vue.use(VeeValidate)

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    SerchMap,
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

</style>
