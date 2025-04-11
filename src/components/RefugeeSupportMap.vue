<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import Chart from 'chart.js/auto'
import {
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
  topojson,
} from 'chartjs-chart-geo'

// Register ChartGeo controllers and scales
Chart.register(ChoroplethController, GeoFeature, ProjectionScale, ColorScale)

const db = getFirestore()
const chartCanvas = ref(null)

onMounted(async () => {
  // Load world geography from topojson
  const worldResponse = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  const worldTopo = await worldResponse.json()
  const countries = topojson.feature(worldTopo, worldTopo.objects.countries).features

  // Query refugeeNations collection
  const refNationSnapshot = await getDocs(collection(db, 'refugeeNations'))
  // Map nation to refugee count
  const refugeeData = {}
  refNationSnapshot.docs.forEach((doc) => {
    const data = doc.data()
    refugeeData[data.nation] = data.refugeeCount
  })

  const geoDataset = countries.map((feature) => {
    const countryName = feature.properties.name
    const count = refugeeData[countryName] || 0
    return { feature, value: count }
  })

  // Set maxCount to avoid division by zero
  const maxCount = Math.max(...geoDataset.map((d) => d.value), 1)

  const ctx = chartCanvas.value.getContext('2d')
  new Chart(ctx, {
    type: 'choropleth',
    data: {
      labels: countries.map((c) => c.properties.name),
      datasets: [
        {
          label: 'Refugee Count',
          data: geoDataset,
          backgroundColor: (context) => {
            if (context && context.raw && typeof context.raw.value !== 'undefined') {
              const count = context.raw.value
              if (count === 0) return '#e0e0e0'
              const ratio = count / maxCount
              const lightness = 90 - ratio * 50
              return `hsl(210, 100%, ${lightness}%)`
            }
            return '#e0e0e0'
          },
          borderColor: '#ffffff',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        projection: {
          type: 'projection',
          axis: 'x',
          projection: 'equalEarth',
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const country = context.raw?.feature?.properties?.name || 'Unknown'
              const count = context.raw?.value || 0
              return `${country}: ${count} Refugee${count === 1 ? '' : 's'}`
            },
          },
        },
      },
    },
  })
})
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="refugee-map container">
    <h1 class="text-center my-4"></h1>
    <div class="row justify-content-center">
      <canvas ref="chartCanvas" style="width: 100%; height: 600px"></canvas>
    </div>
  </div>
</template>

<style scoped>
.refugee-map {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.refugee-map h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #343a40;
}

.refugee-map canvas {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
