import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Import refugee pages
import HowWeHelp from '../views/refugees/HowWeHelp.vue'
import HousingFinance from '../views/refugees/HousingFinance.vue'
import LegalAid from '../views/refugees/LegalAid.vue'
import LanguageHelp from '../views/refugees/LanguageHelp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/register',
      component: () => import('../views/UserRegister.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/signin',
      component: () => import('../views/SignIn.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/completeProfile',
      component: () => import('../views/completeProfile.vue'),
    },

    // Refugee page routes:
    { path: '/refugees/how-we-help', name: 'howWeHelp', component: HowWeHelp },
    { path: '/refugees/housing', name: 'housing', component: HousingFinance },
    { path: '/refugees/legal', name: 'legal', component: LegalAid },
    { path: '/refugees/language', name: 'language', component: LanguageHelp },

    // Lazy-load About Us page routes:
    { path: '/aboutus/impact', component: () => import('../views/aboutus/ImpactPage.vue') },
    { path: '/aboutus/mission', component: () => import('../views/aboutus/MissionPage.vue') },
    { path: '/aboutus/partners', component: () => import('../views/aboutus/PartnersPage.vue') },

    // Lazy-load Donation page routes:
    {
      path: '/donation/donation-options',
      component: () => import('../views/donations/DonationPage.vue'),
    },
    {
      path: '/donation/money-spent',
      component: () => import('../views/donations/MoneySpentPage.vue'),
    },
    {
      path: '/donation/sponsorship',
      component: () => import('../views/donations/SponsorshipPage.vue'),
    },

    // Lazy-load Contact page routes:
    { path: '/contact/contact', component: () => import('../views/contact/GetInContactPage.vue') },
    { path: '/contact/help-line', component: () => import('../views/contact/HelpLinePage.vue') },
    {
      path: '/contact/testimonials',
      component: () => import('../views/contact/TestimonialsPage.vue'),
    },

    // Lazy-load User Portal page routes:
    {
      path: '/user-portal/donor',
      component: () => import('../views/userportals/DonorPortal.vue'),
    },
    {
      path: '/user-portal/refugee',
      component: () => import('../views/userportals/RefugeePortal.vue'),
    },
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
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    // Redirect logged in users to home page
    if (await getCurrentUser()) {
      next('/')
    } else {
      next()
    }
  } else {
    // For all other routes??
    next()
  }
})

export default router
