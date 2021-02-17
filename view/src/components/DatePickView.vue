<template>
  <v-container>
    <v-layout row reverse wrap fill-height>

      <!--日付選択用カレンダー-->
      <v-flex class="my-3" style="max-width: 350px;">
        <v-date-picker
            v-model="dates"
            locale="ja-JP" 
            :day-format="date => new Date(date).getDate()" 
            class="picker" color="teal"
            no-title full-width multiple>
        </v-date-picker>
      </v-flex>

      <!-- 選択日付リスト -->
      <v-flex class="my-3 mr-3">
        <v-card height=100%>

          <!-- 選択数0の場合：日付選択を促すメッセージ表示 -->
          <template v-if="datetimesStr.length == 0">
            <div style="width: 100%; height: 100%; display: table; color: #8f8f8f">
              <div style="display: table-cell; text-align: center; vertical-align: middle;">
                日付を選択してください
              </div>
            </div>
          </template>

          <!-- 選択数1以上：選択された日付のリスト表示 -->
          <template v-else>
            <v-list>
              <template v-for="(datetime, i) in datetimesStr">
                <v-list-tile :key="i">
                  <!-- v-list-tileのpaddingに0を設定したいが、できないため、クラス経由でpadding0にする -->
                  <v-list-tile
                  class="my-v-list-tile"
                  style="width:100%;"
                  @click="openDialog(i)">
                    <v-icon style="padding-right: 10px">timer</v-icon>
                    <v-list-tile-content>
                      {{datetime}}
                    </v-list-tile-content>  
                  </v-list-tile>
                  <!-- 削除ボタン v-list-tileに含めない。含めるとボタン押下とメニューの押下がバグで連動してしまうため -->
                  <v-btn icon @click="deleteDatetimes(i)" style="margin: 0">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile>
              </template>
            </v-list>
            
            <!-- 時刻選択をする時計のダイアログ -->
            <v-dialog
            v-model="dialog"
            width="290px"
            >
              <v-time-picker 
              format="24hr"
              v-model="picker_time"
              full-width
              ref="v_time_picker"
              >
                <v-btn style="margin-left: auto; margin-right: 10px;" @click="()=>{setSelectedTimes();closeDialog()}">OK</v-btn>
                <v-btn style="margin-left: 10; margin-right: auto " @click="closeDialog">キャンセル</v-btn>
              </v-time-picker>
            </v-dialog>

          </template>
        </v-card>

      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>

const DEFTIME = '18:00';
const DATESNUM = 5;

export default {  
  data: () => {
    return {
      dialog: false,
      selected_date_index: 0,
      picker_time: null,
      eventTempDays: []
    }
  },
  
  created() {
    for (let dayN in this.$store.getters.eventDays) {
      this.eventTempDays.push(this.$store.getters.eventDays[dayN]);
    }
  },

  computed: {
    //vuexわけわからん
    datetimes:{
      get() {
        //return this.$store.state.eventAddDays;
        return this.eventTempDays;
      },
      set(val) {
        //this.$store.dispatch('setEventAddDays', {eventAddDays: val});
        this.eventTempDays = val;
      }
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
        // console.log("dates get", dates);
        return dates;
      },
      set(val){
        if (val.length > DATESNUM) {this.$nextTick(() => val.pop());}
        else {
          var datetimes = [];
          for(var i = 0; i < val.length; i++){
            var dt = val[i]
            var tm = this.times[i] ? this.times[i] : DEFTIME;
            datetimes.push(dt+' '+tm); // '2020-12-01' + ' ' + '18:00'
          }
          this.datetimes = datetimes.concat();
          // console.log("dates set", datetimes);
        }
      }
    },

    // timesは配列の中身をいじるためcomuptedはあきらめる
    // 配列のindexアクセスに対してv-modelではsetter/getterでアクセス不可
    // https://qiita.com/clomie/items/7a69ee850a304595142e
    times:{
      get(){
        var times = [];
        for(var i= 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          times.push(val[1]);
        }
        // console.log("times get", times);
        return times;
      },
      set(val){
        // console.log("times set", val);
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


  methods: { 

    // 画面表示用に日時フォーマットを適用
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

    deleteDatetimes(index) {
      let new_datetimes = [];
      for (let i = 0; i < this.datetimes.length; i++) {
        if (i == index) {
          continue;
        }
        new_datetimes.push(this.datetimes[i]);
      }
      this.datetimes = new_datetimes.concat();
    },

    openDialog(index) {
      // 選択された日付のインデックスを保存
      // ダイアログOK時に指定インデックスの時刻を更新するため
      this.selected_date_index = index;
      // 選択された日付に設定済みの時刻をダイアログの時刻に設定
      this.picker_time = this.times[index];
      // ダイアログを開く
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      // TimePickerをhourの選択に戻す
      // TimePickerはminute選択後、dialogで再度TimePickerを開くとminuteが選択されたままであるため
      //
      // hour/minuteの選択するにはv-time-picker-titleにupdate:selectingイベントを発生させる必要がある
      // hour(1)、minute(2)をイベント時に指定する
      //
      // vuetifyではv-time-pickerをタグ（コンポーネント）として提供しているが、
      // v-time-picker-titleを直接的に操作できないので、$refsでコンポネントに階層的にアクセスすることで操作する.
      // v-time-picker-titleまでの階層は下記のようになる
      //
      // v-time-picker
      // └---v-picker
      //      └---v-time-picker-title
      //      ├---transition
      //      ├---v-time-picker-clock
      this.$refs.v_time_picker.$children[0].$children[0].$emit("update:selecting", 1);
    },

    setSelectedTimes() {
      let times = this.times;
      times[this.selected_date_index] = this.picker_time;
      this.times = times.concat();
    },

    clear() {
      this.datetimes = [];
      this.selected_date_index = 0;
    },

    // 仮の候補日から追加候補日を抽出
    provideEventAddDays() {
      let ret = [];
      for (let datetime of this.eventTempDays) {
        let is_found = false;
        for (let dayN in this.$store.getters.eventDays) {
          if (datetime == this.$store.getters.eventDays[dayN]) {
            is_found = true;
            break;
          }
        }
        if (!is_found) {
          ret.push(datetime);
        }
      }
      this.$store.dispatch('setEventAddDays', {eventAddDays: ret});
    },

    // 仮の候補日から削除日を抽出
    provideEventDelDays() {
      let ret = [];
      for (let dayN in this.$store.getters.eventDays) {
        let is_found = false;
        for (let datetime of this.eventTempDays) {
          if (this.$store.getters.eventDays[dayN] == datetime) {
            is_found = true;
            break;
          }
        }
        if (!is_found) {
          ret.push(dayN);
        }
      }
      this.$store.dispatch('setEventDelDays', {eventDelDays: ret});
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