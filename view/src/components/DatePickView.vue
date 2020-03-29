<template>
  <v-container>
    <v-layout row wrap class="pa-3" justify-center>

      <v-flex shrink class="my-3" >
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
          <template v-for="(datetime, i) in datetimes" >
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
                        v-bind:value="datetime.str"
                        prepend-icon="schedule" readonly
                        style = "width: 300px"
                        v-on="on"></v-text-field>
                    </template>
                    <v-time-picker 
                      v-model="times[i]"
                      format="24hr"
                      @input="menu[i]=false;">
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
    dates:[],
    times:[],
    datetimes:[],
    datetime: '',
    menu: [],
  }),

  component: {
  },

  mounted() {
    //vuexからdatetimesを読み込み
    var datetimes = this.$store.state.dates;
    
    // datesとtimesを初期化 
    var dates = [];
    var times = [];

    for(var i = 0; i < datetimes.length; i++){
      var val = datetimes[i].split(' ');
      dates.push(val[0]);
      times.push(val[1]);
    }
    // this.datesとthis.timesを更新
    this.dates = dates.concat();
    this.times = times.concat();
  },

  watch: {
    dates: function(val) {
      //日付5件より多ければpopする
      if (val.length > DATESNUM) {this.$nextTick(() => val.pop());}
      else {this.updateDatetimes();}
    },
    times: function() {
      this.updateDatetimes();
    },
  },

  methods: {
    updateDatetimes(){
      this.datetimes = [];
      var r = [];
      for(var i = 0; i < this.dates.length; i++){
        var dt = this.dates[i]
        var tm = this.times[i] ? this.times[i] : DEFTIME;
        var dttm = this.formatDate(dt, tm);

        // datetimes更新用
        this.datetimes.push({date: dt, time: tm, str: dttm});

        // vuex更新用
        r.push(dt+' '+tm);
      }

      //vuex更新
      this.$store.commit('datesSelect', {dates: r});
    },
    
    formatDate (date, time) {
      const [YYYY, M, D] = date.split('-');
      var dayofweek = ["日","月","火","水","木","金","土"][new Date(date).getDay()];

      var str = '';
      if(time){
        const [h, mm] = time.split(':');
        str = Number(h)+':'+mm;
      }
      return YYYY+'年'+Number(M)+'月'+Number(D)+'日（'+dayofweek+'）　'+str;
    },

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