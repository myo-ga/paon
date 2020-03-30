<template>
  <v-container>
    <v-layout row wrap class="pa-3" justify-center>
        <v-flex shrink class="my-3" style="max-width: 300px">

            <!--日付選択用カレンダー-->
            <!--ToDo：TimePickerで時刻も選択できるようにする-->
            <v-date-picker
                v-model="dates"
                color="teal"
                locale="ja-JP" 
                :day-format="date => new Date(date).getDate()" 
                class="picker" 
                no-title multiple>
            </v-date-picker>

        </v-flex>

        <v-flex shrink class="my-3">
            <!--選択された数だけ日付をリスト表示-->
            <v-list style="max-height: 300px;">
                <v-subheader>候補日リスト</v-subheader>
                <template v-for="(datetime, i) in datetimes" >
                    <v-list-tile :key="i">
                        <v-list-tile-action>
                            <v-icon color="teal">calendar_today</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="datetime"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider v-if="i+1 < datetimes.length" :key="i"></v-divider>
                </template>
            </v-list>
        </v-flex>

    </v-layout>
  </v-container>
</template>


<script>

const deftime = '19:00';

export default {  
  data: () => ({
    dates:[],
    times:[],
    datetime: '',
  }),

  component: {
  },
  
  computed:{
    datetimes: function(){
      var ary = [];
      for(var i = 0; i < this.dates.length; i++){
        var time = deftime;
        if(this.times[i]) time = this.times[i];
        ary.push(this.dates[i] + " " + time);
      }
      return ary
    }
  },

  mounted() {
    this.dates = this.$store.state.dates;       //日付
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