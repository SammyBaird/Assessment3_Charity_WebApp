<template>
  <div class="container py-4 feed-page">
    <h1 class="mb-4">Your Donor Hub</h1>
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

<script>
export default {
  name: 'FeedView',
  data() {
    return {
      posts: [
        { id: 1, title: 'Post One', content: 'This is the first post on our feed.' },
        { id: 2, title: 'Post Two', content: 'Here is some more information in the second post.' },
        { id: 3, title: 'Post Three', content: 'More updates on our mission in this third post.' },
      ],
    }
  },
}
</script>

<style scoped>
.feed-page {
  padding: 2rem;
  background: #faf0e6;
}

.feed-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feed-post {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #ffffff;
}

.feed-post h2 {
  margin: 0 0 0.5rem;
}

.feed-post p {
  margin: 0;
}
</style>
