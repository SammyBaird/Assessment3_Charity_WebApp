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

// Function to handle sign-in with email and password
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

// Function to handle sign-in with Google
const singInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  const db = getFirestore()
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user
      const additionalUserInfo = result.additionalUserInfo
      if (additionalUserInfo?.isNewUser) {
        console.log('New user detected. Redirecting to register page.')
        router.push('/register')
      } else {
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
          router.push('/register')
        }
      }
    })
    .catch((error) => {
      console.error(error.code)
      alert(error.message)
    })
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Sign In To Your Account</h1>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="form-group mb-3">
          <input type="text" class="form-control" placeholder="Email" v-model="email" />
        </div>
        <div class="form-group mb-3">
          <input type="password" class="form-control" placeholder="Password" v-model="password" />
        </div>
        <p v-if="errMsg" class="text-danger">{{ errMsg }}</p>
        <div class="d-grid gap-2">
          <button class="btn btn-primary" @click="signIn">Submit</button>
          <button class="btn btn-danger" @click="singInWithGoogle">Sign In With Google</button>
        </div>
      </div>
    </div>
  </div>
</template>
