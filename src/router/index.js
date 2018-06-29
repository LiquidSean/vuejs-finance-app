import Vue from 'vue';
import Router from 'vue-router';
import Overview from '@/components/Overview';
import Budget from '@/components/Pages/Budget';
import Transactions from '@/components/Pages/Transactions';
import Login from '@/components/Login';
import { store } from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/overview',
      name: 'Overview',
      component: Overview,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/budget',
      name: 'Budget',
      component: Budget,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = store.getters.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    next('login');
  } else {
    next();
  }
});

export default router;
