<template>
    <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
    >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="日付"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" color="teal">
          <v-spacer></v-spacer>
          <v-btn flat color="grey" @click="modal = false">キャンセル</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      date: new Date().toISOString().substr(0, 10),
      modal: false
    })
  }
</script>