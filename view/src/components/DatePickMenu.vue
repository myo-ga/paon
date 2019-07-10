<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="0"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        v-bind:label="'日付'+num"
        prepend-icon="event"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      locale="ja-JP" 
      :day-format="date => new Date(date).getDate()" 
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    props:['num'],
    data: () => ({
      date: new Date().toISOString().substr(0, 10),
      labelnum: "日付"+this.num,
      menu: false,
      result: false
    }),
    methods: {
      save (date) {
        this.$refs.menu.save(date);
        this.$emit('date-input', this.date, this.num);
      }
    }
  }
</script>

