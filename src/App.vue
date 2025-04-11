<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderSection.vue'
import Footer from '@/components/FooterSection.vue'
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

<style scoped></style>
