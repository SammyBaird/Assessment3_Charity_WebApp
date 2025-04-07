<template>
  <hi>Sign In To Your Account</hi>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg" class="error">{{ errMsg }}</p>
  <p><button @click="signIn">Submit</button></p>
  <p><button @click="singInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
import { ref } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getDoc, doc, getFirestore } from 'firebase/firestore'
import { useRouter } from 'vue-router'
const db = getFirestore()
const email = ref('')
const password = ref('')
const router = useRouter()
const errMsg = ref()

//
const signIn = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.accountType === 'donor') {
          router.push('/user-portal/donor')
        } else if (data.accountType === 'refugee') {
          router.push('/user-portal/refugee')
        } else {
          console.warn('Account type not recognized. Redirecting to home.')
          router.push('/')
        }
      } else {
        console.error('No user document found for:', user.uid)
        router.push('/feed')
      }
    })
    .catch((error) => {
      console.error(error.code)
      switch (error.code) {
        case 'auth/user-not-found':
          errMsg.value = 'User not found. Please register.'
          break
        case 'auth/wrong-password':
          errMsg.value = 'Incorrect password. Please try again.'
          break
        default:
          errMsg.value = 'Email or Password was incorrect.'
      }
    })
}

const singInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  const db = getFirestore()
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.accountType === 'donor') {
          router.push('/donor-portal')
        } else if (data.accountType === 'refugee') {
          router.push('/refugee-portal')
        } else {
          console.warn('Account type not recognized. Redirecting to home.')
          router.push('/')
        }
      } else {
        console.error('No user document found for:', user.uid)
        router.push('/feed')
      }
    })
    .catch((error) => {
      console.error(error.code)
      alert(error.message)
    })
}
</script>
