<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from './components/SearchBar.vue'

import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import router from './router'
const isLoggedIn = ref(false)

let auth
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      router.push('/')
      console.log('User signed out successfully!')
      isLoggedIn.value = false
    })
    .catch((error) => {
      console.error('Error signing out:', error)
    })
}
</script>

<template>
  <header>
    <div class="header-container">
      <img class="logo" src="@/assets/new_horizons.svg" alt="Logo" />
      <nav>
        <ul class="nav-menu">
          <li><RouterLink to="/">Home</RouterLink></li>

          <!-- Dropdown Menu -->
          <li class="dropdown">
            <span class="dropbtn">Assylum Seekers & Refugees</span>
            <ul class="dropdown-content">
              <li><RouterLink to="/refugees/how-we-help">How We Help</RouterLink></li>
              <li><RouterLink to="/refugees/housing">Housing and Finance</RouterLink></li>
              <li><RouterLink to="/refugees/legal">Legal Aid</RouterLink></li>
              <li><RouterLink to="/refugees/language">Language and Education</RouterLink></li>
            </ul>
          </li>

          <li><RouterLink to="/about">About Us</RouterLink></li>
          <li><RouterLink to="/get-involved">Get Involved</RouterLink></li>
          <li><RouterLink to="/contact">Contact and Support</RouterLink></li>
          <li><RouterLink to="/donations">Donate Today</RouterLink></li>
          <li><RouterLink to="/feed">Feed</RouterLink></li>
          <li><RouterLink to="/register">Register</RouterLink></li>
          <li><RouterLink to="/signin">Sign In</RouterLink></li>
          <li>
            <button v-if="isLoggedIn" @click="handleSignOut" class="sign-out-button">
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <SearchBar />
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

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Main navigation styling */
.nav-menu {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-menu > li {
  position: relative;
  margin-right: 1rem;
}

/* Dropdown button styling */
.dropbtn {
  cursor: pointer;
  padding: 0.5rem 1rem;
}

/* Dropdown content styling - hidden by default */
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #9c9a9a;
  min-width: 160px;
  z-index: 1001;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Display dropdown on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Individual dropdown link styling */
.dropdown-content li {
  padding: 0;
}

.dropdown-content li a {
  display: block;
  padding: 0.5rem 1rem;
  color: inherit;
  text-decoration: none;
}

/* Hover effect for dropdown links */
.dropdown-content li a:hover {
  background-color: #777;
}

.sign-out-button {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
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
  max-height: 150px;
  /* margin-right: 0.5rem; */
}

@media (min-width: 1024px) {
  header {
    background: #9c9a9a;
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
