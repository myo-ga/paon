
<template>
<!--画面：イベント登録-->

  <v-container>

      <!--カードを縦に並べる-->
      <v-layout column wrap style="max-width: 800px" class="mx-auto">

        <!--カード１）イベント情報登録-->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">あなたのイベントについて教えてください。</v-toolbar>
            <v-layout column justify-center class="pa-3">
              <v-flex class="mx-3">
                <v-text-field
                  label="イベント名"
                  v-model="eventName"
                  v-validate="'required|max:25'" :counter="25" :error-messages="errors.collect('name')"
                  data-vv-name="eventName"
                  required>
                </v-text-field>
              </v-flex>
              <v-flex class="mx-3">
                <v-textarea
                  label="イベントの説明"
                  v-model="eventMemo"
                  v-validate="'max:120'"
                  maxlength="120"
                  rows="10"
                  row-height="35"
                  counter full-width solo>
                </v-textarea>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>

        <!--カード２）候補日選択-->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">候補日を選択してください。</v-toolbar>
            <DatePickView ref="date_pick_view"/>
          </v-card>
        </v-flex>

        <!--カード３）地図-->
        <v-flex><v-card>
            <v-toolbar dense dark color="teal lighten-1">どこに行きますか。</v-toolbar>
            <SerchMap ref="search_map"/>
        </v-card></v-flex>

        <!--カード４）テスト：フッターに地図が隠れちゃうから残してる。後でなんとかする。-->
        <!-- <v-flex xs12 sm12 md10 lg7 class="mx-auto">
          <v-card>
            <v-toolbar>
            </v-toolbar>
          </v-card>
        </v-flex> -->

      </v-layout>
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn @click="clear">クリア</v-btn>
            <v-btn @click="submit" color="purple darken-4 white--text">登録</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>



<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'    //バイデーション
import SerchMap from './SearchMap'        //地図表示
import DatePickView from './DatePickView' //カレンダー

Vue.use(VeeValidate)

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    SerchMap,     //地図コンポーネント
    DatePickView,
  },
  data: () => ({
    //バイデーション情報
    validate_dictionary: {
      custom: {
        eventName: {
          required: () => '必ず入力してください',
          max: '25文字まで入力可能です。'
        }
      }
    },
  }),

  //画面表示時前処理
  created () {
    //バリデーション設定
    this.$validator.localize('ja', this.validate_dictionary);
  },

  computed: {
    eventName: {
      get() {return this.$store.getters.eventName},
      set(val) {this.$store.dispatch("setEventName", {eventName: val});}
    },
    eventMemo: {
      get() {return this.$store.getters.eventMemo},
      set(val) {return this.$store.dispatch("setEventMemo", {eventMemo: val});}  
    }
  },

  methods: { 
    //表示データを登録する
    submit () {

      //検証
      this.$validator.validateAll()

      //データを送信する
      this.post();
    },

    //表示データをクリアする
    clear () {
      this.eventName = "";
      this.eventMemo = "";
      this.$refs.date_pick_view.clear();
      this.$refs.search_map.clear();
      
      this.$validator.reset();
      console.log(this.$vuetify.breakpoint);
    },

    //APIでデータ送信
    post () {
      var vm = this;
      //APIで登録データをポストする
      this.$axios.post(
        'http://nikujaga.mybluemix.net/event/create', 
        querystring.stringify({
          eventName: this.$store.getters.eventName,
          eventMemo: this.$store.getters.eventMemo,
          eventAddDays: this.$store.getters.eventDays.join(","),
          storeId: this.$store.getters.storeId,
          storeLatitude: this.$store.getters.storeLatitude,
          storeLongitude: this.$store.getters.storeLongitude,
          storeName: this.$store.getters.storeName,
          storeAddress: this.$store.getters.storeAddress,
          storeUrl: this.$store.getters.storeUrl
        })
      )
      .then(
        response => {
          let eventId = response.data.id;
          
          //update画面に遷移
          vm.$router.push('/UpdateEvent/?id=' + eventId);
        }
      )
      .catch(function (error) {
          alert(error);
      });
    },

  },

}
</script>


<style scooped>
.footer{
  background:rgba(0,0,0,0.3)
}
</style>
