<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/refugees">Asylum Seekers and Refugees</RouterLink>
      <RouterLink to="/about">About Us</RouterLink>
      <RouterLink to="/get-involved">Get Involved</RouterLink>
      <RouterLink to="/contact">Contact and Support</RouterLink>
      <RouterLink to="/donations">Donate Today</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  background: #9c9a9a;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

nav .router-link-active {
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

main {
  margin-top: 5rem;
  padding: 1rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    background: #f0f0f073;
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
