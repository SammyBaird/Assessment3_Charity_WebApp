<template>
  <div class="analytics">
    <h1>Charity Spending Analytics</h1>
    <canvas id="spendingChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import Chart from 'chart.js/auto'

const db = getFirestore()
const spendingData = ref([])

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'spending'))
  // Map Firestore documents to data objects
  spendingData.value = querySnapshot.docs.map((doc) => doc.data())

  // Optional: Sort data by month (assuming ISO format YYYY-MM-DD)
  spendingData.value.sort((a, b) => new Date(a.month) - new Date(b.month))

  // Extract labels (months) and values for each spending category
  const labels = spendingData.value.map((item) => item.month)
  const administrative = spendingData.value.map((item) => item.administrative)
  const programs = spendingData.value.map((item) => item.programs)
  const fundraising = spendingData.value.map((item) => item.fundraising)
  const operations = spendingData.value.map((item) => item.operations)
  const outreach = spendingData.value.map((item) => item.outreach)
  const grants = spendingData.value.map((item) => item.grants)

  // Get the canvas element and create a stacked bar chart
  const ctx = document.getElementById('spendingChart')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Administrative',
          data: administrative,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        {
          label: 'Programs',
          data: programs,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Fundraising',
          data: fundraising,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        },
        {
          label: 'Operations',
          data: operations,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Outreach',
          data: outreach,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
        {
          label: 'Grants',
          data: grants,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Spending Breakdown',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    },
  })
})
</script>

<style scoped>
.analytics {
  padding: 2rem;
  min-height: 400px;
}
</style>
