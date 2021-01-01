
<template>
<!--画面：イベント登録-->

  <v-container grid-list-xl>

      <!--カードを縦に並べる-->
      <v-layout row wrap>

        <!--カード１）イベント情報登録-->
        <v-flex xs12 sm8 offset-sm2 shrink><v-card>
            <v-toolbar dense dark color="teal lighten-1">あなたのイベントについて教えてください。</v-toolbar>
            <v-layout column justify-center class="pa-3">
              <v-flex class="mx-3"><v-text-field
                  label="イベント名"
                  v-model="eventname"
                  v-validate="'required|max:25'" :counter="25" :error-messages="errors.collect('eventname')"
                  data-vv-name="eventname"
                  required>
              </v-text-field></v-flex>
              <v-flex class="mx-3"><v-textarea
                  label="イベントの説明"
                  v-model="comments"
                  v-validate="'max:120'"
                  maxlength="120"
                  rows="10"
                  row-height="35"
                  counter full-width solo>
              </v-textarea></v-flex>
            </v-layout>
          </v-card>
        </v-flex>

        <!--カード２）候補日選択-->
        <v-flex xs12 sm8 offset-sm2 shrink><v-card>
            <v-toolbar dense dark color="teal lighten-1">候補日を選択してください。</v-toolbar>
            <DatePickView/>
        </v-card></v-flex>

        <!--カード３）地図-->
        <v-flex xs12 sm8 offset-sm2 shrink><v-card>
            <v-toolbar dense dark color="teal lighten-1">どこに行きますか。</v-toolbar>
            <SerchMap/>
        </v-card></v-flex>

        <!--カード４）テスト：フッターに地図が隠れちゃうから残してる。後でなんとかする。-->
        <v-flex xs12 sm8 offset-sm2 shrink fixed>
          <v-card>
            <v-toolbar>
            </v-toolbar>
          </v-card>
        </v-flex>

      </v-layout>
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn @click="update" color="purple darken-4 white--text">更新</v-btn>
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
    eventId:'',
    //バイデーション情報
    validate_dictionary: {
      custom: {
        eventname: {
          required: () => '必ず入力してください',
          max: '25文字まで入力可能です。'
        }
      }
    },
  }),

  computed:{
    eventrev:{
      get(){return this.$store.state.eventrev},
      set(val){this.$store.commit('eventrev', val)}
    },
    eventname:{
      get(){return this.$store.state.eventname},
      set(val){this.$store.commit('eventname', val)}
    },
    comments:{
      get(){return this.$store.state.comments},
      set(val){this.$store.commit('comments', val)}
    },
    datetimes:{
      get(){return this.$store.state.dates},
      set(val){this.$store.commit('dates', val)}
    },
    storeId:{
      get(){return this.$store.state.storeId},
      set(val){this.$store.commit('storeId', val)}
    },
    storeLatitude:{
      get(){return this.$store.state.storeLatitude},
      set(val){this.$store.commit('storeLatitude', val)}
    },
    storeLongitude:{
      get(){return this.$store.state.storeLongitude},
      set(val){this.$store.commit('storeLongitude', val)}
    },
    storeName:{
      get(){return this.$store.state.storeName},
      set(val){this.$store.commit('storeName', val)}
    },
    storeAddress:{
      get(){return this.$store.state.storeAddress},
      set(val){this.$store.commit('storeAddress', val)}
    },

  },
  
  created () {
    //バリデーション設定
    this.$validator.localize('ja', this.validate_dictionary);
    
    //URLからパラメータを取得
    this.eventId = this.$route.query.id;

    //画面表示時にデータを取得。なければ登録画面に遷移。
    if(this.eventId){ this.get(); }
    else{this.$router.push('/');}
  },

  methods: { 

    //データを更新する
    update () {
      //検証
      this.$validator.validateAll()

      //データを送信する
      this.post();
    },
    
    //APIでデータ送信
    post () {
      var vm = this;
      //APIで登録データをポストする
      this.$axios.post(
        'http://localhost:3000/event/update', 
        querystring.stringify({
          id: vm.eventid,
          rev: vm.eventrev,
          eventName: vm.eventname,
          eventMemo: vm.comments,
          //eventAddDays: this.datetimes.join(','),
          eventAddDays: '',
          eventDelDays: '',
          storeId:  vm.storeId,                       //テスト:店のID固定
          storeLatitude: vm.storeLatitude,            //テスト:店の緯度固定
          storeLongitude: vm.storeLongitude,           //テスト:店の経度固定
          storeName: vm.storeName,                      //テスト:店名固定
          storeAddress: vm.storeAddress,                   //テスト:店の住所固定
          storeUrl: vm.storeUrl                        //テスト:店のURL固定
        })
      )
      .then(
        response => {
          vm.eventId = response.data.id;
          vm.eventrev = response.data.rev;
        }
      )
      .catch(function (error) {
          alert(error);
      });
    },

    //APIでデータ取得
    get () {
      var vm = this;
      this.$axios.get(
        'https://localhost:3000/event/get',{
          params: {
            id: vm.eventId //URLから取得したIDでイベントをリクエスト
          }
      })
      .then(
        response => {
          //データ取得できたら取得したデータを変数に格納（ストア）
          vm.eventrev = response.data.rev;
          vm.eventname = response.data.eventName;
          vm.comments = response.data.eventMemo;

          //datepicker用に連想配列を配列に変換
          var obj = response.data.eventDays;
          var datetimes = [];
          for(var eventday in obj){
            datetimes.push(obj[eventday]);
          }
          vm.datetimes = datetimes.concat();

          vm.storeId = response.data.storeId;
          vm.storeLatitude = response.data.storeLatitude;
          vm.storeLongitude = response.data.storeLongitude;
          vm.storeName = response.data.storeName;
          vm.storeAddress = response.data.storeAddress;
          vm.storeUrl = response.data.storeUrl;
        }
      )
      .catch(function (error) {
        //エラー処理
        alert(error);
      }) 
    },

  },

}
</script>


<style scooped>
.footer{
  background:rgba(0,0,0,0.3)
}

</style>
