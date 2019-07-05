<template>
  <v-container>
  <form>
    <v-text-field
      v-model="name"
      v-validate="'required|max:10'"
      :counter="10"
      :error-messages="errors.collect('name')"
      label="イベント名"
      data-vv-name="name"
      required
    ></v-text-field>

    <v-menu
        ref="nowMenu"
        v-model="nowMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="now"
        transition="scale-transition"
        min-width="290px"
        lazy
        offset-y
        full-width
    >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="now"
            label="Today"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="picker"
            :first-day-of-week="0"
            locale="ja-JP"
            color = "teal"
        >
        </v-date-picker>
    </v-menu>

    
    <v-btn @click="submit">登録</v-btn>
    <v-btn @click="clear">クリア</v-btn>
  </form>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

Vue.use(VeeValidate)

export default {
    $_veeValidate: {
        validator: 'new'
    },
    data: () => ({
        name: '',
        dictionary: {
            custom: {
                name: {
                    required: () => '必ず入力してください',
                    max: '255文字まで入力可能です。'
                }
            }
        },
        picker: new Date().toISOString().substr(0, 10)

    }),
    mounted () {
        this.$validator.localize('ja', this.dictionary)
    },
    methods: {
        submit () {
          this.$validator.validateAll()
        },
        clear () {
          this.name = ''
          this.$validator.reset()
        }
    }
}
</script>

<style scoped>
  .feature-pane {
    position: relative;
    padding-top: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }

  .day-header {
    margin: 0px 2px 2px 2px;
    padding: 2px 6px;
    background-color: teal;
    color: #ffffff;
    border: 1px solid teal;
    border-radius: 2px;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .day-body {
    position: absolute;
    top: 400px;
    height: 36px;
    margin: 2px;
    padding: 2px 6px;
    background-color: teal;
    color: #ffffff;
    border: 1px solid teal;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .day {
    position: relative;
    height: 24px;
    margin: 0px;
    padding: 0px 6px;
    background-color: teal;
    color: #ffffff;
    border: 1px solid teal;
    border-radius: 2px;
    left: 0;
    right: 0;
    user-select: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>