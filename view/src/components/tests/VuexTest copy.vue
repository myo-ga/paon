<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex shrink>
        <h1>Counter</h1>
        <div>
            {{ showCounter }}
        </div>
        <button @click="increment">
            increment
        </button>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0
    },
    getters: {
        countWithSuffix(state) {
            return `${state.count} 回`
        }
    },
    mutations: {
        increment(state) {
            state.count++
        }
    },
    actions: {
        increment(context) {
            context.commit('increment')
        }
    }
})

export default {
    computed: {
        showCounter() {
            return this.$store.getters.countWithSuffix
        }
    },
    store,
    methods: {
        increment() {
            this.$store.dispatch('increment')
        }
    }
}
</script>