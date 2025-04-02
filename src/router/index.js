import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DonationPage from '../views/DonationPage.vue'
import AboutUsPage from '../views/AboutUsPage.vue'
import GetInvolved from '../views/GetInvolved.vue'
import ContactPage from '../views/ContactPage.vue'
import RefugeePage from '../views/RefugeePage.vue'

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
      path: '/refugees',
      name: 'refugees',
      component: RefugeePage,
    },
  ],
})

export default router
