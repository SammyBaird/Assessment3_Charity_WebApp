<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import MapTest from '../../components/MapTest.vue'
import axios from 'axios'

const email = ref('')
const firstLastName = ref('')
const contactMessage = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const auth = getAuth()

const cloudFN = 'https://us-central1-assess-3-charity.cloudfunctions.net/contactFormSecure'

onMounted(() => {
  if (auth.currentUser) {
    email.value = auth.currentUser.email
    firstLastName.value = auth.currentUser.displayName
  }
})

const contactSubmission = async () => {
  let errors = []

  // Validate fields
  if (!email.value.trim()) errors.push('Email is required')
  if (!firstLastName.value.trim()) errors.push('Name is required')
  if (!contactMessage.value.trim()) errors.push('Message is required')
  if (contactMessage.value.length > 500) {
    errors.push('Message must be less than 500 characters')
  }

  // Basic Email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    errors.push('Email format is invalid')
  }

  if (errors.length > 0) {
    errorMsg.value = errors.join(', ')
    alert(errorMsg.value)
    return
  }

  // Prepare payload
  const payloadData = {
    name: firstLastName.value,
    email: email.value,
    message: contactMessage.value,
  }

  console.log('Sending payload:', payloadData)

  try {
    // Use the funciton endpoint
    const response = await axios.post(cloudFN, payloadData, {
      headers: { 'Content-Type': 'application/json' },
    })

    successMsg.value = response.data
    alert(successMsg.value)

    // Clear the form after successful submission
    contactMessage.value = ''
  } catch (err) {
    console.error('Error in contactSubmission:', err)
    errorMsg.value = err.response ? err.response.data : err.message
    alert('Error: ' + errorMsg.value)
  }
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="contact-page container my-5">
    <h1 class="mb-4 text-left text-primary">Contact Us</h1>
    <p class="lead text-left">
      If you have any questions or inquiries, feel free to reach out using the form below or through
      the provided contact information.
    </p>

    <form class="contact-form border p-4 rounded bg-light mb-4" @submit.prevent="contactSubmission">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Your Name"
          required
          class="form-control"
          v-model="firstLastName"
          :readonly="!!auth.currentUser"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Your Email"
          required
          class="form-control"
          v-model="email"
          :readonly="!!auth.currentUser"
        />
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">Message:</label>
        <textarea
          id="message"
          placeholder="Your Message"
          rows="5"
          required
          class="form-control"
          v-model="contactMessage"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <div class="contact-info mb-4">
      <h2 class="text-primary mb-3">Other Contact Information</h2>
      <p><strong>Email:</strong> info@newhorizons.org</p>
      <p><strong>Phone:</strong> +123 456 7890</p>
      <p><strong>Postal Address:</strong> Shop 4/21 Chancellors Walk, Clayton VIC 3168</p>
    </div>
    <div class="map-container">
      <h1 class="text-primary mb-4">Our Locations</h1>
      <MapTest />
    </div>
  </div>
</template>

<style scoped></style>
