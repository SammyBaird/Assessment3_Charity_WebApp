<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'

const props = defineProps({
  // Setting some markers - Using Monash Campus locations as an example.
  locations: {
    type: Array,
    default: () => [
      { lat: -37.877, lng: 145.0443, label: 'New Horizons Caulfield' },
      { lat: -37.915, lng: 145.1286, label: 'New Horizons Clayton' },
      { lat: -37.8014, lng: 144.9612, label: 'New Horizons Parkville' },
    ],
  },
  // Control zoom level
  initialZoom: {
    type: Number,
    default: 10,
  },
  // Set default map center
  initialCenter: {
    type: Object,
    default: () => ({ lat: -37.8136, lng: 144.9631 }),
  },
})

// Store the travel time
const travelTime = ref(null)

// Store the travel method - Default to DRIVING
const travelMode = ref('DRIVING')

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])

let directionsService = null
let directionsRenderer = null

// Create map with markers
onMounted(() => {
  if (window.google && window.google.maps) {
    // Set center to props.initialCenter
    let center = props.initialCenter
    if (center.lat === 0 && center.lng === 0 && props.locations && props.locations.length) {
      center = { lat: props.locations[0].lat, lng: props.locations[0].lng }
    }
    // Initialize the map
    map.value = new window.google.maps.Map(mapContainer.value, {
      center,
      zoom: props.initialZoom,
    })
    addMarkers()
  } else {
    console.error('Google Maps API is not loaded')
  }
})

// Assessment Map Functionality 1: Add markers to the map
function addMarkers() {
  // Remove any existing markers.
  markers.value.forEach((marker) => marker.setMap(null))
  markers.value = []

  // Loop locations and add mark for each
  props.locations.forEach((loc) => {
    const marker = new window.google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: map.value,
      title: loc.label || '',
    })

    // Add click listener to direct the user from their location to the mark
    marker.addListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            // Request route from user location to selected mark
            calculateAndDisplayRoute(userLocation, marker.getPosition())
          },
          (error) => {
            console.error('Error retrieving location', error)
          },
        )
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    })

    markers.value.push(marker)
  })
}

// Assessment Map Functionality 2: Calculate and display travel time
// with differnt travel modes
function calculateAndDisplayRoute(origin, destination) {
  if (!directionsService) {
    directionsService = new window.google.maps.DirectionsService()
  }
  if (!directionsRenderer) {
    directionsRenderer = new window.google.maps.DirectionsRenderer()
    directionsRenderer.setMap(map.value)
  }
  // Use the given travel mode
  directionsService.route(
    {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode[travelMode.value],
    },
    (response, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response)
        // Extract travel time from the first leg of the route if available
        if (response.routes && response.routes.length > 0 && response.routes[0].legs.length > 0) {
          travelTime.value = response.routes[0].legs[0].duration.text
        }
      } else {
        console.error('Directions request failed due to ' + status)
      }
    },
  )
}

// Watch and update the map when locations change (They won't in this case, but good to have)
watch(
  () => props.locations,
  () => {
    if (map.value) {
      addMarkers()
    }
  },
  { deep: true },
)
</script>

<template>
  <div>
    <!-- Select desired travel mode -->
    <div style="margin-bottom: 1rem">
      <label for="travelMode" style="margin-right: 0.5rem">Select Travel Mode:</label>
      <select id="travelMode" v-model="travelMode">
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Cycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
    </div>
    <div ref="mapContainer" style="width: 100%; height: 400px"></div>
    <div v-if="travelTime" class="travel-info" style="margin-top: 1rem; font-weight: bold">
      Estimated travel time: {{ travelTime }}
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
