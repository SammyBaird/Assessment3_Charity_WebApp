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
  <div class="testimonials-page">
    <h1>Reviews and Testimonials</h1>
    <p>See what others have said about our service.</p>
    <div class="rating-summary">
      <p v-if="ratings.length > 0">
        Average Rating: {{ averageRating.toFixed(1) }} (based on {{ ratings.length }} review<span
          v-if="ratings.length > 1"
          >s</span
        >)
      </p>
      <p v-else>No ratings yet.</p>
    </div>

    <hr />
    <div class="your-rating" v-if="currentUserEmail">
      <h2 v-if="!userRatingExists">Submit Your Rating</h2>
      <h2 v-else>Your rating has been submitted</h2>
      <div v-if="!userRatingExists">
        <div class="stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= currentUserRating }"
            @click="rate(star)"
          >
            ★
          </span>
        </div>
        <textarea
          v-model="testimonialText"
          placeholder="Enter your testimonial"
          rows="3"
        ></textarea>
        <br />
        <button @click="submitRating">Submit Rating</button>
      </div>
    </div>
    <div v-else>
      <p>Please sign in to submit your rating.</p>
    </div>

    <hr />
    <div class="ratings-list">
      <h2>All Reviews</h2>
      <div v-for="(rating, index) in ratings" :key="index" class="rating-item">
        <p>
          <strong>
            {{ rating.userFirstName ? rating.userFirstName : rating.userEmail }}
          </strong>
          rated: {{ rating.rating }}/5
        </p>
        <p>"{{ rating.testimonial }}"</p>
        <hr />
      </div>
    </div>

    <p v-if="loading">Loading ratings...</p>
  </div>
</template>

<style scoped>
.testimonials-page {
  text-align: center;
  padding: 2rem;
  color: #000;
}

.rating-summary p,
.ratings-list p {
  font-size: 1.2rem;
}

.stars {
  cursor: pointer;
  margin-bottom: 1rem;
}

.star {
  color: #ccc;
  font-size: 2rem;
  transition: color 0.2s;
}

.star.filled {
  color: gold;
}

textarea {
  width: 100%;
  max-width: 500px;
  margin: 1rem auto;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.rating-item {
  margin: 1rem auto;
  max-width: 600px;
  text-align: left;
}

hr {
  margin: 1rem 0;
}
</style>
