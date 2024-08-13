<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = 'get_your_own_access_token';

const month = ref(0);
const selectedDay = ref('all');
const map = ref(null);

const activeMonth = computed(() => {
  const intHour = parseInt(month.value); 
  switch (intHour) {
    case 0:
        return 'All';
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }

});

const updateMapFilter = () => {
  if (map.value && map.value.getSource('collisions') && activeMonth.value === 'All') {
    console.log('removing filter');
    map.value.setFilter('collisions-heat');
  }
  if (map.value && map.value.getSource('collisions')) {
    map.value.setFilter('collisions-heat', ['==', ['number', ['get', 'Month']], parseInt(month.value)]);
  }
};

watch([month, selectedDay], updateMapFilter);

onMounted(() => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-101.87903461669559, 33.57145075313548],
    zoom: 11 // Zoom out a bit to show more of Texas
  });

  map.value.on('load', () => {
    map.value.addSource('collisions', {
      type: 'geojson',
      data: 'http://example.com/crime_map_data.geojson' // needs to be a URL to a GeoJSON file
    });

    map.value.addLayer({
      id: 'collisions-heat',
      type: 'heatmap',
      source: 'collisions',
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          9, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          9, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          7, 1,
          9, 1
        ],
      }
    });
  });
});


</script>

<template>
    <div>
      <div id="map"></div>
      <div id="console">
        <h1
        @click=""
        >Texas Shots Fired Calls</h1>
        <div class="session">
          <h2>Heatmap Intensity</h2>
          <div class="row colors"></div>
          <div class="row labels">
            <div class="label">Low</div>
            <div class="label">High</div>
          </div>
        </div>
        <div class="session">
          <h2>Month: <label>{{ activeMonth }}</label></h2>
          <input
            id="slider"
            class="row"
            type="range"
            min="0"
            max="12"
            step="1"
            v-model="month"
          />
        </div>
      </div>
    </div>
</template>


<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

h1 {
  font-size: 20px;
  line-height: 30px;
}

h2 {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
}

a {
  text-decoration: none;
  color: #2dc4b2;
}

#console {
  position: absolute;
  margin: 10px;
  width: 240px;
  background-color: white;
  padding: 10px 20px;
}

.session {
  margin-bottom: 20px;
}

.row {
  height: 12px;
  width: 100%;
}
.colors {
  background: linear-gradient(
    to right,
    rgba(33,102,172,0),
    rgb(103,169,207),
    rgb(209,229,240),
    rgb(253,219,199),
    rgb(239,138,98),
    rgb(178,24,43)
  );
  margin-bottom: 5px;
}

.label {
  width: 50%;
  display: inline-block;
  text-align: center;
}
</style>