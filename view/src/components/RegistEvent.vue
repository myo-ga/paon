
<template>
<!--画面：イベント登録-->

  <v-container>

      <!--カードを縦に並べる-->
      <v-layout column wrap style="max-width: 800px" class="mx-auto">

        <!--カード１）イベント情報登録-->
<<<<<<< HEAD
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">あなたのイベントについて教えてください。</v-toolbar>
            <EventDescription ref="event_description"/>
=======
        <v-flex xs12 sm8 offset-sm2 shrink>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1" class="subheading">あなたのイベントについて教えてください。</v-toolbar>
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
>>>>>>> master
          </v-card>
        </v-flex>

        <!--カード２）候補日選択-->
<<<<<<< HEAD
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
=======
        <v-flex xs12 sm8 offset-sm2 shrink><v-card>
            <v-toolbar dense dark color="teal lighten-1" class="subheading">候補日を選択してください。</v-toolbar>
            <DatePickView/>
        </v-card></v-flex>

        <!--カード３）地図-->
        <v-flex xs12 sm8 offset-sm2 shrink><v-card>
            <v-toolbar dense dark color="teal lighten-1" class="subheading">どこに行きますか。</v-toolbar>
            <SerchMap/>
>>>>>>> master
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
            <v-btn :disabled="isRegisterProcessing" @click="submit" color="purple darken-4 white--text">登録</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>



<script>
import SerchMap from './SearchMap'        //地図表示
import DatePickView from './DatePickView' //カレンダー
import EventDescription from './EventDescription'
import serverurl from '../const/serverurl'

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  components: {
    SerchMap,     //地図コンポーネント
    DatePickView,
    EventDescription
  },

  data: () => ({
    isRegisterProcessing: false
  }),

  mounted() {
    // refsを参照しているので、子コンポーネントが生成された後にclearは参照できる
    // createdではなくmountedにやる
    this.clear();
  },

  methods: { 
    //表示データを登録する
    submit () {
<<<<<<< HEAD
      this.isRegisterProcessing = true;

      // 候補日をvuexに設定する
      this.$refs.date_pick_view.provideEventAddDays();
      // 検証
      this.$refs.event_description.$validator.validateAll()
      .then((result) => {
        // 入力エラーあり
        if (result === false) {
          alert("不適切な項目があるため、入力項目を見直してください。");
          this.isRegisterProcessing = false;
          return false;
        }
        this.post();
      });
=======

      //検証
      this.$validator.validateAll()

      //vuexのstoreに表示データをコミットする
      this.$store.commit('eventname', this.name);
      this.$store.commit('comments', this.comments);
      
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
>>>>>>> master
    },

    //表示データをクリアする
    clear() {
      this.$refs.event_description.clear();
      this.$refs.date_pick_view.clear();
      this.$refs.search_map.clear();
    },

    //APIでデータ送信
    post() {
      let vm = this;
      //APIで登録データをポストする
      this.$axios.post(
<<<<<<< HEAD
        serverurl.EVENT_CREATE_URL, 
        querystring.stringify({
          eventName: this.$store.getters.eventName,
          eventMemo: this.$store.getters.eventMemo,
          eventAddDays: this.$store.getters.eventAddDays.join(","),
          storeId: this.$store.getters.storeId,
          storeLatitude: this.$store.getters.storeLatitude,
          storeLongitude: this.$store.getters.storeLongitude,
          storeName: this.$store.getters.storeName,
          storeAddress: this.$store.getters.storeAddress,
          storeUrl: this.$store.getters.storeUrl
=======
        'http://localhost:3000/event/create', 
        querystring.stringify({
          eventName: vm.name,
          eventMemo: vm.comments,
          eventAddDays: vm.dates.join(','),
          storeId:  vm.storeId,                       //テスト:店のID固定
          storeLatitude: vm.storeLatitude,            //テスト:店の緯度固定
          storeLongitude: vm.storeLongitude,          //テスト:店の経度固定
          storeName: vm.storeName,                    //テスト:店名固定
          storeAddress: vm.storeAddress,              //テスト:店の住所固定
          storeUrl: vm.storeUrl                       //テスト:店のURL固定
>>>>>>> master
        })
      )
      .then(
        response => {
          let event_id = response.data.id;
          let eventHistoryMap = Object.assign({}, vm.$store.getters.eventHistoryMap);

          // ナビゲーションに追加
          eventHistoryMap[event_id] = {
            id: event_id,
            eventName: vm.$store.getters.eventName,
            eventTempDays: vm.$refs.date_pick_view.eventTempDays
          };

          vm.$localStorage.set("eventHistoryMap", eventHistoryMap);
          
          vm.$store.dispatch("setEventHistoryMap", {
            eventHistoryMap: eventHistoryMap
          });

          vm.isRegisterProcessing = false;
          // 参照画面に遷移
          vm.$router.push('/ReferEvent/' + event_id);
        }
      )
      .catch(function (error) {
          alert(error);
          vm.isRegisterProcessing = false;
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
