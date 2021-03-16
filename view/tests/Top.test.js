import { shallowMount, createLocalVue } from '@vue/test-utils'
// import Vuex from 'vuex'
import Vue from "vue"
import Vuetify from 'vuetify'
import Top from '../src/components/Top.vue'

// vuetify1.5ではlocalVueに対してはvuetifyを適用できない
// https://stackoverflow.com/questions/51990753/vue-js-vuetify-issue-running-my-first-unit-test-with-jest
// const localVue = createLocalVue()
Vue.use(Vuetify)

describe('Top.vue', () => {

  beforeEach(() => {
  }),

  test("イベント計画ボタンで/RegisterEventに遷移する", () => {
    let wrapper = shallowMount(Top, {
      Vue,
    });
  });
});