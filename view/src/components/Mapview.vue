<template>
    <div id=mapv>
    </div>
</template>

<script>
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

export default {
    mounted() {
        L.map( 'mapv', { center: L.latLng( 35.6825, 139.752778 ), zoom: 15 } ).addLayer(
            L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' )
        )
    }
}
</script>

<style>
html, body, #mapv { width: 50%; height: 50%; }
body { margin: 0 }
</style>