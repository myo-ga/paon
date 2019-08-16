<template>
  <div class="about">
    <h1>This is an akios page</h1>
    <p v-if="errored" v-cloak>{{ error }}</p>
    <p v-if="loading" v-cloak>Loading...</p>
 
    <div v-else>
      <ul>
        <li v-for="location in locations['Feature']" :key="location.Id" v-cloak>
          {{location.Name}} /
          {{location.Property.Address}}
        </li>
      </ul>
    </div>
  </div>
</template>
 
<script>

const LOCAL_SEARCH_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?'
const YOLP_APPID = 'dj00aiZpPWMxdTVwWWtHa1puNCZzPWNvbnN1bWVyc2VjcmV0Jng9ZWY-'

//yolpのローカルサーチAPIがCORS制限に引っかかるため
//vue-jsonpを使う
//参考：https://qiita.com/_masakitm_/items/ada0d210e94365b45db4
import Vue from 'vue'
import jsonp from 'vue-jsonp'
Vue.use(jsonp)

export default {
  name: "about",
  data() {
    return {
      loading: true,
      errored: false,
      error: null,
      locations: null
    };
  },
  created() {
    this.$jsonp(LOCAL_SEARCH_URL,{
      output: 'json',
      appid: YOLP_APPID,
      query: '練馬 ラーメン'
    })
    .then(json => {this.locations = json;})
    .catch(err => {(this.errored = true), (this.error = err);})
    .finally(() => (this.loading = false));
    /*this.$axios
      .get("https://map.yahooapis.jp/search/local/V1/localSearch",{ 
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          output: "json",
          appid: "dj00aiZpPWMxdTVwWWtHa1puNCZzPWNvbnN1bWVyc2VjcmV0Jng9ZWY-",
          query: "ラーメン",
          results: "1"
        }
      })
      //.get("http://nikujaga.mybluemix.net/events/get?id=dc692388cc85cbffb2edfed5bb3c067c")
      .then(response => {
        this.locations = response.data;
      })
      .catch(err => {
        (this.errored = true), (this.error = err);
      })
      .finally(() => (this.loading = false));
    */
  }
};
</script>
 
<style>
[v-cloak] {
  display: none;
}
</style>