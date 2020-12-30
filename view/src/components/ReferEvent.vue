
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
            <SerchMap ref="search_map"/>
          </v-card>
        </v-flex>

        <!--カード４）テスト：フッターに地図が隠れちゃうから残してる。後でなんとかする。-->
        <!-- <v-flex xs12 sm12 md10 lg7 class="mx-auto">
          <v-card>
            <v-toolbar>
            </v-toolbar>
          </v-card>
        </v-flex> -->
        <v-flex>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1">イベントの候補日</v-toolbar>
          </v-card>
        </v-flex>

      </v-layout>
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <!-- <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn @click="clear">クリア</v-btn>
            <v-btn @click="submit" color="purple darken-4 white--text">登録</v-btn>
          </v-flex>
        </v-layout>
      </v-footer> -->

  </v-container>
</template>


<script>
import SerchMap from './SearchMap'        //地図表示
// import DatePickView from './DatePickView' //カレンダー
import EventDescription from './EventDescription'



export default {
  components: {
    SerchMap,     //地図コンポーネント
  // DatePickView,
    EventDescription
  },

  data: () => ({
  }),

  watch: {
    // パラメータの変更を検知する
    // /ReferEvent?id=xxxの形式にすると、v-list-tileのtoですべて同じ宛先のものがハイライトされてしいまう。
    // そのため、/ReferEvent/:idの形式にする。
    // 同じルーティングルールの場合は、vueのコンポーネントの更新が行われないため（使いまわされる）、変更を検知する
    $route(to, from){
      console.log("to:", to, "from:",from);
      let event_id = to.params.id;
      this.get(event_id);
    }
  },

  created() {
    let event_id = this.$route.params.id;
    this.get(event_id);
  },

  methods: {
    get(event_id) {
      let vm = this;
      this.$axios.get(
        'http://nikujaga.mybluemix.net/event/get',
        {
          params: {
            id: event_id
          }
        }
      )
      .then(function (response) {
        if (response.data["ok"] !== void 0 && response.data["ok"] === false) {
          alert("選択されたイベントはすでに削除/変更され、参照できません");
        } else {
          vm.$store.dispatch("setEvent", {
            event: response.data
          });
        }
      }) 
      .catch(function (error) {
        alert(error);
      });
    }
  }
}
</script>


<style scoped>

</style>