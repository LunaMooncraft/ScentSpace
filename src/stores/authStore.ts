import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { supabase } from '@/supabase';
import { type Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null);

  // Fetch session when the app starts
  onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session;
    });

    // Listen for authentication changes
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session;
    });
  });

  return {
    session,
  };
});

