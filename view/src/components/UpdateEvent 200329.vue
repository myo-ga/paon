
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
                  v-model="name"
                  v-validate="'required|max:25'" :counter="25" :error-messages="errors.collect('name')"
                  data-vv-name="name"
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
    eventId: '',  //イベントID
    eventrev: '',
    name: '',     //イベント名
    comments: '', //イベントのコメント
    dates: [],  //日付配列
    date: '',   //日付 YYYY-MM-DD
    storeId:  '',                 //店のID固定
    storeLatitude: '',            //店の緯度固定
    storeLongitude: '',           //店の経度固定
    storeName: '',                //店名固定
    storeAddress: '',             //店の住所固定
    storeUrl: '',                 //店のURL固定

    //バイデーション情報
    validate_dictionary: {
      custom: {
        name: {
          required: () => '必ず入力してください',
          max: '25文字まで入力可能です。'
        }
      }
    },
  }),


  created(){
    //URLからパラメータを取得
    this.eventId = this.$route.query.id;

    //画面表示時にデータを取得
    if(this.eventId != null){
      this.get();
      this.vuexupdate();
      this.$store.update('updaterev',{eventrev: this.eventrev});
    }
    else{
      this.$router.push('/');
    }
  },
  
  mounted () {
    //バリデーション設定
    this.$validator.localize('ja', this.validate_dictionary);
  },

  methods: { 
    vuexupdate(){
      //vuexのstoreに表示データをコミットする
      this.$store.update(
        'update', {
          eventname: this.name,
          comments: this.comments,
          dates: this.dates,
          storeId: this.storeId,
          storeLatitude: this.storeLatitude,
          storeLongitude: this.storeLongitude,
          storeName: this.storeName,
          storeAddress: this.storeAddress,
          storeUrl: this.storeUrl
      });
    },

    //データを更新する
    update () {
      //検証
      this.$validator.validateAll()

      this.vuexupdate();

      //データを送信する
      this.post();
    },
    
    //APIでデータ送信
    post () {
      //APIで登録データをポストする
      this.$axios.post(
        'http://nikujaga.mybluemix.net/event/update', 
        querystring.stringify({
          id: this.eventid,
          rev: this.eventrev,
          eventName: this.name,
          eventMemo: this.comments,
          //eventAddDays: this.dates.join(','),
          eventAddDays: '',
          eventDelDays: '',
          storeId:  this.storeId,                       //テスト:店のID固定
          storeLatitude: this.storeLatitude,            //テスト:店の緯度固定
          storeLongitude: this.storeLongitude,           //テスト:店の経度固定
          storeName: this.storeName,                      //テスト:店名固定
          storeAddress: this.storeAddress,                   //テスト:店の住所固定
          storeUrl: this.storeUrl                        //テスト:店のURL固定
        })
      )
      .then(
        response => {
          this.eventId = response.data.id;
          this.eventrev = response.data.rev;
        }
      )
      .catch(function (error) {
          alert(error);
      });
    },

    //APIでデータ取得
    get () {
      this.$axios.get(
        'https://nikujaga.mybluemix.net/event/get',
        {
          params: {
            id: this.eventId //URLから取得したIDでイベントをリクエスト
          }
        }
      )
      .then(
        response => {
          //データ取得できたら取得したデータを変数に格納（ストア）
          this.eventrev = response.data.rev;
          this.name = response.data.eventName;
          this.comments = response.data.eventMemo;

          //datepicker用に連想配列を配列に変換
          var obj = response.data.eventDays;
          this.dates = [];
          for(var eventday in obj){
            this.dates.push(obj[eventday]);
          }

          this.storeId = response.data.storeId;
          this.storeLatitude = response.data.storeLatitude;
          this.storeLongitude = response.data.storeLongitude;
          this.storeName = response.data.storeName;
          this.storeAddress = response.data.storeAddress;
          this.storeUrl = response.data.storeUrl;

          alert(this.dates[0])
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
