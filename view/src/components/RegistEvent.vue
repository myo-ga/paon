<template>
  <v-container>
    <v-layout justify-center >
      <form>
        <v-flex>
          <v-text-field
            v-model="name"
            v-validate="'required|max:10'"
            :counter="10"
            :error-messages="errors.collect('name')"
            label="イベント名"
            data-vv-name="name"
            required
          ></v-text-field>
        </v-flex>
        <v-flex>
            <DatePickDialog/>
        </v-flex>
        <v-flex>
          <v-btn @click="submit">登録</v-btn>
          <v-btn @click="clear">クリア</v-btn>
        </v-flex>
      </form>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'

import DatePickDialog from './DatesPickList'

Vue.use(VeeValidate)

export default {
    $_veeValidate: {
        validator: 'new'
    },
    components: {
      DatePickDialog
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
        picker: 'text',
        items: [
          { active: true, title: 'Jason Oner' },
          { active: true, title: 'Ranee Carlson' }
        ]
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
