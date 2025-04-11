<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const accountType = ref('donor')
const firstName = ref('')
const lastName = ref('')
const gender = ref('Prefer not to say')
const errorMsg = ref('')
const router = useRouter()

const auth = getAuth()
const db = getFirestore()

const countries = ref([])
const nationality = ref('')

// Fetch countries from API
onMounted(async () => {
  try {
    const response = await fetch('https://restcountries.com/v2/all')
    const data = await response.json()
    countries.value = data.sort((a, b) => a.name.localeCompare(b.name))
    console.log('Countries:', countries.value)
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
})

// Register function
const register = async () => {
  // basic validation -- May improve later
  let errors = []

  // Check for empty fields
  if (!email.value) errors.push('Email is required')
  if (!password.value) errors.push('Password is required')
  if (!confirmPassword.value) errors.push('Confirm Password is required')
  if (!firstName.value) errors.push('First Name is required')
  if (!lastName.value) errors.push('Last Name is required')
  if (!nationality.value) errors.push('Nationality is required')

  // Check for password match
  if (password.value !== confirmPassword.value) errors.push('Passwords do not match')

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    errors.push('Email format is invalid')
  }

  // Check password length
  if (password.value && (password.value.length < 6 || password.value.length > 16)) {
    errors.push('Password must be between 6 and 16 characters in length')
  }

  // Check if there are any errors
  if (errors.length > 0) {
    errorMsg.value = errors.join(', ')
    return
  }

  // Proceed with registration
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Update the Firebase Auth profile to store the first name as displayName
    await updateProfile(user, { displayName: firstName.value })

    // Save additional user data in the Firestore "users" collection
    await setDoc(doc(db, 'users', user.uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      email: user.email,
      accountType: accountType.value,
      gender: gender.value,
      nationality: nationality.value.name,
      region: nationality.value.region,
      createdAt: new Date().toISOString(),
    })

    try {
      // Push based on created account type
      if (accountType.value === 'refugee') {
        router.push('/user-portal/refugee')
      } else if (accountType.value === 'donor') {
        router.push('/user-portal/donor')
      }
    } catch (err) {
      console.error('Error redirecting:', err)
    }
  } catch (err) {
    errorMsg.value = err.message
    alert('Error: ' + err.message)
  }
}

// Google registration function
const googleRegister = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Check if the user document exists
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      const names = user.displayName?.split(' ') || []
      const first = names[0] || ''
      const last = names.slice(1).join(' ') || ''

      await setDoc(userDocRef, {
        firstName: first,
        lastName: last,
        email: user.email,
        accountType: '',
        gender: gender.value || 'Prefer not to say',
        nationality: '',
        region: '',
        createdAt: new Date().toISOString(),
      })
      router.push('/completeProfile')
    } else {
      console.log('User is already registered')
      router.push('/')
    }
  } catch (err) {
    errorMsg.value = err.message
    alert('Error: ' + err.message)
  }
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="container mt-5">
    <h1 class="text-center text-primary mb-4">Create an Account</h1>
    <div class="card p-4 shadow-sm">
      <div class="row mb-3">
        <div class="col">
          <input
            type="text"
            v-model="firstName"
            class="form-control"
            placeholder="First Name"
            required
          />
        </div>
        <div class="col">
          <input
            type="text"
            v-model="lastName"
            class="form-control"
            placeholder="Last Name"
            required
          />
        </div>
      </div>
      <div class="mb-3">
        <input type="email" v-model="email" class="form-control" placeholder="Email" required />
      </div>
      <div class="mb-3">
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="Password"
          required
          minlength="6"
          maxlength="16"
        />
      </div>
      <div class="mb-3">
        <input
          type="password"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Confirm Password"
          required
          minlength="6"
          maxlength="16"
        />
      </div>
      <div class="mb-3">
        <label for="accountType" class="form-label">Account Type:</label>
        <select v-model="accountType" id="accountType" class="form-select" required>
          <option value="donor">Donor</option>
          <option value="refugee">Refugee</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="gender" class="form-label">Gender:</label>
        <select v-model="gender" id="gender" class="form-select">
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary / Gender diverse">Non-binary / Gender diverse</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="nationality" class="form-label">Nationality:</label>
        <select v-model="nationality" id="nationality" class="form-select" required>
          <option disabled value="">Please select your country</option>
          <option v-for="country in countries" :key="country.alpha2Code" :value="country">
            {{ country.name }}
          </option>
        </select>
      </div>
      <div class="d-flex justify-content-center gap-2">
        <button @click="register" class="btn btn-primary">Register</button>
        <button @click="googleRegister" class="btn btn-secondary">Register with Google</button>
        <button @click="$router.push('/signin')" class="btn btn-info">
          Have an Account? Sign In
        </button>
      </div>
      <p v-if="errorMsg" class="text-danger text-center mt-3">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
