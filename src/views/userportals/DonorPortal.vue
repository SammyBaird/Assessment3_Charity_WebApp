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

  // Calc the users join date
  computed: {
    daysAsDonor() {
      if (!this.joinDate) return 0
      const joinDate = new Date(this.joinDate)
      const currentDate = new Date()
      const timeDifference = currentDate.getTime() - joinDate.getTime()
      return Math.floor(timeDifference / (1000 * 60 * 60 * 24) + 1) // Add 1 to include the join date
    },
  },

  // Fetch the current user and their join date from Firestore
  async created() {
    const auth = getAuth()
    this.currentUser = auth.currentUser
    if (this.currentUser) {
      const db = getFirestore()
      const userDocRef = doc(db, 'users', this.currentUser.uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        this.joinDate = userDoc.data().createdAt
      }
    }
  },
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="container py-4">
    <h1 class="mb-4 text-center">Your Donor Hub</h1>
    <div class="card mb-4 shadow">
      <div class="card-body">
        <h3 class="card-title">Welcome, {{ currentUser ? currentUser.displayName : 'Donor' }}!</h3>
        <p class="card-text">
          Thank you for your continued generosity.
          <span v-if="joinDate">
            You have been aiding refugees for <strong>{{ daysAsDonor }}</strong> days.
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

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}
</style>
