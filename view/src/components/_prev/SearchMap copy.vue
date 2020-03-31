<template>
  <v-container>
    <v-layout row wrap justify-center>

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

      <v-flex>
        <v-card
          class="pa-2"
          flat
          height="100%"
          min-height="300px"
          min-width="300px"
          max-width="100%"
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

      <v-flex>
        <v-container>
          <v-layout column align-center>

            <v-flex v-if="errored" v-cloak>検索結果が見つかりませんでした。</v-flex>
            <v-flex v-else-if="!loading" v-cloak>
              <v-list two-line style="max-height: 300px; max-width: 500px" class="scroll-y">
                <template v-for="(location,index) in list">
                  <v-list-tile :key="index" ripple @click="selectPos(index)">
                    
                    <v-list-action>
                      <v-icon v-if="index != selected" color="grey lighten-2">room</v-icon>
                      <v-icon v-else color="teal">room</v-icon>
                    </v-list-action>

                    <v-list-tile-content>
                      <v-list-tile-title v-html="location.Name"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="location.Address"></v-list-tile-sub-title>
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
//import YOLP_APPID from './yahoo'

//定数設定
const LOCAL_SEARCH_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?'
const OSM_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const OSM_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const YOLP_APPID = 'dj00aiZpPWMxdTVwWWtHa1puNCZzPWNvbnN1bWVyc2VjcmV0Jng9ZWY-'

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
      list: [], 

      //selected  
      storeId:  '',     
      storeLatitude: '',
      storeLongitude: '',
      storeName: '',
      storeAddress: '',
      storeUrl: '',

      icon: L.icon({
        iconUrl: require("leaflet/dist/images/marker-teal.png"),
        iconRetinaUrl: require("leaflet/dist/images/marker-teal.png"),
        iconSize: [32, 32], iconAnchor: [16, 31], popupAnchor: [0, -32]
      }),
      
      selectedicon: L.icon({
        iconUrl: require("leaflet/dist/images/marker-purple.png"),
        iconRetinaUrl: require("leaflet/dist/images/marker-purple.png"),
        iconSize: [32, 32], iconAnchor: [16, 31], popupAnchor: [0, -32]
      }),
    };
  },
  mounted: function() {
    //地図を表示
    this.viewMap();

    //vuexで店舗IDを取得
    this.storeId = this.$store.state.storeId;

    //パラメータにIDがある場合はロケーション情報を取得
    if(this.storeId){
      this.get();
    }
  },
  methods: {

    //地図の初期表示(leaflet + osm)
    viewMap(){
      this.map = L.map( 
        'mapv', { center: L.latLng(DEF_LAT, DEF_LNG), zoom: DEF_ZOOM, zoomControl: false } 
      )
      .addLayer(
        L.tileLayer( 
          OSM_URL, { attribution: OSM_ATTR }
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
        this.localinfo = json["Feature"];
        this.dispCanditate();
      })
      .catch(err => {(this.errored = true), (this.error = err);})
      .finally(() => (this.loading = false));      

      this.selectPos(-1);
    },

    //test YOLPローカルサーチAPItest
    get(){
      this.loading=true;
      this.errored=false;
      this.$jsonp(LOCAL_SEARCH_URL,{
        output: 'json',
        appid: YOLP_APPID,
        query: this.query,
        sort: 'hybrid',
        uid: this.storeId,
        start: 0,
        result: 100,
        loco_mode: false,
      })
      .then(json => {
        this.localinfo = json["Feature"];
        this.dispCanditate();
      })
      .catch(err => {(this.errored = true), (this.error = err);})
      .finally(() => (this.loading = false));      

      this.selectPos(-1);
    },

    //検索候補表示
    dispCanditate(){
      //表示更新前にクリア
      if(this.markers) this.markers.clearLayers();
      if(this.bounds) this.bounds = null;//消し方微妙。メモリリーク？
      if(this.list) this.list = [];

      //地図にローカルサーチ結果をピン打ち
      for(var item in this.localinfo){

        //店名と住所をリストに追加
        this.list.push({
          Name: this.localinfo[item].Name, 
          Address: this.localinfo[item].Property.Address
        });

        //緯度経度取得
        var coordinates = this.localinfo[item].Geometry.Coordinates.split(',');
        var lng = parseFloat(coordinates[0]);
        var lat = parseFloat(coordinates[1]);
        
        //緯度経度でピン打ち
        var marker = L.marker([lat,lng],{icon: this.icon, id: item });
        marker.bindPopup(this.localinfo[item].Name);
        //marker.on('click', function(e){this.$SelectMarker(e.target.options.id)});
        this.markers.addLayer(marker);

        //地図範囲設定
        if(this.bounds == null){
          this.bounds = L.latLngBounds([lat,lng],[lat,lng]);
        }
        else {
          this.bounds.extend([lat,lng]);
        }
      }
      this.map.addLayer(this.markers);
      this.map.fitBounds(this.bounds);  //ピンに合わせて範囲を表示
    },

    selectPos(index){
      this.selected = index;        
      this.storeId = this.localinfo[index].Property.Uid;
      this.storeName = this.localinfo[index].Name;
      this.storeAddress = this.localinfo[index].Property.Address;
      //var coordinates = this.localinfo["Feature"][index].Geometry.Coordinates.split(',');
      //var lng = parseFloat(coordinates[0]);
      //var lat = parseFloat(coordinates[1]);
      //this.storeLatitude = lat;
      //this.storeLongitude = lng;

      //vuexのstoreに表示データをvuexにコミットする
      this.$store.commit(
        'storeSelect', {
          storeId: this.storeId,
          storeLatitude: this.storeLatitude,
          storeLongitude : this.storeLongitude,
          storeName: this.storeName,
          storeAddress: this.storeAddress,
          storeUrl: this.storeUrl
      });
    },

  }
};
</script>
 

<style>
.mapBar { z-index: 1000 !important;}
#mapv { width: 1000px; height: 500px; z-index: 0;};

[v-cloak] {
  display: none;
};
</style>