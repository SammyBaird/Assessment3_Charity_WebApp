<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const db = getFirestore()
const donationData = ref([])
const auth = getAuth()
const user = auth.currentUser

// Variables for filter/pagination
const filterText = ref('')
const currentPage = ref(1)
const pageSize = 10

// Filter donations based on the text match
const filterDonations = computed(() => {
  if (!filterText.value) {
    return donationData.value
  }
  const lowerFilter = filterText.value.toLowerCase()
  return donationData.value.filter(
    (donation) =>
      (donation.message && donation.message.toLowerCase().includes(lowerFilter)) ||
      (donation.displayName && donation.displayName.toLowerCase().includes(lowerFilter)) ||
      (donation.email && donation.email.toLowerCase().includes(lowerFilter)),
  )
})

// Total number of pages
const totalPages = computed(() => {
  return Math.ceil(filterDonations.value.length / pageSize)
})

// Paginate the filtered donations
const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filterDonations.value.slice(start, start + pageSize)
})

onMounted(async () => {
  // Fetch all donations from Firestore
  const querySnapshot = await getDocs(collection(db, 'donations'))
  const allDonations = querySnapshot.docs.map((doc) => doc.data())

  // Sort donations by createdAt
  if (user && user.uid) {
    let userDonations = allDonations.filter((donation) => donation.uid === user.uid)
    userDonations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    donationData.value = userDonations
    await nextTick()
  } else {
    // This is impossible
    console.error('No user is signed in.')
  }
})

// Table page functions > Seems to work well
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    // Set current page
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    // Decrement page
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    // Increment page
    currentPage.value++
  }
}
</script>

<template>
  <div class="container my-4">
    <h2>Your Donations</h2>
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Filter donations by message"
        v-model="filterText"
      />
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(donation, index) in paginatedDonations" :key="index">
          <td>{{ new Date(donation.createdAt).toLocaleDateString() }}</td>
          <td>${{ donation.amount }}</td>
          <td>{{ donation.message ? donation.message : '(No Message Provided)' }}</td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Donation table pagination">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Previous</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
