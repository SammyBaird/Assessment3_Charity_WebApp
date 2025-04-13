<script>
import { getFirestore, doc, getDocs, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import DonationTable from '@/components/GetDonationTable.vue'

// Using approach from the module video
export default {
  name: 'DonorPortal',
  components: {
    DonationTable,
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Donation Summary',
          content: '',
        },
        { id: 2, title: 'Post Two', content: 'Here is some more information in the second post.' },
        { id: 3, title: 'Post Three', content: 'More updates on our mission in this third post.' },
      ],
      donationData: 0,
      joinDate: null,
      currentUser: null,
    }
  },
  computed: {
    donationSummary() {
      return `Your total donation amount is $${this.donationData}`
    },
    daysAsDonor() {
      if (!this.joinDate) return 0
      const join = new Date(this.joinDate)
      const now = new Date()
      return Math.floor((now - join) / (1000 * 60 * 60 * 24)) + 1
    },
  },
  async created() {
    const auth = getAuth()
    this.currentUser = auth.currentUser
    const db = getFirestore()
    const querySnapshot = await getDocs(collection(db, 'donations'))
    const allDonations = querySnapshot.docs.map((doc) => doc.data())

    if (this.currentUser && this.currentUser.uid) {
      const totalDonationAmount = allDonations.reduce(
        (sum, donation) => sum + (donation.amount || 0),
        0,
      )
      this.donationData = totalDonationAmount
      this.posts[0].content = this.donationSummary

      // Fetch join date from the users collection
      const userDocRef = doc(db, 'users', this.currentUser.uid)
      const userDoc = await getDocs(userDocRef)
      if (userDoc.exists()) {
        this.joinDate = userDoc.data().createdAt
      }
    } else {
      console.error('No user is signed in.')
    }
  },
  // Watch to update donation amount
  watch: {
    donationSummary(newVal) {
      this.posts[0].content = newVal
    },
  },
}
</script>

<!-- Bootstrap for Responsiveness -->
<template>
  <div class="container py-4">
    <h1 class="mb-4 text-left text-primary">Your Donor Hub</h1>
    <h3 class="card-title">Welcome, {{ currentUser ? currentUser.displayName : 'Donor' }}!</h3>
    <p class="card-text">
      Thank you for your continued generosity.
      <span v-if="joinDate">
        You have been aiding refugees for <strong>{{ daysAsDonor }}</strong> days.
      </span>
      <span v-else> Your join date is not available at this moment.</span>
    </p>
    <div class="card shadow">
      <div class="card-body">
        <DonationTable />

        <div class="row mt-4">
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
    </div>
  </div>
</template>

<style scoped></style>
