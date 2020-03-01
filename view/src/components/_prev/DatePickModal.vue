<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        lazy
        full-width
        width="400px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="date"
          v-bind:label="'日付'+(num+1)"
          prepend-icon="event"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        ref="picker"
        class="picker"
        v-model="date"
        color="teal"
        full-width
        locale="ja-JP" 
        :day-format="date => new Date(date).getDate()" 
        @change="save"
      ></v-date-picker>
    </v-dialog>
</template>

<script>
  export default {
    props:{num: Number, inputDate: Date},
    data: () => ({
      date: inputDate,
      dialog: false
    }),
    methods: {
      save (date) {
        this.$refs.dialog.save(date);
        this.$emit('date-input', this.date, this.num);
      }
    }
  }
</script>

<style scooped>
.picker {
  font-size: 120%;
}
.picker th {
  font-size: 120%;
}
.v-btn__content {
  font-size: 150%;
}
</style>