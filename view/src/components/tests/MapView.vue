<template>
    <div id=mapv>
    </div>
</template>

<script>
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

export default {
    mounted:function() {
        L.map( 
            'mapv', 
            {   
                center: L.latLng( 35.6825, 139.752778 ), 
                zoom: 15 
            } 
        ).addLayer(
            L.tileLayer( 
                'http://{s}.tile.osm.org/{z}/{x}/{y}.png' 
            )
        )
    }
}
</script>

<style>
#mapv { width: 100%; height: 300px; z-index: 0;}
</style>