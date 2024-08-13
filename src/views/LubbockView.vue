<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = 'get_your_own_access_token';

const month = ref(1);
const selectedDay = ref('all');
const map = ref(null);

const activeMonth = computed(() => {
  const intHour = parseInt(month.value); 
  switch (intHour) {
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

const filterMonth = computed(() => ['==', ['number', ['get', 'Month']], parseInt(month.value)]);


const updateMapFilter = () => {
  if (map.value) {
    console.log('filterMonth.value', filterMonth.value);
    map.value.setFilter('collisions', ['all', filterMonth.value, filterMonth.value]);
  }
};

watch([month, selectedDay], updateMapFilter);

onMounted(() => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-101.87903461669559, 33.57145075313548],
    zoom: 11
  });

  map.value.on('load', () => {
    map.value.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: 'http://example.com/crime_map_data.geojson' // needs to be a URL to a GeoJSON file 
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Month']],
          0, 4, 5, 24
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'Month']],
          0, '#2DC4B2',
          1, '#3BB3C3',
          2, '#669EC4',
          3, '#8B88B6',
          4, '#A2719B',
          5, '#AA5E79'
        ],
        'circle-opacity': 0.8
      },
      'filter': ['all', filterMonth.value, filterMonth.value]
    });
  });
});
</script>

<template>
  <div>
    <div id="map"></div>
    <div id="console">
      <h1>Lubbock Shots Fired Calls</h1>
      <div class="session">
        <h2>Frequency</h2>
        <div class="row colors"></div>
        <div class="row labels">
          <div class="label">0</div>
          <div class="label">1</div>
          <div class="label">2</div>
          <div class="label">3</div>
          <div class="label">4</div>
          <div class="label">5+</div>
        </div>
      </div>
      <div class="session">
        <h2>Month: <label>{{ activeMonth }}</label></h2>
        <input
          id="slider"
          class="row"
          type="range"
          min="1"
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
    #2dc4b2,
    #3bb3c3,
    #669ec4,
    #8b88b6,
    #a2719b,
    #aa5e79
  );
  margin-bottom: 5px;
}

.label {
  width: 15%;
  display: inline-block;
  text-align: center;
}
</style>