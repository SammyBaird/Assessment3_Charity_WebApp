<template>
  <hi>Sign In To Your Account</hi>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="text" placeholder="Password" v-model="password" /></p>
  <p v-if="errMsg" class="error">{{ errMsg }}</p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="singInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const router = useRouter()
const errMsg = ref()
const register = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      console.log('User created successfully!')
      router.push('/feed')
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

//   const singInWithGoogle = () => {
//     const provider = new firebase.auth.GoogleAuthProvider()
//     getAuth()
//       .signInWithPopup(provider)
//       .then((result) => {
//         console.log('User signed in with Google successfully!')
//         router.push('/feed')
//       })
//       .catch((error) => {
//         console.error(error.code)
//         alert(error.message)
//       })
//   }
// }
</script>
