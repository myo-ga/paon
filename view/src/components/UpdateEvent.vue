
<template>
<!--画面：イベント登録-->

  <v-container>

      <!--カードを縦に並べる-->
      <v-layout column wrap style="max-width: 800px" class="mx-auto">

        <!-- カード0）削除ボタン -->
        <v-flex class="mb-3" align-self-end>
          <v-btn v-bind="getButtonStatus()" color="red" @click="deleteEvent">イベントを削除する</v-btn>
        </v-flex>
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
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn :disabled="isUpdateProcessing" @click="submit" color="purple darken-4 white--text">更新</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>



<script>
import SerchMap from './SearchMap'        //地図表示
import DatePickView from './DatePickView' //カレンダー
import EventDescription from './EventDescription'
import CommonButton from './mixins/CommonButton'

//Axios（APIに使用）
const querystring = require('querystring');

export default {
  mixins: [CommonButton],

  components: {
    SerchMap,     //地図コンポーネント
    DatePickView,
    EventDescription
  },

  data: () => ({
    isUpdateProcessing: false
  }),

  mounted() {
    // refsを参照しているので、子コンポーネントが生成された後にclearは参照できる
    // createdではなくmountedにやる
    //this.clear();
    let latlng = {
      lat: this.$store.getters.storeLatitude,
      lng: this.$store.getters.storeLongitude
    };
    if (latlng.lat !== "" || latlng.lng !== "") {
      this.$refs.search_map.zoomSelectManualMarker(latlng);
    } else {
      this.$refs.search_map.clearMarker();
    }
  },


  methods: { 
    //表示データを登録する
    submit () {
      this.isUpdateProcessing = true;
      // 参加候補日をvuexに追加
      this.$refs.date_pick_view.provideEventAddDays();
      // 削除候補日をvuexに追加
      this.$refs.date_pick_view.provideEventDelDays();
      // 検証
      this.$refs.event_description.$validator.validateAll()
      .then((result) => {
        // 入力エラーあり
        if (result === false) {
          alert("不適切な項目があるため、入力項目を見直してください。");
          this.isUpdateProcessing = false;
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
        'http://nikujaga.mybluemix.net/event/update', 
        querystring.stringify({
          id: this.$store.getters.eventId,
          rev: this.$store.getters.eventRev,
          eventName: this.$store.getters.eventName,
          eventMemo: this.$store.getters.eventMemo,
          eventAddDays: this.$store.getters.eventAddDays.join(","),
          eventDelDays: this.$store.getters.eventDelDays.join(","),
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

          eventHistoryMap[event_id] = {
            id: event_id,
            eventName: this.$store.getters.eventName,
            eventTempDays: this.$refs.date_pick_view.eventTempDays
          };

          this.$localStorage.set("eventHistoryMap", eventHistoryMap);
          
          this.$store.dispatch("setEventHistoryMap", {
            eventHistoryMap: eventHistoryMap
          });

          this.isUpdateProcessing = false;
          this.$router.push('/ReferEvent/' + event_id);
        }
      )
      .catch(function (error) {
          this.isUpdateProcessing = false;
          alert(error);

      });
    },

    deleteEvent() {
      this.isLoading = true;
      let vm = this;
      //APIで登録データをポストする
      this.$axios.post(
        'http://nikujaga.mybluemix.net/event/delete', 
        querystring.stringify({
          id: this.$store.getters.eventId,
          rev: this.$store.getters.eventRev,
        })
      )
      .then(
        response => {

          if (response.data.ok === false) {
            alert(response.data.errors);
            alert("hoge");
            vm.isLoading = false;
            return;
          }

          let event_id = response.data.id;
          let eventHistoryMap = Object.assign({}, this.$store.getters.eventHistoryMap);
          delete eventHistoryMap[event_id];

          vm.$localStorage.set("eventHistoryMap", eventHistoryMap);
          
          vm.$store.dispatch("setEventHistoryMap", {
            eventHistoryMap: eventHistoryMap
          });

          vm.$router.push('/');
          vm.isLoading = false;
        }
      )
      .catch(function (error) {
          alert(error);
          vm.isLoading = false;
      });
    }

  },

}
</script>


<style scooped>
.footer{
  background:rgba(0,0,0,0.3)
}
</style>
