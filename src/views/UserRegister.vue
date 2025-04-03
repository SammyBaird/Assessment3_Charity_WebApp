<template>
  <div class="registration">
    <h1>Create an Account</h1>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <label for="accountType">Account Type:</label>
    <select v-model="accountType" id="accountType">
      <option value="donor">Donor</option>
      <option value="refugee">Refugee</option>
    </select>
    <button @click="register">Register</button>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const accountType = ref('donor')
const errorMsg = ref('')
const router = useRouter()

const auth = getAuth()
const db = getFirestore()

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      accountType: accountType.value,
      createdAt: new Date().toISOString(),
    })

    router.push('/feed')
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<style scoped>
.registration {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #ffffff;
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
