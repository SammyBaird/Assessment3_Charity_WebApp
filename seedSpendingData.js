import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import fs from 'fs'
import path from 'path'

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyD9im9Z-nlpSWtvDrC6buWqBlk8L_W9fj0',
  authDomain: 'assess-3-charity.firebaseapp.com',
  projectId: 'assess-3-charity',
  storageBucket: 'assess-3-charity.firebasestorage.app',
  messagingSenderId: '260917059880',
  appId: '1:260917059880:web:8ba0f7f482499c9958b01d',
  measurementId: 'G-CK84HMLQHE',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const dataPath = path.join('spendingdata.json')

fs.readFile(dataPath, 'utf8', async (err, fileData) => {
  if (err) {
    console.error('Error reading spendingdata.json:', err)
    return
  }
  try {
    const spendingData = JSON.parse(fileData)
    for (const entry of spendingData) {
      // Each entry will be added as a new document in the "spending" collection
      const docRef = await addDoc(collection(db, 'spending'), entry)
      console.log('Added document with ID:', docRef.id, 'for', entry.month)
    }
    console.log('Seeding complete!')
    // process.exit(0)
  } catch (error) {
    console.error('Error parsing JSON or seeding data:', error)
    // process.exit(1)
  }
})
