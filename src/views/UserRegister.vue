<template>
  <hi>Create an Account</hi>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="text" placeholder="Password" v-model="password" /></p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="singInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const router = useRouter()
const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => {
      console.log('User created successfully!')
      router.push('/feed')
    })
    .catch((error) => {
      console.error(error.code)
      alert(error.message)
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
