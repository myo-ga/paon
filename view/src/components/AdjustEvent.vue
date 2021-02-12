<template>
<!--画面：イベント登録-->

  <v-container grid-list-xl>

      <!--カードを縦に並べる-->
      <v-layout row wrap>
        
        <!--カード１）イベント情報表示-->
        <v-flex xs12 sm8 offset-sm2 shrink>
          <v-card>
            <v-toolbar dense dark color="teal lighten-1" class="subheading">
              {{ eventname }}
            </v-toolbar>
            <v-layout column justify-center class="pa-3">
              <v-flex class="mx-5">
                <div class="body-1" style="white-space: pre-line">{{ comments }} </div><br/>
                <div class="subheading" style="white-space: pre-line">{{ storeName }} </div>
                <div class="body-1" style="white-space: pre-line">{{ storeAddress }} </div>
                <div class="body-1" style="white-space: pre-line">{{ storeLatitude }} </div>
                <div class="body-1" style="white-space: pre-line">{{ storeLongitude }} </div>
              </v-flex>
              <v-flex class="mx-1">
                <v-card
                  class="pa-2"
                  flat
                  height="100%"
                  min-height="300px"
                  min-width="300px"
                  max-width="100%"
                  id="mapv"
                >
                </v-card>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>

        <!--参加者リストデータテーブル-->
        <v-flex xs12 sm8 offset-sm2 shrink fixed><v-card>
          <v-toolbar dense dark color="teal lighten-1" class="subheading">参加者リスト</v-toolbar>
          <v-layout column justify-center class="pa-3">
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1">
                <template v-slot:items="{ item }">
                  <td v-for="header in headers" :key="header.value" class="body-1">
                    {{ item[header.value] }}
                  </td>
                </template>
    
            </v-data-table>
          </v-layout>
        </v-card></v-flex>

      </v-layout>
      
      <!--登録ボタンはわかりやすいようにフッターで表示する（フッターは後ろも見えるように半透明）-->
      <v-footer height="auto" color="rgba(120,120,120,0.3)" fixed>
        <v-layout justify-center row wrap>
          <v-flex shrink>
            <v-btn @click="update" color="purple darken-4 white--text">更新</v-btn>
          </v-flex>
        </v-layout>
      </v-footer>

  </v-container>
</template>

<script>
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

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
const DEF_ZOOM = 13

export default {
  data () {
    return {
      map: null,
      bounds: null,
      markers: null,
      headers: [
        {text: 'ニックネーム',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Iron (%)', value: 'iron' }
      ],
      items: [
        {name: 'Donut',calories: 452,fat: 25.0,carbs: 51,protein: 4.9,iron: '22%'},
        {name: 'KitKat',calories: 518,fat: 26.0,carbs: 65,protein: 7,iron: '6%'},
        {name: 'KitKat',calories: 518,fat: 26.0,carbs: 65,protein: 7,iron: '6%'},
        {name: 'KitKat',calories: 518,fat: 26.0,carbs: 65,protein: 7,iron: '6%'},
        {name: 'KitKat',calories: 518,fat: 26.0,carbs: 65,protein: 7,iron: '6%'}
      ],
      item: '',
      icon: L.icon({
        iconUrl: require("leaflet/dist/images/marker-teal.png"),
        iconRetinaUrl: require("leaflet/dist/images/marker-teal.png"),
        iconSize: [36, 36], iconAnchor: [18, 35], popupAnchor: [0, -35]
      }),
    }
  },

  computed:{
    eventname     : function(){return this.$store.state.eventname},
    comments      : function(){return this.$store.state.comments},
    storeId       : function(){return this.$store.state.storeId},
    storeLatitude : function(){return this.$store.state.storeLatitude},
    storeLongitude: function(){return this.$store.state.storeLongitude},
    storeName     : function(){return this.$store.state.storeName},
    storeAddress  : function(){return this.$store.state.storeAddress},
  },

  mounted: function(){
    this.viewMap();
  },

  methods: {
    viewMap(){
      var lat = this.storeLatitude;
      var lng = this.storeLongitude;
      this.map = L.map( 'mapv', { 
        center: L.latLng(lat, lng), 
        zoom: DEF_ZOOM, 
        zoomControl: false 
      }).addLayer(
        L.tileLayer( 
          OSM_URL, 
          { attribution: OSM_ATTR }
        )
      );
      L.marker([lat, lng],{icon: this.icon}).addTo(this.map);
    },

  },

}
  

</script>

<style>
.v-datatable.v-table > thead { background-color: #B2DFDB; }
.v-datatable.v-table > thead th { font-size: 14px !important; }
.v-datatable.v-table > thead th + th { border-left:1px solid #dddddd; }
.v-datatable.v-table > tbody td + td { border-left:1px solid #dddddd; }
.v-datatable.v-table > tbody tr:nth-child(even) { background-color: #E0F2F1; }

#mapv { width: 1000px; height: 500px; z-index: 0;};
</style>