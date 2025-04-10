<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Your Donor Hub</h1>
    <div class="card mb-4 shadow">
      <div class="card-body">
        <h3 class="card-title">Welcome, {{ currentUser ? currentUser.displayName : 'Donor' }}!</h3>
        <p class="card-text">
          Thank you for your continued generosity.
          <span v-if="joinDate">
            You have been aiding refugees for <strong>{{ yearsAsDonor }}</strong> years.
          </span>
          <span v-else> Your join date is not available at this moment. </span>
        </p>
      </div>
    </div>

    <div class="row">
      <div v-for="post in posts" :key="post.id" class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title h5">{{ post.title }}</h2>
            <p class="card-text">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default {
  name: 'DonorPortal',
  data() {
    return {
      posts: [
        { id: 1, title: 'Post One', content: 'This is the first post on our feed.' },
        { id: 2, title: 'Post Two', content: 'Here is some more information in the second post.' },
        { id: 3, title: 'Post Three', content: 'More updates on our mission in this third post.' },
      ],
      joinDate: null,
      currentUser: null,
    }
  },
  computed: {
    yearsAsDonor() {
      if (!this.joinDate) return 0
      const join = new Date(this.joinDate)
      const now = new Date()
      const diffMs = now - join
      const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)
      return diffYears.toFixed(1)
    },
  },
  async created() {
    const auth = getAuth()
    this.currentUser = auth.currentUser
    if (this.currentUser) {
      const db = getFirestore()
      const userDocRef = doc(db, 'users', this.currentUser.uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        this.joinDate = userDoc.data().joinDate
      }
    }
  },
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
</style>
