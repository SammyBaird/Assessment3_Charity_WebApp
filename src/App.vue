<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <Header />

  <main class="flex-fill container mt-5 pt-5">
    <RouterView />
  </main>

  <div class="container">
    <Footer />
  </div>
</template>

<style scoped>
main {
  margin-top: 100px;
}

.btn-link {
  text-decoration: none;
  color: inherit;
}
</style>
