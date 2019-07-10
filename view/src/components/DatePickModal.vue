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
        <v-date-picker 
          v-model="date" 
          color="teal" 
          locale="ja-JP"
          :day-format="date => new Date(date).getDate()">
          <v-spacer></v-spacer>
          <v-btn flat color="grey" @click="menu=false;">キャンセル</v-btn>
          <v-btn flat color="primary" @click="saveModal">
              OK</v-btn>
        </v-date-picker>
    </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      date: new Date().toISOString().substr(0, 10),
      modal: false
    }),
    method: {
      saveModal(){
        $root.dialog.save(date);
      }
    }
  }
</script>