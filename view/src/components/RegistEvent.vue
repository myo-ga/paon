
<template>
<!--画面：イベント登録-->

  <v-container grid-list-xl>

      <!--カードを縦に並べる-->
      <v-layout row wrap>

        <!--カード１）イベント情報登録-->
        <v-flex xs12 sm8 offset-sm2 shrink>
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

        <!--カード２）候補日選択-->
        <v-flex xs12 sm8 offset-sm2 shrink>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">
              候補日を選択してください。
            </v-toolbar>
            <v-layout row wrap class="pa-3" justify-center>
              <v-flex shrink class="my-3" style="max-width: 300px">

                <!--日付選択用カレンダー-->
                <!--ToDo：TimePickerで時刻も選択できるようにする-->
                <v-date-picker
                  v-model="dates"
                  color="teal"
                  locale="ja-JP" 
                  :day-format="date => new Date(date).getDate()" 
                  class="picker" 
                  no-title multiple>
                </v-date-picker>

              </v-flex>
              <v-flex shrink class="my-3">

                <!--選択された数だけ日付をリスト表示-->
                <v-list style="max-height: 300px; width: 200px">
                  <v-subheader>候補日リスト</v-subheader>
                  <template v-for="(date, i) in dates" >
                    <v-list-tile :key="i">
                      <v-list-tile-action>
                        <v-icon>calendar_today</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title v-text="date"></v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider v-if="i+1 < dates.length" :key="i"></v-divider>
                  </template>
                </v-list>

              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>

        <!--カード３）地図-->
        <v-flex xs12 sm8 offset-sm2 shrink>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">
              どこに行きますか。
            </v-toolbar>
            <SerchMap/>
          </v-card>
        </v-flex>

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
            <v-btn @click="clear">クリア</v-btn>
            <v-btn @click="submit" color="purple darken-4 white--text">登録</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>



<script>
import Vue from 'vue'

//バイデーション
import VeeValidate from 'vee-validate'
//import ja from 'vee-validate/dist/locale/ja'

//地図表示
import SerchMap from './SearchMap'

//カレンダー
//import DatePickDialog from './DatesPickList'

Vue.use(VeeValidate)

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    SerchMap,     //地図コンポーネント
  },
  data: () => ({
    eventId: '',  //イベントID
    name: '',     //イベント名
    comments: '', //イベントのコメント
    dates: [],  //日付配列
    date: '',   //日付 YYYY-MM-DD
    
    //店舗情報
    storeId:  '',                 //テスト:店のID固定
    storeLatitude: '',            //テスト:店の緯度固定
    storeLongitude: '',           //テスト:店の経度固定
    storeName: '',                //テスト:店名固定
    storeAddress: '',             //テスト:店の住所固定
    storeUrl: '',                  //テスト:店のURL固定

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

  mounted () {
    //画面表示時処理

    //バリデーション設定
    this.$validator.localize('ja', this.validate_dictionary);

    //vuex:storeするデータを有効化
    this.name = this.$store.state.eventname;    //イベント名
    this.comments = this.$store.state.comments; //コメント
    this.dates = this.$store.state.dates;       //日付

    this.storeId = this.$store.state.storeId;
    this.storeLatitude = this.$store.state.storeLatitude;
    this.storeLongitude = this.$store.state.storeLongitude;
    this.storeName = this.$store.state.storeName;
    this.storeAddress = this.$store.state.storeAddress;
    this.storeUrl = this.$store.state.storeUrl;
    
    //URLからパラメータを取得
    this.eventId = this.$route.query.id;

    //画面表示時にデータを取得
    if(this.eventId != null){
      this.get();
    }

  },

  methods: { 
    //表示データを登録する
    submit () {

      //検証
      this.$validator.validateAll()

      //vuexのstoreに表示データをコミットする
      this.$store.commit(
        'submit', {
          eventname: this.name,
          comments: this.comments,
          dates: this.dates,
      });

        
      this.storeId = this.$store.state.storeId;
      this.storeLatitude = this.$store.state.storeLatitude;
      this.storeLongitude = this.$store.state.storeLongitude;
      this.storeName = this.$store.state.storeName;
      this.storeAddress = this.$store.state.storeAddress;
      this.storeUrl = this.$store.state.storeUrl;

      //データを送信する
      this.post();
    },

    //表示データをクリアする
    clear () {
      this.name = ''
      this.comments = ''
      this.dates = ''
      this.$validator.reset()
    },

    //APIでデータ取得
    get () {
      this.$axios.get(
        'https://nikujaga.mybluemix.net/event/get',
        {
          params: {
            //id: '4a2f84c573094d064488a9b11cdf8abd'  //テスト：とりあえず取得するIDは固定しとく
            id: this.eventId //URLから取得したIDでイベントをリクエスト
          }
        }
      )
      .then(
        response => {
          //データ取得できたら取得したデータを変数に格納（ストア）
          this.name = response.data.eventName;
          this.comments = response.data.eventMemo;

          //datepicker用に連想配列を配列に変換
          var obj = response.data.eventDays
          this.dates = Object.keys(obj).map(function (key) {return obj[key]});

        }
      )
      .catch(function (error) {
        //エラー処理
        alert(error);
      }) 
    },

    //APIでデータ送信
    post () {
      //APIで登録データをポストする
      this.$axios.post(
        'http://nikujaga.mybluemix.net/event/create', 
        querystring.stringify({
          eventName: this.name,
          eventMemo: this.comments,
          eventAddDays: this.dates.join(','),
          //eventAddDays: '2020-01-09',   //テスト:日時固定
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
          alert('http://localhost/?id=' + this.eventId);
        }
      )
      .catch(function (error) {
          alert(error);
      });
    },

  },

  watch:{
    
    dates(val) {

      //フォーマット
      //this.datesFormated = this.dates.map(function(element){return element.replace(/-/g,'/')});

      //日付は5件まで
      if (val.length > 5) {
        this.$nextTick(() => val.pop())
      }
    }
  }
}
</script>


<style scooped>
.footer{
  background:rgba(0,0,0,0.3)
}
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
