<template>
  <v-container>
    <v-layout row reverse wrap fill-height>

      <v-flex class="my-3" style="max-width: 350px;">
        <!--日付選択用カレンダー-->
        <v-date-picker
            v-model="dates"
            locale="ja-JP" 
            :day-format="date => new Date(date).getDate()" 
            class="picker" color="teal"
            no-title full-width multiple>
        </v-date-picker>
      </v-flex>

      <v-flex class="my-3 mr-3">
        <!--選択された数だけ日付をリスト表示-->
        <v-card height=100%>
          <template v-if="datetimesStr.length == 0">
            <div style="width: 100%; height: 100%; display: table; color: #8f8f8f">
              <div style="display: table-cell; text-align: center; vertical-align: middle;">
                日付を選択してください
              </div>
            </div>
          </template>
          <template v-else>
            <v-list>
              <template v-for="(datetime, i) in datetimesStr">

                <v-list-tile :key="i">
                  <v-dialog
                  v-model="dialog"
                  width="290px"
                  >
                    <!-- デフォルトで表示する内容 -->
                    <template v-slot:activator="{ on }">
                      <!-- v-list-tileのpaddingに0を設定したいが、できないため、クラス経由でpadding0にする -->
                      <v-list-tile class="my-v-list-tile" style="width:100%;" v-on="on" >
                        <v-icon style="padding-right: 10px">timer</v-icon>
                        <v-list-tile-content>
                          {{datetime}}
                        </v-list-tile-content>  
                      </v-list-tile>
                      <!-- 削除ボタン v-list-tileに含めない。含めるとボタン押下とメニューの押下がバグで連動してしまうため -->
                      <v-btn icon @click="deletedatetimes(i)" style="margin: 0">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </template>

                    <!-- メニュークリック時に展開する内容 -->
                    <v-time-picker 
                      format="24hr"
                      v-model="tmp_time"
                      full-width
                      >
                    <!-- <v-time-picker 
                      format="24hr"
                      v-model="times[i]"
                       @click:minute="setTimes(i)"
                      full-width
                    > -->
                      <v-btn style="margin-left: auto; margin-right: 10px;" @click="setTimeX">OK</v-btn>
                      <v-btn style="margin-left: 10; margin-right: auto " @click="discardTimes(i)">キャンセル</v-btn>
                    </v-time-picker>
                  </v-dialog>


                </v-list-tile>
                
              </template>
            </v-list>
          </template>
          <!-- <v-list>
            <template v-for="(datetime, i) in datetimesStr" >
              <v-list-tile :key="i">
                <v-list-tile-action>
                  <v-menu
                    v-model="menu[i]"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy offset-y
                    transition="scale-transition"
                    full-width min-width="290px">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-bind:value="datetime"
                          prepend-icon="schedule" readonly
                          style = "width: 300px"
                          v-on="on"></v-text-field>
                      </template>
                      <v-time-picker 
                        v-model="times[i]"
                        format="24hr"
                        @click:minute="setTimes(i)">
                      </v-time-picker>
                  </v-menu>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list> -->
        </v-card>
        <!-- <v-list style="max-height: 300px;">
          <v-subheader>候補日リスト</v-subheader>
          <template v-for="(datetime, i) in datetimesStr" >
            <v-list-tile :key="i">
              <v-list-tile-action>
                <v-menu
                  v-model="menu[i]"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy offset-y
                  transition="scale-transition"
                  full-width min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-bind:value="datetime"
                        prepend-icon="schedule" readonly
                        style = "width: 300px"
                        v-on="on"></v-text-field>
                    </template>
                    <v-time-picker 
                      v-model="times[i]"
                      format="24hr"
                      @click:minute="setTimes(i)">
                    </v-time-picker>
                </v-menu>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list> -->
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>

const DEFTIME = '';
const DATESNUM = 5;

