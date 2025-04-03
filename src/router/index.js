import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DonationPage from '../views/DonationPage.vue'
import AboutUsPage from '../views/AboutUsPage.vue'
import GetInvolved from '../views/GetInvolved.vue'
import ContactPage from '../views/ContactPage.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Import refugee pages
import HowWeHelp from '../views/refugees/HowWeHelp.vue'
import HousingFinance from '../views/refugees/HousingFinance.vue'
import LegalAid from '../views/refugees/LegalAid.vue'
import LanguageHelp from '../views/refugees/LanguageHelp.vue'

// Money Spent
import MoneySpent from '../views/MoneySpent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/donations',
      name: 'donations',
      component: DonationPage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUsPage,
    },
    {
      path: '/get-involved',
      name: 'get-involved',
      component: GetInvolved,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage,
    },
    {
      path: '/feed',
      component: () => import('../views/Feed.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    { path: '/register', component: () => import('../views/UserRegister.vue') },
    { path: '/signin', component: () => import('../views/SignIn.vue') },

    // Refugee pages routes:
    { path: '/refugees/how-we-help', name: 'howWeHelp', component: HowWeHelp },
    { path: '/refugees/housing', name: 'housing', component: HousingFinance },
    { path: '/refugees/legal', name: 'legal', component: LegalAid },
    { path: '/refugees/language', name: 'language', component: LanguageHelp },

    // Money Spent page route
    { path: '/money-spent', name: 'money-spent', component: MoneySpent },
  ],
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener
        resolve(user)
      },
      reject,
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert('You do not have access. Please sign in.')
      next('/')
    }
  } else {
    next()
  }
})

export default router
