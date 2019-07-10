<template>

    <v-list two-line>
        <template v-for="(dates, i) in dates">
            <v-list-tile v-bind:key="i">
                <v-list-tile-content>
                    <DatePicker :num="i+1" v-on:date-input="dateInput"/>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn flat icon v-if="i>0" v-on:click="deleteDate(i)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </template>
    </v-list>
    <!--デバッグ用 v-text-field v-bind:label="dates+' '"></v-text-field-->

</template>


<script>
import DatePicker from "./DatePickMenu"

    export default {
        data: () => ({
            dates: [''],
            index: 0
        }),
        methods: {
            deleteDate: function(i) {
                this.dates.splice(i, 1);
            },
            addDate: function(){
                this.dates.push('');
            },
            dateInput: function(date,nm){
                this.dates[nm-1]=date;
                if(this.dates.length < 5){
                    this.addDate();
                }
            }
        },
        components: {
            DatePicker
        }
    }
</script>

