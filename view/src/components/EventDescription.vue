<template>
  <v-container>
    <v-layout column justify-center>
      <v-flex class="mx-3">
        <v-text-field
          label="イベント名"
          v-model="eventName"
          v-validate="'required|max:25'" :counter="25" :error-messages="errors.first('eventName')"
          data-vv-name="eventName"
          data-vv-as="イベント名"
          :disabled="!editable"
        >
        </v-text-field>
      </v-flex>
      <v-flex class="mx-3">
        <v-textarea
          label="イベントの説明"
          v-model="eventMemo"
          v-validate="'max:120'" :counter="120" :error-messages="errors.first('eventMemo')"
          data-vv-name="eventMemo"
          data-vv-as="イベントの説明"
          rows="10"
          row-height="35"
          full-width solo
          :disabled="!editable"
          >
        </v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

Vue.use(VeeValidate, {
  locale: "ja",
  dictionary: {
    "ja": ja
  }
})


export default {

  computed: {
    eventName: {
      get() {return this.$store.getters.eventName},
      set(val) {this.$store.dispatch("setEventName", {eventName: val});}
    },
    eventMemo: {
      get() {return this.$store.getters.eventMemo},
      set(val) {return this.$store.dispatch("setEventMemo", {eventMemo: val});}  
    }
  },

  methods: {
    clear () {
      this.eventName = "";
      this.eventMemo = "";
      this.$validator.reset();
    }
  },

  props: {
    // 編集可能であるか（登録画面/参照画面で切り替えのため）
    editable: {
      type: Boolean,
      default: true
    }
  }
}
</script>



<style scoped>

</style>
