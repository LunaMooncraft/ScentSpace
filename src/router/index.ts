import { createRouter, createWebHistory } from 'vue-router';
import Main from '../Main.vue';
import SignInView from '../views/SignIn.vue';
import { supabase } from "@/supabase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'main',
    component: Main,
    meta: { requiresAuth: true }
  }, {
    path: '/signin',
    name: 'signin',
    component: SignInView
  }, {
    path: '/internal',
    name: 'internal',
    component: () => import('../views/Internal.vue')
  }]
});

// Navigation Guard for Authentication
router.beforeEach(async (to, _, next) => {
  const user = await supabase.auth.getUser()
  if (to.meta.requiresAuth && !user) {
    next('/signin')
  } else {
    next()
  }
})

export default router;
