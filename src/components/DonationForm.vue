<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import axios from 'axios'

const auth = getAuth()
const currentUser = ref(null)
const donationAmount = ref('')
const donationMessage = ref('')
const errorMsg = ref('')
const successMsg = ref('')

// Donation Cloud Function
const cloudFN = 'https://us-central1-assess-3-charity.cloudfunctions.net/donationFormSecure'

onMounted(() => {
  currentUser.value = auth.currentUser
})

const donationSubmission = async () => {
  errorMsg.value = ''
  if (!currentUser.value) {
    errorMsg.value = 'You must be logged in to make a donation.'
    alert(errorMsg.value)
    return
  }

  // Validate donation amount
  if (!donationAmount.value || isNaN(donationAmount.value) || Number(donationAmount.value) <= 0) {
    errorMsg.value = 'Please enter a valid donation amount.'
    alert(errorMsg.value)
    return
  }

  // Create payload
  const payloadData = {
    uid: currentUser.value.uid,
    email: currentUser.value.email,
    displayName: currentUser.value.displayName,
    amount: Number(donationAmount.value),
    message: donationMessage.value,
    createdAt: new Date().toISOString(),
  }

  try {
    // Call the Cloud endpoint
    const response = await axios.post(cloudFN, payloadData, {
      headers: { 'Content-Type': 'application/json' },
    })

    successMsg.value = response.data
    alert(successMsg.value)

    // Clear the form
    donationAmount.value = ''
    donationMessage.value = ''
  } catch (error) {
    console.error('Error submitting donation:', error)
    errorMsg.value = error.message
    alert('Error: ' + errorMsg.value)
  }
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <section>
    <h2 class="text-left text-primary">Make a Donation</h2>
    <div v-if="!currentUser" class="alert alert-warning text-center">
      You must be logged in to make a donation.
    </div>
    <form v-else class="donation-form" @submit.prevent="donationSubmission">
      <div class="mb-3">
        <label for="amount" class="form-label">Donation Amount ($):</label>
        <input type="number" id="amount" class="form-control" v-model="donationAmount" required />
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">Message (optional):</label>
        <textarea id="message" class="form-control" v-model="donationMessage" rows="3"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Donate</button>
    </form>
  </section>
</template>

<style scoped></style>
