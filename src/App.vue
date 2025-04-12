<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderSection.vue'
import Footer from '@/components/FooterSection.vue'
import ChatBox from '@/components/ChatBox.vue'
</script>

<template>
  <Header />

  <main class="flex-fill container mt-5 pt-5">
    <RouterView />
  </main>

  <ChatBox />

  <div class="container">
    <Footer />
  </div>
</template>

<style scoped></style>
