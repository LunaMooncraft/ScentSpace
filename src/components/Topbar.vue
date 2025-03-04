<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/supabase';
import router from '@/router';
import { useAppStore } from '@/stores/appStore.ts';

const appStore = useAppStore();
const menu = ref();

const profileItems = ref([{
  label: 'Profile',
  icon: 'pi pi-user',
  command: () => {
    appStore.profile.visible = true;
  }
}, {
  label: 'Logout',
  icon: 'pi pi-sign-out',
  command: () => {
    console.info('Logout');
    logout();
  }
}]);
const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await router.push('/signin');
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};
</script>

<template>
  <header>
    <Menubar style="padding: 0.5rem;">
      <template #start>
        <img
          class="logo"
          src="@/assets/logo.png"
          width="24"
          height="24"
        >
        <p class="ml-2">
          ScentSpace
        </p>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            @click="toggle"
          />
          <Menu
            ref="menu"
            :model="profileItems"
            :popup="true"
          >
            <template #item="{ item }">
              <div class="flex items-center p-2">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </div>
            </template>
          </Menu>
        </div>
      </template>
    </Menubar>
  </header>
</template>

<style scoped>

</style>
