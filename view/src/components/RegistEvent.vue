
<template>
<!--画面：イベント登録-->

  <v-container>

      <!--カードを縦に並べる-->
      <v-layout column wrap style="max-width: 800px" class="mx-auto">

        <!--カード１）イベント情報登録-->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">あなたのイベントについて教えてください。</v-toolbar>
            <EventDescription ref="event_description"/>
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
      
      <!-- TODO: 登録 -> 解決 -->
      <!-- TODO: 更新 -> 解決 -->
      <!-- TODO: メンバー削除する -> 解決 -->
      <!-- TODO: イベントを削除する -> 解決 -->
      <!-- TODO: 出欠を登録する -> 解決-->
      <!-- TODO: 出欠を更新する -> 解決 -->
      <!-- TODO: isRegisterProcessingはmixinのisLoadingと置き換え -->
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
    },

    //表示データをクリアする
    clear() {
      this.$refs.event_description.clear();
      this.$refs.date_pick_view.clear();
      this.$refs.search_map.clear();
    },

    //APIでデータ送信
    post() {
      //var vm = this;
      //APIで登録データをポストする
      this.$axios.post(
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
        })
      )
      .then(
        response => {
          let event_id = response.data.id;
          let eventHistoryMap = Object.assign({}, this.$store.getters.eventHistoryMap);

          // ナビゲーションに追加
          eventHistoryMap[event_id] = {
            id: event_id,
            eventName: this.$store.getters.eventName,
            //eventDays: this.$store.getters.eventAddDays // TODO: e更新を考慮するとventDaysにしたほうがよいか？ 
            eventTempDays: this.$refs.date_pick_view.eventTempDays
          };

          this.$localStorage.set("eventHistoryMap", eventHistoryMap);
          
          this.$store.dispatch("setEventHistoryMap", {
            eventHistoryMap: eventHistoryMap
          });

          this.isRegisterProcessing = false;
          // 参照画面に遷移
          this.$router.push('/ReferEvent/' + event_id);
        }
      )
      .catch(function (error) {
          alert(error);
          this.isRegisterProcessing = false;
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
