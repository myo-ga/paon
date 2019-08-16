<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
    <input type="button" value="更新" @click="update()">
  </div>
</template>

<script>
export default {
  computed: {
    message () {
      return this.$store.state.count;
      //https://zukucode.com/2017/04/vuex-mutation-state.html
    }
  },
  methods: {
    update(){
      this.$store.commit('increment');
    }
  }
};
</script>