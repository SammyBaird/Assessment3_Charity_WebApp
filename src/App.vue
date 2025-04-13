<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderSection.vue'
import Footer from '@/components/FooterSection.vue'
import ChatBox from '@/components/ChatBox.vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <Header :isDarkMode="isDarkMode" @toggle-dark="toggleDarkMode" />

    <main class="flex-fill container mt-5 pt-5">
      <RouterView />
    </main>

    <ChatBox />

    <div class="container">
      <Footer />
    </div>
  </div>
</template>

<!-- Testing add dark mode in this way. Light mode uses BS default -->
<style>
.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-mode .card,
.dark-mode header,
.dark-mode footer,
.dark-mode main,
.dark-mode .container {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark-mode a:hover {
  color: #3700b3;
}

.dark-mode button {
  background-color: #333333;
  color: #e0e0e0;
  border: 1px solid #444444;
}

.dark-mode button:hover {
  background-color: #444444;
}

.dark-mode input,
.dark-mode textarea {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #444444;
}

.dark-mode input::placeholder,
.dark-mode textarea::placeholder {
  color: #888888;
}

.dark-mode .table {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #444444;
}

.dark-mode .table th,
.dark-mode .table td {
  border-color: #444444;
}

.dark-mode .table thead th {
  background-color: #2c2c2c;
  color: #e0e0e0;
}
</style>
