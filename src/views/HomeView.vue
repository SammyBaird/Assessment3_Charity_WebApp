<script>
export default {
  name: 'HomeView',
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Our Contributions',
          content: `
            Want to understand our impact on the humanitarian crisis in Australia?
            Check out our contributions to the cause.
            We strive to provide food, shelter, and support to those in need,
            and your help makes it all possible.
            `,
        },
        {
          id: 2,
          title: 'Need Urgent Assistance?',
          content: `
            We provide assistance in a number of ways. Check out our services to see how we can help:
            - Housing
            - Legal aid
            - Language support
          `,
        },
        { id: 3, title: 'Post Three', content: 'More updates on our mission in this third post.' },
      ],
    }
  },
}
</script>

<template>
  <div class="home-page">
    <img class="background-img" src="@/assets/charity_background.webp" alt="Charity Background" />

    <div class="donation-link">
      <RouterLink to="/donation/donation-options" class="donation-button">Donate Today!</RouterLink>
    </div>

    <div class="content">
      <h1>Welcome to New Horizons</h1>
      <p>
        Your support makes a difference in the lives of those we serve. We are dedicated to
        providing assistance to refugees and asylum seekers in Australia. Our mission is to help
        those in need by offering essential services and support. We believe in the power of
        community and the importance of standing together in times of crisis.
      </p>
      <p>Join us in our mission to provide assistance and hope to those in need.</p>
    </div>

    <div class="con-cards">
      <div class="row">
        <div v-for="post in posts" :key="post.id" class="col-md-4 mb-3">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">{{ post.title }}</h2>
              <p class="card-text">{{ post.content }}</p>
              <RouterLink v-if="post.id === 1" to="donation/money-spent" class="btn btn-primary"
                >Learn More</RouterLink
              >
              <RouterLink
                v-else-if="post.id === 2"
                to="/refugees/how-we-help"
                class="btn btn-primary"
                >Read More</RouterLink
              >
              <RouterLink v-else-if="post.id === 3" to="/post-three" class="btn btn-primary"
                >Discover More</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
}

.card-text {
  white-space: pre-line;
}

.background-img {
  width: 100%;
  max-height: 1200px;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: contain;
}

.donation-link {
  margin: 2rem 0;
}

.donation-button {
  display: inline-block;
  background: #f37f12;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.donation-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.donation-button::after {
  content: none !important;
}

.content {
  width: 100%;
  padding: 1rem;
  text-align: center;
}

.content h1 {
  /*Attempting to Animate the Title*/
  background: linear-gradient(270deg, #00a2ff, #f37f12, #00a2ff);
  background-size: 300% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 5s linear infinite;
}
/*Attempting to Animate the Title*/
@keyframes gradientShift {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 100% center;
  }
}
</style>
