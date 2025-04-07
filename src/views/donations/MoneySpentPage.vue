<template>
  <div class="analytics">
    <h1>Charity Spending Analytics</h1>
    <canvas ref="chartCanvas" id="spendingChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import Chart from 'chart.js/auto'

const db = getFirestore()
const spendingData = ref([])
const chartCanvas = ref(null)

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'spending'))
  // Sort spending collection by month
  spendingData.value = querySnapshot.docs.map((doc) => doc.data())
  spendingData.value.sort((a, b) => new Date(a.month) - new Date(b.month))

  // Map the data
  const labels = spendingData.value.map((item) => item.month)
  const administrative = spendingData.value.map((item) => item.administrative)
  const programs = spendingData.value.map((item) => item.programs)
  const fundraising = spendingData.value.map((item) => item.fundraising)
  const operations = spendingData.value.map((item) => item.operations)
  const outreach = spendingData.value.map((item) => item.outreach)
  const grants = spendingData.value.map((item) => item.grants)

  // Create chart
  const ctx = chartCanvas.value.getContext('2d')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Administrative',
          data: administrative,
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Programs',
          data: programs,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Fundraising',
          data: fundraising,
          backgroundColor: 'rgba(255, 205, 86, 0.7)',
          borderColor: 'rgba(255, 205, 86, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Operations',
          data: operations,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Outreach',
          data: outreach,
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Grants',
          data: grants,
          backgroundColor: 'rgba(201, 203, 207, 0.7)',
          borderColor: 'rgba(201, 203, 207, 1)',
          borderWidth: 1,
          stack: 'spending',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Spending Breakdown',
          font: { size: 18 },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          position: 'top',
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: '#f0f0f0',
          },
        },
      },
    },
  })
})
</script>

<style scoped>
.analytics {
  padding: 2rem;
  min-height: 500px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

#spendingChart {
  width: 100% !important;
  height: 500px !important;
}
</style>
