<template>
  <v-container>

    <v-layout column wrap justify-center v-if="editable">

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
    </v-layout>

    <v-layout column wrap>
      <v-flex>
        <v-card
          class="pa-2"
          flat
          id="mapv"
        >
        </v-card>
      </v-flex>

      <v-flex>
        <v-container class="pa-0 ma-0">
          <v-layout column class="pa-0 ma-0">
            <v-flex v-if="errored" v-cloak>
              <v-card class="py-2 mb-2">
              <div style="text-align:center">
                検索結果が見つかりませんでした。
              </div>
              </v-card>
            </v-flex>
            <v-flex v-else-if="!loading" v-cloak>
              <v-card class="mb-2">
                <v-list two-line style="max-height: 300px;" class="scroll-y">
                  <template v-for="(location,index) in list">

                    <v-list-tile :key="index" ripple @click="zoomSelectCandidateMarker(location.Id, index)">

                      <v-list-tile-avatar>
                        <v-icon v-if="location.Id != selected_candidate_marker_id" color="grey lighten-2">room</v-icon>
                        <v-icon v-else color="teal">room</v-icon>
                      </v-list-tile-avatar>

                      <v-list-tile-content>
                        <v-list-tile-title v-html="location.Name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="location.Address"></v-list-tile-sub-title>
                      </v-list-tile-content>

                    </v-list-tile>
                  </template>
                </v-list>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout column wrap justify-center>

      <v-flex class="mt-0 mb-0 pt-0 pb-0">
        <v-text-field
          v-model="storeName"
          color="teal"
          label="店舗名"
          :disabled="!editable"
          >
        </v-text-field >
      </v-flex>

      <v-flex class="mt-0 mb-0 pt-0 pb-0">
        <v-text-field
          v-model="storeAddress"
          color="teal"
          label="住所"
          :disabled="!editable"
          >
        </v-text-field>
      </v-flex>

      <v-flex class="mt-0 mb-0 pt-0 pb-0">
        <v-text-field
          v-model="storeUrl"
          color="teal"
          label="URL"
          :disabled="!editable"
          >
        </v-text-field>
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
const CREDENTIAL = require('../../credentials.json');

