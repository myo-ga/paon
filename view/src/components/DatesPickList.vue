<template>

    <v-list two-line>
        <template v-for="(dates, i) in dates">
            <v-list-tile v-bind:key="i">
                <v-list-tile-content>
                    <DatePicker :num="i" @date-input="dateInput"/>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn flat icon v-if="i<=dates.length" @click="deleteDate(i)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </template>
    </v-list>
</template>


<script>
import DatePicker from "./DatePickModal"

    export default {
        data: () => ({
            dates: ['']
        }),
        methods: {
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

