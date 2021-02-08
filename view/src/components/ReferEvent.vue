
<template>
<!--画面：イベント参照-->

  <v-container>

      <!--カードを縦に並べる-->
      <v-layout column wrap style="max-width: 800px" class="mx-auto">

        <!--カード１）イベント情報登録-->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">あなたのイベント詳細</v-toolbar>
            <EventDescription ref="event_description" :editable="false"/>
          </v-card>
        </v-flex>

        <!--カード２）候補日選択-->
        <!-- <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">候補日を選択してください。</v-toolbar>
            <DatePickView ref="date_pick_view"/>
          </v-card>
        </v-flex> -->

        <!--カード３）地図-->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">イベントの場所</v-toolbar>
            <SerchMap ref="search_map" :editable="false"/>
          </v-card>
        </v-flex>

        <!--カード４）テスト：フッターに地図が隠れちゃうから残してる。後でなんとかする。-->
        <!-- <v-flex xs12 sm12 md10 lg7 class="mx-auto">
          <v-card>
            <v-toolbar>
            </v-toolbar>
          </v-card>
        </v-flex> -->
        <v-flex class="mb-3">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">イベントの候補日</v-toolbar>
            <MemberTable ref="member_table" @selected-member="showMemberAttend"/>
          </v-card>
        </v-flex>

        <!-- カード５）出欠入力 -->
        <!-- TODO: selected_memberNの初期値はnullではなく空文字にしたほうがよい、プロパティで渡し、string型のため -->
        <v-flex v-if="selected_memberN !== null">
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">参加可否を入力する</v-toolbar>
            <MemberAttend :memberN="selected_memberN"/>
          </v-card>
        </v-flex>

      </v-layout>
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn @click="edit" color="purple darken-4 white--text">編集</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>


<script>
import SerchMap from './SearchMap'        //地図表示
// import DatePickView from './DatePickView' //カレンダー
import EventDescription from './EventDescription'
import MemberTable from './MemberTable'
import MemberAttend from './MemberAttend'
import serverurl from '../const/serverurl'


export default {
  components: {
    SerchMap,     //地図コンポーネント
  // DatePickView,
    EventDescription,
    MemberTable,
    MemberAttend
  },

  data: () => ({
    selected_memberN: null
  }),

  watch: {
    // パラメータの変更を検知する
    // /ReferEvent?id=xxxの形式にすると、v-list-tileのtoですべて同じ宛先のものがハイライトされてしいまう。
    // そのため、/ReferEvent/:idの形式にする。
    // 同じルーティングルールの場合は、vueのコンポーネントの更新が行われないため（使いまわされる）、変更を検知する
    $route(to, from){
      console.log("to:", to, "from:",from);
      let event_id = to.params.id;
      this.selected_memberN = null; // 候補者のフォームを消す
      this.get(event_id);
    }
  },

  computed: {
    isClicked: {
      get() {
        // TODO: 名前クリックしてmemberの出欠が変更されるフォーム
        // refs経由では設定できない？vuexを使わないとダメ？
        return true;
        //return this.$refs.member_table.clicked_member != null;
      }
    }
  },

  created() {
    let event_id = this.$route.params.id;
    this.get(event_id);
  },

  methods: {
    get(event_id) {
      // 非同期で結果が帰ってきたとき、リクエスト発行元の画面に位置するかチェック用
      let current_path = this.$router.currentRoute.path;
      let vm = this;
      this.$axios.get(
        serverurl.EVENT_GET_URL,
        {
          params: {
            id: event_id
          }
        }
      )
      .then(function (response) {
        if (response.data["ok"] !== void 0 && response.data["ok"] === false) {
          alert("選択されたイベントはすでに削除/変更され、参照できません");
          
          let eventHistoryMap = Object.assign({}, vm.$store.getters.eventHistoryMap);

          delete eventHistoryMap[event_id];

          vm.$localStorage.set("eventHistoryMap", eventHistoryMap);
          
          vm.$store.dispatch("setEventHistoryMap", {
            eventHistoryMap: eventHistoryMap
          });

          vm.$router.push("/");

        } else {
          // 他画面移動済みであれば何もしない
          if (current_path !== vm.$router.currentRoute.path) {
            console.log("page already moved!!!");
            return;
          }

          // vuexにevent情報設定
          vm.$store.dispatch("setEvent", {
            event: response.data
          });
          // 地図の場所をzoomして設定
          let latlng = {
            lat: response.data.storeLatitude,
            lng: response.data.storeLongitude
          };

          if (latlng.lat !== "" || latlng.lng !== "") {
            // TODO: バグ。getメソッド呼び出した後、ここが呼ばれず画面遷移すると、
            // そのときにはserach_mapのコンポーネントは破棄されているので、zoomSelectManualMarkerは呼べない
            // →解決
            vm.$refs.search_map.zoomSelectManualMarker(latlng);
          } else {
            vm.$refs.search_map.clearMarker();
          }
        }
      }) 
      .catch(function (error) {
        alert(error);
      });
    },

    edit() {
      let event_id = this.$store.getters.eventId;
      this.$router.push('/UpdateEvent/' + event_id);
    },

    showMemberAttend(memberN) {
      this.selected_memberN = memberN;
    }

  }
}
</script>


<style scoped>

</style>