<script>
export default {
  name: 'FeedView',
  data() {
    return {
      posts: [
        { id: 1, title: 'Eligibilty Checker', content: 'This feature is current on its way.' },
        { id: 2, title: 'Donations and Funding Recieved', content: 'Enter some text here.' },
      ],
    }
  },
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <div class="container py-4 feed-page">
    <h1 class="mb-4">Your Assistance Hub</h1>
    <div class="row">
      <div v-for="post in posts" :key="post.id" class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">{{ post.title }}</h2>
            <p class="card-text">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