export default {  
  data: () => {
    return {
      datetime: '',
      menu: [],
      test_x: [],
      dialog: false,
      tmp_time: null
    }
  },
  
  // () => ({
  //   datetime: '',
  //   menu: [],
  // }),

  computed: {
    //vuexわけわからん
    datetimes:{
      get() {
        return this.$store.state.eventDays;
      },
      set(val) {
        this.$store.dispatch('setEventDays', {eventDays: val});
        //this.$store.commit("datetimes", val);
      }
      // get(){return this.$store.state.dates;},
      // set(val){this.$store.commit('dates', val)}
    },

    datetimesStr:{
      get(){
        // datetimesからdatetimeObjを生成
        var datetimesStr = [];
        for(var i = 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          var date = val[0];
          var time = val[1];
          datetimesStr.push(this.formatDate(date, time));
        }
        return datetimesStr;
      }
    },

    dates:{
      get(){
        var dates = [];
        for(var i= 0; i < this.datetimes.length; i++){
          // datetimes= ['yyyy-mm-dd hh:mm', 'yyyy-mm-dd', ...]
          var val = this.datetimes[i].split(' ');
          dates.push(val[0]);
        }
        console.log("dates get", val);
        return dates;
      },
      set(val){
        if (val.length > DATESNUM) {this.$nextTick(() => val.pop());}
        else {
          var datetimes = [];
          for(var i = 0; i < val.length; i++){
            var dt = val[i]
            var tm = this.times[i] ? this.times[i] : DEFTIME;
            datetimes.push(dt+' '+tm); // '2020-12-01 ' 末尾にスペース入る
          }
          this.datetimes = datetimes.concat();
          console.log("dates set", val);
        }
      }
    },

    //timesは配列の中身をいじるためcomuptedはあきらめる
    //https://qiita.com/clomie/items/7a69ee850a304595142e
    // 配列のindexアクセスに対ししてv-modelではsetter/getterでアクセス不可
    // https://qiita.com/clomie/items/7a69ee850a304595142e
    times:{
      get(){
        var times = [];
        for(var i= 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          times.push(val[1]);
        }
        console.log("times get", times);
        return times;
      },
      set(val){
        console.log("times set", val);
        var datetimes = [];
        for(var i = 0; i < this.dates.length; i++){
          var dt = this.dates[i]
          var tm = val[i] ? val[i] : DEFTIME;
          datetimes.push(dt+' '+tm);
        }
        this.datetimes = datetimes.concat(); // deep copy
      }
    }
  },

  watch: {
   // dates: function(val) {
   //   //日付5件より多ければpopする
   //   if (val.length > DATESNUM) {this.$nextTick(() => val.pop());}
   // }
  },

  methods: { 

    setTimes(n){
      console.log("setTime", n);
      //メニューを消す
      this.$set(this.menu,n,false);
      //強制的にtimesを更新（よくない）
      this.times=this.times.concat();
    },

    setTimeX() {
      console.log("setTimeX ", this.tmp_time);
      this.dialog = false;
    },

    //画面表示用に日時フォーマットを適用
    // date: 'yyyy-mm-dd' 例：2020-01-01
    // time: 'hh:mm' 例：01:01
    formatDate (date, time) {
      const [YYYY, M, D] = date.split('-');
      var dayofweek = ["日","月","火","水","木","金","土"][new Date(date).getDay()];
      var str = '';
      if(time) {
        const [h, mm] = time.split(':');
        str = h + ':' + mm ;
      }
      return YYYY + '年' + M +'月'+ D +'日（'+dayofweek+'）'+ str;
    },

    deletedatetimes(index) {
      let new_datetimes = [];
      for (let i = 0; i < this.datetimes.length; i++) {
        if (i == index) {
          continue;
        }
        new_datetimes.push(this.datetimes[i]);
      }
      this.datetimes = new_datetimes.concat();
    },

    discardTimes(index) {
      let a = index;
      if (a == 11) {
        return;
      }
    },
    
    showAlart() {
      alert("This is alart!");
    }
  }

};
</script>
 

<style>
.picker {font-size: 120%;}
.picker th {font-size: 100%;}
/* .v-btn__content {font-size: 150%;} */
.v-date-picker-header__value {border-bottom:solid 1px teal;}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(7) {color:teal}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(1) {color:red}
.my-v-list-tile .v-list__tile  {
  padding-right: 0;
  padding-left: 5px;
}
</style>