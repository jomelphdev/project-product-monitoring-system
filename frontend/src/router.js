import Vue from "vue";
import VueRouter from "vue-router";

import Main from './views/MainPage.vue'
import Login from './views/auth/LoginPage.vue'
import Register from './views/auth/RegisterPage.vue'
import ForgotPassword from './views/auth/ForgotPasswordPage.vue'
import Available from './views/pages/AvailablePage.vue'
import Incoming from './views/pages/IncomingPage.vue'
import Requested from './views/pages/RequestedPage.vue'
import History from './views/pages/HistoryPage.vue'
import Stocks from './views/pages/StocksPage.vue'
import TestInfiniteScroll from './components/TestInfiniteScroll.vue'
import { accessToken } from "./globalFunction";

Vue.use(VueRouter);

const routes = [
  { path: '/testInfiniteScroll', name: 'TestInfiniteScroll', component: TestInfiniteScroll },
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { requiresUnauth: true } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresUnauth: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { requiresUnauth: true } },
  { path: '/main', name: 'Main', component: Main,
    children: [
      { path: '/incoming', name: 'Incoming', component: Incoming, meta: { requiresAuth: true } },
      { path: '/available', name: 'Available', component: Available, meta: { requiresAuth: true } },
      { path: '/requested', name: 'Requested', component: Requested, meta: { requiresAuth: true } },
      { path: '/history', name: 'History', component: History, meta: { requiresAuth: true } },
      { path: '/stocks', name: 'Stocks', component: Stocks, meta: { requiresAuth: true } },
    ],
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, _, next) => {
  const token = !!sessionStorage.getItem(accessToken);

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.requiresUnauth && token) {
    next("/incoming");
  } else {
    next();
  }
});

export default router;
