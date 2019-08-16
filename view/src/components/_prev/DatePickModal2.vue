<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        full-width
        width="400px"
    >
      <v-date-picker
        ref="picker"
        class="picker"
        v-model="date"
        color="teal"
        full-width
        locale="ja-JP" 
        :day-format="date => new Date(date).getDate()" 
        @input="save"
      ></v-date-picker>
    </v-dialog>
</template>


<script>
  export default {
    props: {num: Number},
    data: () => ({
      date: new Date().toISOString().substr(0, 10),
      modal: false
    }),
    methods: {
      open(){
        this.modal=true;
      },
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