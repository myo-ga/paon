<template>
  <v-container>
    <v-layout wrap>
      <v-flex>
        <v-card min-width="320" tile>
         <v-layout column>
            <v-flex class="ma-3">
              <div id="mapv"></div>
            </v-flex>
            <v-flex class="ma-3">
              <v-text-field
                v-model="query"
                label="場所を検索">
              </v-text-field>
            </v-flex>
            <v-flex class="ma-3">
              <v-btn @click="search" color="teal white--text">検索</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex>
        <p v-if="errored" v-cloak>{{error}}</p>
        <p v-if="loading" v-cloak></p>
        <v-list subheader two-line v-else v-cloak>
          <v-subheader>検索結果</v-subheader>
          <v-list-tile v-for="location in locations['Feature']" :key="location.Id">
            <v-list-tile-content>
              <v-list-tile-title v-html="location.Name"></v-list-tile-title>
              <v-list-tile-sub-title v-html="location.Property.Address"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex>
        {{list}}
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
//yolpのローカルサーチAPIがCORS制限に引っかかるため
//vue-jsonpを使う
//参考：https://qiita.com/_masakitm_/items/ada0d210e94365b45db4
import Vue from 'vue'
import jsonp from 'vue-jsonp'
Vue.use(jsonp)

//leaflet
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

// const
const LOCAL_SEARCH_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?'
const YOLP_APPID = 'dj00aiZpPWMxdTVwWWtHa1puNCZzPWNvbnN1bWVyc2VjcmV0Jng9ZWY-'
const OSM_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' 

// マーカーテスト
delete  L.Icon.Default.prototype._getIconUrl

// デフォルトマーカー
L.Icon.Default.mergeOptions(
    {   iconUrl         : require( 'leaflet/dist/images/marker-icon.png' )
    ,   iconRetinaUrl   : require( 'leaflet/dist/images/marker-icon-2x.png' )
    ,   shadowUrl       : require( 'leaflet/dist/images/marker-shadow.png' )
    }
)

//初期位置
const DEF_LAT = 35.6825
const DEF_LNG = 139.752778
const DEF_ZOOM = 15

//
export default {
  data() {
    return {
      loading: true,
      errored: false,
      error: null,
      locations: null,
      location: "",
      query: "",
      map: null,
      list: [],
      bounds: null,
      markers: null
    };
  },
  mounted: function() {
    this.viewMap();
  },
  methods: {
    //地図の初期表示(leaflet + osm)
    viewMap(){
      this.map = L.map( 
        'mapv', 
        { center: L.latLng(DEF_LAT, DEF_LNG), zoom: DEF_ZOOM } 
      )
      .addLayer(
        L.tileLayer( 
          OSM_URL,
          { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
        )
      );

      //検索の準備
      this.markers = L.layerGroup();
    },

    //YOLPローカルサーチ
    search(){
      this.$jsonp(LOCAL_SEARCH_URL,{
        output: 'json',
        appid: YOLP_APPID,
        query: this.query,
        results: '10'
      })
      .then(json => {
        this.locations = json;
        this.listtest();
      })
      .catch(err => {(this.errored = true), (this.error = err);})
      .finally(() => (this.loading = false));      
    },

    listtest(){
      //クリア
      if(this.markers) this.markers.clearLayers();
      if(this.bounds) this.bounds = null;

      //
      for(var item in this.locations["Feature"]){
        var coordinates = this.locations["Feature"][item].Geometry.Coordinates.split(',');
        var lng = parseFloat(coordinates[0]);
        var lat = parseFloat(coordinates[1]);
        
        //test
        this.list.push([lat,lng]);

        //位置追加
        var marker = L.marker([lat,lng])
          .bindPopup(this.locations["Feature"][item].Name);
        this.markers.addLayer(marker);

        if(this.bounds == null){
          this.bounds = L.latLngBounds([lat,lng],[lat,lng]);
        }
        else {
          this.bounds.extend([lat,lng]);
        }
      }
      this.map.addLayer(this.markers);
      this.map.fitBounds(this.bounds);
    }
  }
};
</script>
 
<style>
[v-cloak] {
  display: none;
};

#mapv { width: 100%; height: 300px; z-index: 0;}

.marker {
    text-align      : center
;   color           : white
;   font-size       : 16
;   border-radius   : 8px
;   box-shadow      : 8px 8px 8px rgba( 0, 0, 0, 0.4 )
}
.red {
    background      : red
}

</style>