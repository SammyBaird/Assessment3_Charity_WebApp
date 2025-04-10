<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

// Reactive variables for user profile data.
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const accountType = ref('')
const gender = ref('Prefer not to say')
const errorMsg = ref('')
const successMsg = ref('')
const countries = ref([])
const nationality = ref('')

// On mount, load the current user's profile from Firestore
onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    email.value = user.email
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      const data = userDocSnap.data()
      firstName.value = data.firstName || ''
      lastName.value = data.lastName || ''
      accountType.value = data.accountType || ''
      gender.value = data.gender || 'Prefer not to say'
      // If the user has already saved a country, we later match it to an object.
      if (data.nationality) {
        nationality.value = { name: data.nationality, region: data.region || '' }
      } else {
        nationality.value = ''
      }
    }
  }
  // Fetch the full list of countries in the same way as in registration.
  try {
    const response = await fetch('https://restcountries.com/v2/all')
    const data = await response.json()
    countries.value = data.sort((a, b) => a.name.localeCompare(b.name))
    // If a nationality was saved as a string, try to find the full country object.
    if (
      nationality.value &&
      typeof nationality.value === 'object' &&
      !nationality.value.alpha2Code
    ) {
      const match = countries.value.find((country) => country.name === nationality.value.name)
      if (match) {
        nationality.value = match
      }
    }
    console.log('Countries:', countries.value)
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
})

// Function to update the user profile in Firestore.
const updateProfileInfo = async () => {
  const user = auth.currentUser
  if (!user) {
    errorMsg.value = 'No authenticated user found.'
    return
  }
  // Validate required fields
  if (!accountType.value || accountType.value === '') {
    errorMsg.value = 'Please select an account type.'
    return
  }
  if (!nationality.value || nationality.value === '') {
    errorMsg.value = 'Please select your country.'
    return
  }
  try {
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, {
      firstName: firstName.value,
      lastName: lastName.value,
      accountType: accountType.value,
      gender: gender.value,
      // Save the country name and region as stored in registration.
      nationality: nationality.value.name,
      region: nationality.value.region,
    })
    successMsg.value = 'Profile updated successfully!'
    // Route user based on their account type.
    if (accountType.value === 'refugee') {
      router.push('/user-portal/refugee')
    } else if (accountType.value === 'donor') {
      router.push('/user-portal/donor')
    } else {
      router.push('/') // fallback route
    }
  } catch (error) {
    errorMsg.value = error.message
  }
}
</script>

<template>
  <div class="complete-profile container my-5">
    <h1 class="mb-4 text-center">Complete Your Profile</h1>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form @submit.prevent="updateProfileInfo" class="profile-form">
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name:</label>
        <input type="text" id="firstName" v-model="firstName" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name:</label>
        <input type="text" id="lastName" v-model="lastName" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" id="email" v-model="email" class="form-control" readonly />
      </div>

      <div class="mb-3">
        <label for="accountType" class="form-label">Account Type:</label>
        <select id="accountType" v-model="accountType" class="form-select" required>
          <option disabled value="">Select account type</option>
          <option value="donor">Donor</option>
          <option value="refugee">Refugee</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="gender" class="form-label">Gender:</label>
        <select id="gender" v-model="gender" class="form-select">
          <option disabled value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary / Gender diverse">Non-binary / Gender diverse</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="nationality" class="form-label">Nationality:</label>
        <select id="nationality" v-model="nationality" class="form-select" required>
          <option disabled value="">Please select your country</option>
          <option v-for="country in countries" :key="country.alpha2Code" :value="country">
            {{ country.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
  </div>
</template>

<style scoped>
.complete-profile {
  max-width: 600px;
  margin: 0 auto;
}
</style>
