
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
import qs from 'qs';

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
    date: '',   //日付

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

    //画面表示時にデータを取得
    this.get();

  },

  methods: { 
    //表示データを登録する
    submit () {
      this.$validator.validateAll()

      //vuexのstoreに表示データをコミットする
      this.$store.commit(
        'submit', {
          eventname: this.name,
          comments: this.comments,
          dates: this.dates,
      });

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
            id: '4a2f84c573094d064488a9b11cdf8abd'  //テスト：とりあえず取得するIDは固定しとく
          }
        }
      )
      .then(
        json => {
          //データ取得できたら取得したデータを変数に格納（ストア）
          this.name = json.eventName;
          this.comments = json.eventMemo;
          this.dates = json.eventDays;
        }
      )
      .catch(function (error) {
        //エラー処理
          //console.log(error);
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
          //eventAddDays: this.dates.join(','),
          eventAddDays: '2020-01-09 01:01',   //テスト:日時固定
          storeId:  11,                       //テスト:店のID固定
          storeLatitude: 'N11.11',            //テスト:店の緯度固定
          storeLongitude: 'E11.11',           //テスト:店の経度固定
          storeName: 11,                      //テスト:店名固定
          storeAddress: 11,                   //テスト:店の住所固定
          storeUrl: 11                        //テスト:店のURL固定
        })
      )
      .then(function(response){
        alert('アラート');
      })
      .catch(function (error) {
          //console.log(error);
      });
    }
  },

  watch:{
    //日付は5件まで
    dates(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.dates.pop())
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
