<template>
  <v-container>
    <v-layout row wrap justify-center>

      <v-flex>
        <v-card
          class="pa-2"
          flat
          height="100%"
          min-height="300px"
          min-width="300px"
          maz-width="100%"
          id="mapv"
        >
          <!--template>
            <v-toolbar class="mapBar" floating dense>
              <v-text-field 
                v-model="query"
                single-line
                label="場所を検索"
                v-on:keyup.enter="search"
                append-outer-icon="search"
                @click:append-outer="search">
              </v-text-field>
            </v-toolbar>
          </template-->
        </v-card>
      </v-flex>

      <v-flex shrink>
        <v-container>
          <v-layout column align-center>
            <v-flex>
              <v-text-field
                v-model="query"
                color="teal"
                label="場所を検索"
                v-on:keyup.enter="search"
                append-outer-icon="search"
                @click:append-outer="search">
              </v-text-field>
            </v-flex>

            <v-flex v-if="errored" v-cloak>検索結果が見つかりませんでした。</v-flex>
            <v-flex v-else-if="!loading" v-cloak>
              <v-list two-line style="max-height: 300px; max-width: 500px" class="scroll-y">
                <template v-for="(location,index) in localinfo['Feature']">
                  <v-list-tile :key="index" ripple @click="selectPos(index)">
                    
                    <v-list-action>
                      <v-icon v-if="index != selected" color="grey litn-1">room</v-icon>
                      <v-icon v-else color="teal">room</v-icon>
                    </v-list-action>

                    <v-list-tile-content>
                      <v-list-tile-title class="tile" v-html="location.Name"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="location.Property.Address"></v-list-tile-sub-title>
                    </v-list-tile-content>

                  </v-list-tile>
                </template>
              </v-list>
            </v-flex>

          </v-layout>
        </v-container>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>
//地図はleafletとosmを使用
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

//yolpのローカルサーチAPIがCORS制限に引っかかるため
//vue-jsonpを使う
import Vue from 'vue'
import jsonp from 'vue-jsonp'
Vue.use(jsonp)


//設定読み込み
import YOLP_APPID from './yahoo'

//定数設定
const LOCAL_SEARCH_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?'
const OSM_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const OSM_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'


// デフォルトのマーカー画像設定
delete  L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions(
    {   iconUrl         : require( 'leaflet/dist/images/marker-icon.png' )
    ,   iconRetinaUrl   : require( 'leaflet/dist/images/marker-icon-2x.png' )
    ,   shadowUrl       : require( 'leaflet/dist/images/marker-shadow.png' )
    }
)

//地図の初期位置
const DEF_LAT = 35.6825
const DEF_LNG = 139.752778
const DEF_ZOOM = 13

//
export default {
  data() {
    return {
      loading: true,
      errored: false,
      error: null,
      localinfo: null,
      location: null,
      query: "",
      map: null,
      bounds: null,
      markers: null,
      selected: -1,
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
        { center: L.latLng(DEF_LAT, DEF_LNG), zoom: DEF_ZOOM, zoomControl: false } 
      )
      .addLayer(
        L.tileLayer( 
          OSM_URL,
          { attribution: OSM_ATTR }
        )
      );

      //検索の準備
      this.markers = L.layerGroup();
    },

    //YOLPローカルサーチAPI
    search(){
      this.loading=true;
      this.errored=false;
      this.$jsonp(LOCAL_SEARCH_URL,{
        output: 'json',
        appid: YOLP_APPID,
        query: this.query,
        sort: 'hybrid',
        start: 0,
        result: 100,
        loco_mode: false,
      })
      .then(json => {
        this.localinfo = json;
        this.dispCanditate();
      })
      .catch(err => {(this.errored = true), (this.error = err);})
      .finally(() => (this.loading = false));      

      this.selectPos(-1);
    },

    //検索候補表示
    dispCanditate(){
      //クリア
      if(this.markers) this.markers.clearLayers();
      if(this.bounds) this.bounds = null;//消し方微妙。メモリリーク？

      //地図にローカルサーチ結果をピン打ち
      for(var item in this.localinfo["Feature"]){
        var coordinates = this.localinfo["Feature"][item].Geometry.Coordinates.split(',');
        var lng = parseFloat(coordinates[0]);
        var lat = parseFloat(coordinates[1]);
        
        var marker = L.marker([lat,lng])
          .bindPopup(this.localinfo["Feature"][item].Name);
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
    },

    selectPos(index){
      this.selected = index;
    }
  }
};
</script>
 

<style>
.mapBar { z-index: 1000 !important;};
.tile. { background: teal; }
#mapv { width: 100%; height: 500px; z-index: 0;};

[v-cloak] {
  display: none;
};


</style>