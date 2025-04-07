import './assets/base.css'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD9im9Z-nlpSWtvDrC6buWqBlk8L_W9fj0',
  authDomain: 'assess-3-charity.firebaseapp.com',
  projectId: 'assess-3-charity',
  storageBucket: 'assess-3-charity.firebasestorage.app',
  messagingSenderId: '260917059880',
  appId: '1:260917059880:web:8ba0f7f482499c9958b01d',
  measurementId: 'G-CK84HMLQHE',
}

initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

const app = createApp(App)
app.config.devtools = false
app.use(router)
app.mount('#app')
