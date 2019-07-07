<template>
<div>
    <v-list two-line>
        <template v-for="(dates, i) in dates">
            <v-list-tile v-bind:key="i">
                <v-list-tile-content>
                    <DatePicker/>
                </v-list-tile-content>
                <!--v-list-tile-action>
                    <v-btn flat icon v-on:click="deleteDate(i)">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-list-tile-action-->
            </v-list-tile>
        </template>
    </v-list>
    <div class="bittom-right">
        <v-btn dark color="primary" v-on:click="addDate(i)">
            日付を追加する
        </v-btn>
    </div>
</div>
</template>


<script>
import DatePicker from "./DatePickModal"

    export default {
        data: () => ({
            dates: ['']
        }),
        methods: {
            deleteDate(i) {
                this.dates.splice(i, 1);
            },
            addDate(i){
                this.dates.push("日付を追加する");
            }
        },
        components: {
            DatePicker
        }
    }
</script>

