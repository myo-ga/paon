<template>
  <v-container fill-height>
    <v-layout column style="max-width: 800px;" class="mx-auto">
      <v-flex align-self-center>
        <img src="@/assets/paon_logo.png" style="display: block" class="mt-5 mx-auto"/>
        <h2 class="x-center">Plan Adjustment Open Negotiator</h2>
        <p class="x-center">イベントを計画しましょう</p>
        <div class="x-center">
          <v-btn dark color="teal" to="/RegisterEvent">イベントを計画する</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
    
}
</script>


<style scoped>
  .x-center {
    text-align: center;
  }
</style>