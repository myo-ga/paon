
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
                  v-model="name"
                  v-validate="'required|max:25'" :counter="25" :error-messages="errors.collect('name')"
                  data-vv-name="name"
                  required>
                </v-text-field>
              </v-flex>
              <v-flex class="mx-3">
                <v-textarea
                  label="イベントの説明"
                  v-model="comments"
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
            <DatePickView/>
          </v-card>
        </v-flex>

        <!--カード３）地図-->
        <v-flex><v-card>
            <v-toolbar dense dark color="teal lighten-1">どこに行きますか。</v-toolbar>
            <SerchMap/>
        </v-card></v-flex>

        <!--カード４）テスト：フッターに地図が隠れちゃうから残してる。後でなんとかする。-->
        <v-flex xs12 sm12 md10 lg7 class="mx-auto">
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
    name: '',     //イベント名
    comments: '', //イベントのコメント
    dates: [],  //日付配列
    date: '',   //日付 YYYY-MM-DD
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

  //画面表示時前処理
  created () {
    //バリデーション設定
    this.$validator.localize('ja', this.validate_dictionary);
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
      });
      
      //vuexからcomponentの値を取得
      this.dates = this.$store.state.dates;
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
          eventName: vm.name,
          eventMemo: vm.comments,
          eventAddDays: vm.dates.join(','),
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
          
          //update画面に遷移
          vm.$router.push('/UpdateEvent/?id=' + vm.eventId);
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
