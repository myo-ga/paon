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
            <v-list>
              <v-subheader>候補日リスト</v-subheader>
              <template v-for="(datetime, i) in datetimes" >
                <v-list-tile :key="i">

                  <v-list-tile-action>
                    <!--日にち-->
                    <v-menu
                      v-model="datemenu[i]"
                      :nudge-right="40"
                      lazy offset-y
                      transition="scale-transition"
                      full-width min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="datetime.date"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          style="max-width: 150px;"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                          v-model="datetime.date"
                          locale="ja-JP" 
                          :day-format="date => new Date(date).getDate()" 
                          color="teal" class="picker" 
                          @input="datemenu[i]=false">
                      </v-date-picker>
                    </v-menu>
                  </v-list-tile-action>

                  <!--時刻-->
                  <v-list-tile-action>
                    <v-menu
                      v-model="timemenu[i]"
                      :nudge-right="40"
                      lazy offset-y
                      transition="scale-transition"
                      full-width min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="datetime.time"
                          readonly
                          v-on="on"
                          style="max-width: 100px;"
                        ></v-text-field>
                      </template>
                      <v-time-picker 
                        v-model="datetime.time"
                        format="24hr"
                        @input="timemenu[i]=false">
                      </v-time-picker>
                    </v-menu>
                  </v-list-tile-action>

                </v-list-tile>
              </template>
            </v-list>
        </v-flex>

        <v-flex shrink class="my-3">
          <!--選択された数だけ日付をリスト表示-->
            <v-list style="max-height: 300px;">
              <v-subheader>候補日リスト</v-subheader>
              <template v-for="(datetime, i) in datetimes" >
                <v-list-tile :key="i">
                  <!--時刻-->
                  <v-list-tile-action>
                    <v-menu
                      v-model="timemenu[i]"
                      :nudge-right="40"
                      lazy offset-y
                      transition="scale-transition"
                      full-width min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-bind:value="datetime.date +' '+ datetime.time"
                          prepend-icon="schedule"
                          readonly
                          v-on="on"
                          style="max-width: 200px;"
                        ></v-text-field>
                      </template>
                      <v-time-picker 
                        v-model="datetime.time"
                        format="24hr"
                        @input="timemenu[i]=false">
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
    datetime: '',
    datemenu: [],
    timemenu: [],
  }),

  component: {
  },

  computed:{
    datetimes: function(){
      var ary = [];
      for(var i = 0; i < this.dates.length; i++){
        var time = DEFTIME;
        if(this.times[i]) time = this.times[i];
        ary.push({date:this.dates[i], time:time});
      }
      return ary
    }
  },

  created(){
    for(var i = 0; i < DATESNUM; i++){
      this.datemenu.push(false);
      this.timemenu.push(false); 
    }
  },

  mounted() {
    this.dates = this.$store.state.dates; //日付
  },

  watch: {
    dates(val) {
      this.$store.commit(
        'datesSelect', {
          dates: this.dates,
      });
        
      //日付は5件まで
      if (val.length > 5) {
        this.$nextTick(() => val.pop())
      }
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