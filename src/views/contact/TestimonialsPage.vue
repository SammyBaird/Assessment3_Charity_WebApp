<script>
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default {
  name: 'TestimonialsPage',
  data() {
    return {
      ratings: [],
      currentUserRating: 0,
      testimonialText: '',
      userRatingExists: false,
      currentUserEmail: '',
      currentUserFirstName: '',
      loading: false,
    }
  },
  computed: {
    // Calc average ratings
    averageRating() {
      if (this.ratings.length === 0) return 0
      return this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length
    },
  },

  async created() {
    this.loading = true
    await this.fetchRatings()
    // Try to get the user info
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      this.currentUserEmail = user.email
      this.currentUserFirstName = user.displayName
      await this.checkUserRating()
    }
    this.loading = false
  },

  methods: {
    async fetchRatings() {
      try {
        const db = getFirestore()
        const ratingsRef = collection(db, 'ratings')
        const snapshot = await getDocs(ratingsRef)
        this.ratings = snapshot.docs.map((doc) => doc.data())
      } catch (error) {
        console.error('Error fetching ratings:', error)
      }
    },
    async checkUserRating() {
      if (!this.currentUserEmail) return
      try {
        const db = getFirestore()
        const ratingsRef = collection(db, 'ratings')
        const q = query(ratingsRef, where('userEmail', '==', this.currentUserEmail))
        const querySnapshot = await getDocs(q)
        this.userRatingExists = !querySnapshot.empty
      } catch (error) {
        console.error('Error checking existing rating:', error)
      }
    },
    async submitRating() {
      if (!this.currentUserEmail) {
        alert('You must be logged in to submit a rating.')
        return
      }
      if (this.userRatingExists) {
        alert('You have already submitted a rating.')
        return
      }
      if (this.currentUserRating === 0 || this.testimonialText.trim() === '') {
        alert('Please select a rating and enter a testimonial.')
        return
      }
      try {
        const db = getFirestore()
        const ratingsRef = collection(db, 'ratings')
        await addDoc(ratingsRef, {
          userFirstName: this.currentUserFirstName,
          userEmail: this.currentUserEmail,
          rating: this.currentUserRating,
          testimonial: this.testimonialText.trim(),
        })
        alert('Thank you for your feedback!')
        // Refresh ratings after submitting
        await this.fetchRatings()
        this.userRatingExists = true
      } catch (error) {
        console.error('Error submitting rating:', error)
        alert('There was an error submitting your rating. Please try again later.')
      }
    },
    rate(value) {
      this.currentUserRating = value
    },
  },
}
</script>

<template>
  <div class="container py-5 testimonials-page">
    <div class="text-left mb-5">
      <h1 class="text-primary mb-4">Our Community Speaks</h1>
      <p class="lead">
        <!-- Text generate by GenAI -->
        We truly value the feedback from our community – both our donors and refugees. Your reviews
        help us understand what we are doing right and where we can improve. They drive us to meet
        our core principles by ensuring that every service we provide addresses your real pain
        points. We listen closely, act on your feedback, and strive to enhance our support and
        services every day.
      </p>
      <p>
        Whether you are a donor who wants to make an impact or a refugee seeking help and guidance,
        your voice matters. Thank you for taking the time to share your experience.
      </p>
    </div>

    <hr />

    <div class="rating-summary text-center mb-4">
      <p v-if="ratings.length > 0" class="h5">
        Average Rating: {{ averageRating.toFixed(1) }}
        <small class="text-muted"
          >(based on {{ ratings.length }} review<span v-if="ratings.length > 1">s</span>)</small
        >
      </p>
      <p v-else class="h5">No ratings yet.</p>
    </div>

    <hr />

    <div class="your-rating mb-5" v-if="currentUserEmail">
      <div v-if="!userRatingExists">
        <h2 class="h4 text-center mb-3">Submit Your Rating</h2>
        <div class="stars text-center mb-3">
          <span
            v-for="star in 5"
            :key="star"
            class="fs-1"
            :class="star <= currentUserRating ? 'text-warning' : 'text-secondary'"
            @click="rate(star)"
            style="cursor: pointer"
          >
            ★
          </span>
        </div>
        <div class="mb-3">
          <textarea
            v-model="testimonialText"
            class="form-control"
            placeholder="Enter your testimonial"
            rows="3"
          ></textarea>
        </div>
        <div class="text-center">
          <button @click="submitRating" class="btn btn-primary">Submit Rating</button>
        </div>
      </div>
      <div v-else class="text-center">
        <h2 class="h4">Your rating has been submitted</h2>
      </div>
    </div>
    <div v-else class="text-center mb-5">
      <p>Please sign in to submit your rating.</p>
    </div>

    <hr />

    <div class="ratings-list mt-5">
      <h2 class="h4 text-center mb-4">All Reviews</h2>
      <div
        v-for="(rating, index) in ratings"
        :key="index"
        class="rating-item mb-4 p-3 border rounded"
      >
        <p class="mb-1">
          <strong>{{ rating.userFirstName ? rating.userFirstName : rating.userEmail }}</strong>
          rated: <span class="text">{{ rating.rating }}</span
          >/5
        </p>
        <p class="mb-0">"{{ rating.testimonial }}"</p>
      </div>
    </div>

    <div v-if="loading" class="text-center">
      <p>Loading ratings...</p>
    </div>
  </div>
</template>

<style scoped>
.testimonials-page {
  color: #000;
}
</style>
