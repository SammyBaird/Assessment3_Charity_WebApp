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
          backgroundColor: 'orange',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Programs',
          data: programs,
          backgroundColor: 'teal',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Fundraising',
          data: fundraising,
          backgroundColor: 'cyan',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Operations',
          data: operations,
          backgroundColor: 'blue',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Outreach',
          data: outreach,
          backgroundColor: 'violet',
          borderWidth: 1,
          stack: 'spending',
        },
        {
          label: 'Grants',
          data: grants,
          backgroundColor: 'darkgrey',
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
            autoSkip: true,
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

function exportCSV() {
  const cloudFN = 'https://us-central1-assess-3-charity.cloudfunctions.net/exportSpendingCSV'
  window.open(cloudFN, '_blank')
}
</script>

<template>
  <div class="analytics">
    <h1 class="text-left text-primary mb-4">New Horizons Histroical Spending</h1>
    <div class="card shadow-sm p-4">
      <canvas ref="chartCanvas" id="spendingChart"></canvas>
      <p class="mt-4">
        This chart shows the monthly spending breakdown for our charity. The categories include
        Administrative, Programs, Fundraising, Operations, Outreach, and Grants. Each category is
        represented by a different color.
      </p>
    </div>
    <br />
    <h2 class="text-left text-primary mb-4">Transparency and Accountability</h2>
    <p>
      f We pride ourselves on transparency and accountability. If you wish to see a more detailed
      account of our spending, you can export the data in CSV format here:
    </p>
    <button class="btn btn-primary mt-3" @click="exportCSV">Export as CSV</button>
  </div>
</template>

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
