<template>
  <v-container>
    <v-layout justify-center>
    <button 
        @click="$refs.dPicker.open()"
        >parent button</button>
    <DatePicker 
        ref="dPicker" 
        @date-input="dateInput"/>
    </v-layout>
  </v-container>
</template>


<script>
import DatePicker from "./DatePickModal2"

    export default {
        data: () => ({
            dates: ['']
        }),
        methods: {
            openDatePicker(){
                this.$refs.dPicker.open();
            },
            deleteDate: function(i) {
                this.dates.splice(i,1);
            },
            addDate: function(){
                this.dates.push('');
            },
            dateInput: function(date,nm){
                this.dates[nm]=date;
                if(nm >= this.dates.length-1){
                    this.addDate();
                }
            }
        },
        components: {
            DatePicker
        }
    }
</script>

