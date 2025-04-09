<script>
// Using the below code from Module Video
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
        {
          id: 3,
          title: 'Post Three',
          content: 'More updates on our mission in this third post.',
        },
      ],
    }
  },
}
</script>

<template>
  <div class="container my-5 home-page">
    <div class="position-relative mb-5">
      <img
        class="img-fluid w-100"
        src="@/assets/charity_background.webp"
        alt="Charity Background"
      />
    </div>

    <!-- Donate Button Section (placed below the image) -->
    <div class="text-center my-5">
      <RouterLink
        to="/donation/donation-options"
        class="btn btn-donate btn-lg text-uppercase fw-bold"
      >
        Donate Today!
      </RouterLink>
    </div>
    <!-- Welcome Content -->
    <div class="content text-center my-5" style="margin-top: 40px">
      <h1 class="mb-4 animated-gradient">Welcome to New Horizons</h1>
      <p class="lead">
        Your support makes a difference in the lives of those we serve. We are dedicated to
        providing assistance to refugees and asylum seekers in Australia. Our mission is to help
        those in need by offering essential services and support. We believe in the power of
        community and the importance of standing together in times of crisis.
      </p>
      <p class="lead">Join us in our mission to provide assistance and hope to those in need.</p>
    </div>

    <!-- Post Cards -->
    <div class="con-cards">
      <div class="row">
        <div v-for="post in posts" :key="post.id" class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h2 class="card-title">{{ post.title }}</h2>
              <p class="card-text flex-grow-1" style="white-space: pre-line">
                {{ post.content }}
              </p>
              <div class="mt-3">
                <RouterLink v-if="post.id === 1" to="/donation/money-spent" class="btn btn-primary">
                  Learn More
                </RouterLink>
                <RouterLink
                  v-else-if="post.id === 2"
                  to="/refugees/how-we-help"
                  class="btn btn-primary"
                >
                  Read More
                </RouterLink>
                <RouterLink v-else-if="post.id === 3" to="/post-three" class="btn btn-primary">
                  Discover More
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  color: #000;
}

.content {
  position: relative;
  z-index: 1;
  margin-top: 5px;
}

.btn-donate {
  background-color: #f37f12;
  color: #fff;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.2rem;
  margin-top: auto;
  margin-bottom: auto;
}

.btn-primary {
  background-color: #00a2ff;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 1rem;
  justify-self: center;
}

.img-fluid {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.animated-gradient {
  background: linear-gradient(270deg, #00a2ff, #f37f12, #00a2ff);
  background-size: 300% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 5s linear infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 100% center;
  }
}
</style>
