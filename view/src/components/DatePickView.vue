<template>
  <v-container>
    <v-layout row reverse wrap class="pa-3">

      <v-flex shrink class="my-3" style="max-width: 400px;">
        <!--日付選択用カレンダー-->
        <v-date-picker
            v-model="dates"
            locale="ja-JP" 
            :day-format="date => new Date(date).getDate()" 
            class="picker" color="teal"
            no-title full-width multiple>
        </v-date-picker>
      </v-flex>

      <v-flex shrink class="my-3">
        <!--選択された数だけ日付をリスト表示-->
        <v-list style="max-height: 300px;">
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
        </v-list>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>

const DEFTIME = '';
const DATESNUM = 5;

export default {  
  data: () => ({
    datetime: '',
    menu: [],
  }),

  computed: {
    //vuexわけわからん
    datetimes:{
      get(){return this.$store.state.dates;},
      set(val){this.$store.commit('dates', val)}
    },

    datetimesStr:{
      get(){
        // datetimesからdatetimeObjを生成
        var datetimesStr = [];
        for(var i = 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          datetimesStr.push(this.formatDate(val[0], val[1]));
        }
        return datetimesStr;
      }
    },

    dates:{
      get(){
        var dates = [];
        for(var i= 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          dates.push(val[0]);
        }
        return dates;
      },
      set(val){
        if (val.length > DATESNUM) {this.$nextTick(() => val.pop());}
        else {
          var datetimes = [];
          for(var i = 0; i < val.length; i++){
            var dt = val[i]
            var tm = this.times[i] ? this.times[i] : DEFTIME;
            datetimes.push(dt+' '+tm);
          }
          this.datetimes = datetimes.concat();
        }
      }
    },

    //timesは配列の中身をいじるためcomuptedはあきらめる
    //https://qiita.com/clomie/items/7a69ee850a304595142e
    times:{
      get(){
        var times = [];
        for(var i= 0; i < this.datetimes.length; i++){
          var val = this.datetimes[i].split(' ');
          times.push(val[1]);
        }
        return times;
      },
      set(val){
        var datetimes = [];
        for(var i = 0; i < this.dates.length; i++){
          var dt = this.dates[i]
          var tm = val[i] ? val[i] : DEFTIME;
          datetimes.push(dt+' '+tm);
        }
        this.datetimes = datetimes.concat();
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
      //メニューを消す
      this.$set(this.menu,n,false);
      //強制的にtimesを更新（よくない）
      this.times=this.times.concat();
    },

    //画面表示用に日時フォーマットを適用
    formatDate (date, time) {
      const [YYYY, M, D] = date.split('-');
      var dayofweek = ["日","月","火","水","木","金","土"][new Date(date).getDay()];

      var str = '';
      if(time){
        const [h, mm] = time.split(':');
        str = Number(h)+':'+mm;
      }
      return YYYY+'年'+Number(M)+'月'+Number(D)+'日（'+dayofweek+'）　'+str;
    }
  }

};
</script>
 

<style>
.picker {font-size: 120%;}
.picker th {font-size: 100%;}
.v-btn__content {font-size: 150%;}
.v-date-picker-header__value {border-bottom:solid 1px teal;}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(7) {color:teal}
.v-date-picker-table.v-date-picker-table--date > table > thead tr th:nth-child(1) {color:red}
</style>