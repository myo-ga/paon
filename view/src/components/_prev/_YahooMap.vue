
<template>
  <div id="map" style="width:400px; height:300px"></div>
</template>

<script>
export default{
   /** 経緯度 */
   props:{ type: Object, required: true },
   template: `
    <div>
      <p><input v-model="message"></p>
      <p>{{message}}</p>
    </div>
  `,
 
  created() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://map.yahooapis.jp/js/V1/jsapi?appid=dj00aiZpPWMxdTVwWWtHa1puNCZzPWNvbnN1bWVyc2VjcmV0Jng9ZWY-')
    document.head.appendChild(recaptchaScript)
  },
   /** mounted */
  mounted:function() {
    var ymap = new Y.Map("map");
    ymap.drawMap(new Y.LatLng(35.66572, 139.73100), 17, Y.LayerSetId.NORMAL);
   }
}
</script>