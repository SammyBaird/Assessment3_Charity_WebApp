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
      <RouterLink to="/">
        <img class="logo" src="@/assets/new_horizons.svg" alt="Logo" />
      </RouterLink>
      <nav>
        <ul class="nav-menu">
          <!-- Dropdown Menu -->
          <li class="dropdown">
            <span class="dropbtn"
              >Assylum Seekers<br />
              & Refugees</span
            >
            <ul class="dropdown-content">
              <li><RouterLink to="/refugees/how-we-help">How We Help</RouterLink></li>
              <li><RouterLink to="/refugees/housing">Housing and Finance</RouterLink></li>
              <li><RouterLink to="/refugees/legal">Legal Aid</RouterLink></li>
              <li><RouterLink to="/refugees/language">Language and Education</RouterLink></li>
            </ul>
          </li>

          <!-- About Us Menu -->
          <li class="dropdown">
            <span class="dropbtn">About Us</span>
            <ul class="dropdown-content">
              <li><RouterLink to="/aboutus/mission">Our Mission and Story</RouterLink></li>
              <li><RouterLink to="/aboutus/impact">New Horizons Impact</RouterLink></li>
              <li><RouterLink to="/aboutus/partners">Team and Partners</RouterLink></li>
            </ul>
          </li>

          <!-- Get Involved Menu -->
          <li class="dropdown">
            <span class="dropbtn">Get Involved</span>
            <ul class="dropdown-content">
              <li><RouterLink to="/getinvolved/volunteering">Volunteering</RouterLink></li>
              <li>
                <RouterLink to="/getinvolved/fundraising">Fundrainsing and Events</RouterLink>
              </li>
              <li>
                <RouterLink to="/getinvolved/corporate">Corporate Partnership Program</RouterLink>
              </li>
            </ul>
          </li>

          <!-- Contact Menu -->
          <li class="dropdown">
            <span class="dropbtn">Contact and Support</span>
            <ul class="dropdown-content">
              <li><RouterLink to="/contact/contact">Contact Information</RouterLink></li>
              <li>
                <RouterLink to="/contact/help-line">Help Line and Live Chat (Preview)</RouterLink>
              </li>
              <li>
                <RouterLink to="/contact/testimonials">Testimonials</RouterLink>
              </li>
            </ul>
          </li>

          <!-- Donations Menu -->
          <li class="dropdown">
            <span class="dropbtn">Donations</span>
            <ul class="dropdown-content">
              <li><RouterLink to="/donation/donation-options">Donation Options</RouterLink></li>
              <li>
                <RouterLink to="/donation/money-spent">Where Your Money Goes</RouterLink>
              </li>
              <li>
                <RouterLink to="/donation/sponsorship">Sponsorship initiatives</RouterLink>
              </li>
            </ul>
          </li>

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
  padding: 0.25rem 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  min-height: 60px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

nav {
  display: flex;
  margin-left: auto;
  /* justify-content: center; */
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