//定数設定
const LOCAL_SEARCH_URL = 'https://map.yahooapis.jp/search/local/V1/localSearch?'
const OSM_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const OSM_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const YOLP_APPID = CREDENTIAL.yolp.appid

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
      manual_markers: null,
      selected_candidate_marker_id: -1,
      selected_manual_marker_id: -1,
      list: [], 

      selectedIcon: L.icon({
        iconUrl: require("@/assets/marker-teal.png"),
        iconRetinaUrl: require("@/assets/marker-teal.png"),
        iconSize: [32, 32], iconAnchor: [16, 31], popupAnchor: [0, -32]
      }),
      icon: L.icon({
        iconUrl: require("@/assets/marker-grey.png"),
        iconRetinaUrl: require("@/assets/marker-grey.png"),
        iconSize: [32, 32], iconAnchor: [16, 31], popupAnchor: [0, -32]
      }),
    };
  },

  props: {
    // 編集可能であるか（登録画面/参照画面で切り替えのため）
    editable: {
      type: Boolean,
      default: true
    }
  },

  computed:{
    storeId:{
      get(){return this.$store.getters.storeId},
      set(val){this.$store.dispatch('setStoreId', {storeId: val})}
    },
    storeLatitude:{
      get(){return this.$store.getters.storeLatitude},
      set(val){this.$store.dispatch('setStoreLatitude', {storeLatitude: val})}
    },
    storeLongitude:{
      get(){return this.$store.getters.storeLongitude},
      set(val){this.$store.dispatch('setStoreLongitude', {storeLongitude: val})}
    },
    storeName:{
      get(){return this.$store.getters.storeName},
      set(val){this.$store.dispatch('setStoreName', {storeName: val})}
    },
    storeAddress:{
      get(){return this.$store.getters.storeAddress},
      set(val){this.$store.dispatch('setStoreAddress', {storeAddress: val})}
    },
    storeUrl: {
      get(){return this.$store.getters.storeUrl},
      set(val){this.$store.dispatch('setStoreUrl', {storeUrl: val})}
    },
    storeUrl:{
      get(){return this.$store.state.storeUrl},
      set(val){this.$store.commit('storeUrl', val)}
    },
    center: function(){
      return this.map.getCenter();
    }
  },

  mounted: function() {
    //地図を表示
    this.viewMap();
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

      // 検索結果用のマーカー表示のレイヤー管理グループ
      this.markers = L.layerGroup();
      this.map.addLayer(this.markers);

      // マウスクリック用のマーカー表示のレイヤー管理グループ
      this.manual_markers = L.layerGroup();
      this.map.addLayer(this.manual_markers);
      let vm = this;

      // 参照用画面の場合はマウスクリックのマーカー追加は行わない
      if (this.editable === false)  return;
      // 参照プロットエリア設定
      // ReferEvent.vueでgetリクエストで緯度経度読むが、
      // それよりこちらのほうが早く動いてしまい、緯度経度が設定できない。
      // 対策：ReferEvent.vue側でgetリクエストの読み込みが終わった段階で、
      //       zoomSelectManualMarkerをコールする
      this.map.on("click", function (e) {
        vm.selectManualMarker(e.latlng);
      });
    },

    //YOLPローカルサーチAPIで検索
    search(){
      this.loading=true;
      this.errored=false;
      var vm = this;
      this.$jsonp(LOCAL_SEARCH_URL,{
        output: 'json',
        appid: YOLP_APPID,
        query: vm.query,
        distinct: false,
        sort: 'hybrid',
        start: 0,
        results: 10,
        loco_mode: true,
      })
      .then(json => {
        this.localinfo = json["Feature"];
        this.dispCandidate();
      })
      .catch(err => {(this.errored = true), (this.error = err);})
      .finally(() => (this.loading = false));      
    },

    //test YOLPローカルサーチAPItest
    // get(val){
    //   this.loading=true;
    //   this.errored=false;
    //   this.$jsonp(LOCAL_SEARCH_URL,{
    //     output: 'json',
    //     appid: YOLP_APPID,
    //     query: this.query,
    //     uid: val,
    //     start: 0,
    //     results: 1,
    //   })
    //   .then(json => {
    //     this.localinfo = json["Feature"];
    //     this.dispCanditate(-1);
    //     this.selectPos(0);
    //   })
    //   .catch(err => {(this.errored = true), (this.error = err);})
    //   .finally(() => (this.loading = false));       
    // },

    // 検索結果の内、指定されたマーカーを無選択状態にする
    inactivateSelectedCandidate(marker_id) {
      let marker = this.markers.getLayer(marker_id);
      if (marker !== void 0) {
        marker.setIcon(this.icon);
        marker.setZIndexOffset(0);
        this.selected_candidate_marker_id = -1;
        this.storeLatitude = "";
        this.storeLongitude = "";
      }
    },

    // 検索結果の内、指定されたマーカーを選択状態にする
    activateSelectedCandidate(marker_id) {
      let marker = this.markers.getLayer(marker_id);
      if (marker !== void 0) {
        marker.setZIndexOffset(1000);
        marker.setIcon(this.selectedIcon);
        this.selected_candidate_marker_id = marker_id;
        let lat_lng = marker.getLatLng();
        this.storeLatitude = lat_lng.lat;
        this.storeLongitude = lat_lng.lng;
      }
    },

    // 検索結果のマーカーを削除する
    deleteCandidateMarker() {
      this.markers.clearLayers();
      this.list.splice(0);
      this.selected_candidate_marker_id = -1;
    },

    // 検索結果の内、マーカーを選択する
    selectCandidateMarker(marker_id) {
      // 手動選択のマーカーを削除する
      this.deleteManualMarker();
      // 検索結果で選択されているマーカーを解除する
      this.inactivateSelectedCandidate(this.selected_candidate_marker_id);
      this.activateSelectedCandidate(marker_id);
    },

    // 検索結果の内、指定されたマーカーを選択しつつズームする
    zoomSelectCandidateMarker(marker_id, index) {
      this.selectCandidateMarker(marker_id);
      this.setCandidate(index);

      let marker = this.markers.getLayer(marker_id);
      if (marker !== void 0) {
        let lat_lng = marker.getLatLng();
        let lat = lat_lng.lat;
        let lng = lat_lng.lng;
        let bounds = L.latLngBounds([lat,lng], [lat, lng]);
        this.map.fitBounds(bounds);
      }
    },

    // 手動で指定されたマーカーをズームする
    zoomSelectManualMarker(latlng) {
      this.selectManualMarker(latlng);
      let lat = latlng.lat;
      let lng = latlng.lng;
      let bounds = L.latLngBounds([lat,lng], [lat, lng]);
      this.map.fitBounds(bounds);
    },

    // 手動選択のマーカーを削除する
    deleteManualMarker() {
      this.manual_markers.clearLayers();
      this.selected_manual_marker_id = -1;
      this.storeLatitude = "";
      this.storeLongitude = "";
    },

    // 手動マーカーを選択する
    selectManualMarker(latlng) {
      // 表示されている手動選択マーカーをクリア
      this.deleteManualMarker();
      // クリックされた位置にマーカーを生成
      let manual_marker = L.marker(latlng, {icon: this.selectedIcon});
      manual_marker.setZIndexOffset(1000);
      // 検索結果で選択されていたマーカーは未選択にする
      this.inactivateSelectedCandidate(this.selected_candidate_marker_id);
      // mapに紐づけされているマーカー管理グループに追加してマーカー表示
      this.manual_markers.addLayer(manual_marker);
      this.selected_manual_marker_id = this.manual_markers.getLayerId(manual_marker);
      this.storeLatitude = latlng.lat;
      this.storeLongitude = latlng.lng;
    },

    dispCandidate() {
      // 検索済みの削除
      this.deleteCandidateMarker();

      // 検索結果ない場合は終了
      if (this.localinfo === void 0) {
        this.errored = true; // 検索結果が見つかりませんでしたを表示
        return;
      }

      // 地図に検索結果をマーカーでピン打ち
      let vm = this;
      let bounds = null;
      let index = 0;
      for (let item in this.localinfo) {

        // 緯度経度取得
        let coordinates = this.localinfo[item].Geometry.Coordinates.split(',');
        let lng = parseFloat(coordinates[0]);
        let lat = parseFloat(coordinates[1]);

         // マウスホバーで店舗名ポップアップ表示機能追加
        let marker = L.marker([lat, lng], {id: item});
        marker.bindTooltip(vm.localinfo[item].Name).openPopup();

        // マーカーをマップに追加
        marker.setIcon(this.icon);
        this.markers.addLayer(marker);
        let marker_id = this.markers.getLayerId(marker);
        let i = index; // クロージャでindexの参照範囲を狭めるためiで置き換え
        marker.on("click", function() {
          vm.selectCandidateMarker(marker_id);
          vm.setCandidate(i);
        });

        // 描画矩形座標にマージ
        if (bounds === null) {
          bounds = L.latLngBounds([lat,lng],[lat,lng]);
        } else {
          bounds.extend([lat,lng]);
        }

        // 店舗名と住所をリストに追加
        this.list.push({
          Name: this.localinfo[item].Name, 
          Address: this.localinfo[item].Property.Address,
          Id: marker_id
        });

        index++;
      }

      // すべてのマーカーが描画できるように表示
      if (bounds !== null) {
        this.map.fitBounds(bounds);  //ピンに合わせて範囲を表示
      }

    },

    setCandidate(index) {
      this.storeId = this.localinfo[index].Property.Uid;
      this.storeName = this.localinfo[index].Name;
      this.storeAddress = this.localinfo[index].Property.Address;
    },

    clear() {
      this.storeId = "";
      this.storeLatitude = "";
      this.storeLongitude = "";
      this.storeName = "";
      this.storeAddress = "";
      this.storeUrl = "";
      this.clearMarker();
      this.query = "";
    },

    // マーカーなし、地図のズームを初期状態に戻す
    clearMarker() {
      this.deleteCandidateMarker();
      this.deleteManualMarker();
      this.map.setView(
        L.latLng(DEF_LAT, DEF_LNG),
        DEF_ZOOM
      );
    }
  }
};
</script>
 

<style>
.mapBar { z-index: 1000 !important;}
#mapv { max-width: 100%; height: 500px; z-index: 0;};

[v-cloak] {
  display: none;
};
</style>