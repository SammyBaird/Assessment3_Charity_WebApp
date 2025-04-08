<template>
  <h1>Create an Account</h1>
  <div class="registration">
    <div class="name-inputs">
      <input type="text" v-model="firstName" placeholder="First Name" required />
      <input type="text" v-model="lastName" placeholder="Last Name" required />
    </div>
    <input type="text" v-model="email" placeholder="Email" required />
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      required
      minlength="6"
      maxlength="16"
    />
    <input
      type="password"
      v-model="confirmPassword"
      placeholder="Confirm Password"
      required
      minlength="6"
      maxlength="16"
    />

    <label for="accountType">Account Type:</label>
    <select v-model="accountType" id="accountType" required>
      <option value="donor">Donor</option>
      <option value="refugee">Refugee</option>
    </select>

    <label for="gender">Gender:</label>
    <select v-model="gender" id="gender">
      <option value="Female">Female</option>
      <option value="Male">Male</option>
      <option value="Non-binary / Gender diverse">Non-binary / Gender diverse</option>
      <option value="Prefer not to say">Prefer not to say</option>
    </select>

    <label for="nationality">Nationality:</label>
    <select v-model="nationality" id="nationality" required>
      <option disabled value="">Please select your country</option>
      <option v-for="country in countries" :key="country.alpha2Code" :value="country">
        {{ country.name }}
      </option>
    </select>

    <div class="button-group">
      <button @click="register">Register</button>
      <button @click="$router.push('/signin')">Have an Account? Sign In</button>
    </div>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

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

// Fetch countries from API (Couldn't get v3.1 to work)
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
  // basic validation -- Could be improved
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

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

    router.push('/feed')
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  grid-column: 1 / -1;
  margin-bottom: 3rem;
  color: #4792bd;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.name-inputs {
  display: flex;
  gap: 1rem;
}

.name-inputs input {
  flex: 1;
}

.registration {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #ffffff;
  grid-column: 1 / -1;
  justify-self: center;
}

.registration input,
.registration select {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.registration button {
  padding: 0.75rem 1.5rem;
  background-color: #4792bd;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.registration button:hover {
  background-color: #2c3e50;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
