<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

// Reactive state for auth
const isLoggedIn = ref(false)
const accountType = ref(null)
const firstName = ref('')

// Listen for auth changes
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true
      const userDocRef = doc(db, 'users', user.uid)
      try {
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
          accountType.value = docSnap.data().accountType
          firstName.value = docSnap.data().firstName
        } else {
          console.error('No user document found for', user.uid)
          accountType.value = null
        }
      } catch (error) {
        console.error('Error fetching user document:', error)
      }
    } else {
      isLoggedIn.value = false
      accountType.value = null
      firstName.value = ''
    }
  })
})

// Compute the portal route
const portalRoute = computed(() => {
  if (!isLoggedIn.value) return null
  if (!accountType.value || accountType.value === '') return '/completeProfile'
  return accountType.value === 'donor' ? '/user-portal/donor' : '/user-portal/refugee'
})

// Sign-out function.
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      router.push('/')
      console.log('User signed out successfully!')
    })
    .catch((error) => {
      console.error('Error signing out:', error)
    })
}
</script>

<!-- Bootstrap for Responsivness -->
<template>
  <header class="bg-light fixed-top shadow">
    <div class="container">
      <div class="d-flex align-items-center flex-nowrap py-2">
        <div class="text-center">
          <RouterLink to="/">
            <img
              class="img-fluid"
              src="@/assets/new_horizons.svg"
              alt="Logo"
              style="max-height: 60px"
            />
            <div>Home</div>
          </RouterLink>
        </div>
        <nav>
          <ul class="nav mb-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Asylum Seekers &amp; Refugees
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/refugees/how-we-help">
                    How We Help
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/refugees/housing">
                    Housing and Finance
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/refugees/legal"> Legal Aid </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/refugees/language">
                    Language and Education
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                About Us
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/aboutus/mission">
                    Our Mission and Story
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/aboutus/impact">
                    New Horizons Impact
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Contact and Support
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/contact/contact">
                    Contact Page
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/contact/testimonials">
                    Testimonials
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Donations
              </a>
              <ul class="dropdown-menu">
                <li>
                  <RouterLink class="dropdown-item" to="/donation/donation-options">
                    Donation information
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/donation/money-spent">
                    Where Your Money Goes
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li v-if="isLoggedIn && portalRoute" class="nav-item">
              <RouterLink class="nav-link" :to="portalRoute">User Portal</RouterLink>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <RouterLink class="nav-link" to="/register">Register</RouterLink>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <RouterLink class="nav-link" to="/signin">Sign In</RouterLink>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <button @click="handleSignOut" class="btn btn-link nav-link">Sign Out</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
