import { useUserStore } from './../store/user.store';
import { useStorage } from '@vueuse/core';
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router';
import RegisterPage from '../pages/RegisterPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import OfficesPage from '../pages/OfficesPage.vue';
import DesksPage from '../pages/DesksPage.vue';
import EditPage from '../pages/EditPage.vue';
import BookingPage from '../pages/BookingPage.vue';
import ProfilePage from '../pages/ProfilePage.vue'
import FavoritesPage from '../pages/FavoritesPage.vue'
import MyReservationsPage from '../pages/MyReservationsPage.vue'
import Homepage from '../pages/Homepage.vue'
import Logout from '../pages/LogoutPage.vue'
import Conditions from '../pages/Conditions.vue'
import Cookies from '../pages/Cookies.vue'
import Privacy from '../pages/Privacy.vue'

const routes = [
  { path: '/', name: 'homePage', component: Homepage },
  { path: '/conditions', name: 'conditions', component: Conditions },
  { path: '/cookies', name: 'cookies', component: Cookies },
  { path: '/privacy', name: 'privacy', component: Privacy },
  { path: '/logout', name: 'logoutPage', component: Logout , meta: { requiresAuth: true } },
  { path: '/register', name: 'registerPage', component: RegisterPage },
  { path: '/login', name: 'loginPage', component: LoginPage },
  { path: '/admin', name: 'adminPage', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/offices', name: 'officesPage', component: OfficesPage, meta: { requiresAuth: true } },
  { path: '/offices/deskpage/:id', name: 'desksPage', component: DesksPage, meta: { requiresAuth: true } },
  { path: '/offices/booking/:id', name: 'bookingPage', component: BookingPage, meta: { requiresAuth: true } },
  { path: '/editdesks/:id', name: 'deskEditPage', component: EditPage, meta: { requiresAuth: true } },
  { path: '/profile/:id', name: 'profilePage', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favoritesPage', component: FavoritesPage, meta: { requiresAuth: true } },
  { path: '/myreservations/:id', name: 'reservationPage', component: MyReservationsPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const savedToken = useStorage('saveToken', '')
  const userStore = useUserStore()
  if (from === START_LOCATION) {
    if (savedToken.value) {
      await userStore.getUserProfile();
    }
  }

  if (!userStore.userProfile) {
    if (to.meta.requiresAuth) {
      router.push({ name: "loginPage" , query: { redirect: to.path !== '/logout' ? to.path : undefined }})
    }
  }

  if (userStore.userProfile) {
    if (!userStore.userProfile.isAdmin && to.meta.requiresAdmin) {
      router.push({ name: "officesPage" })
    } else if ((to.name == "loginPage" || to.name == "registerPage")) {
      router.push({ name: "homePage" })
    }
  }
})

export default router;