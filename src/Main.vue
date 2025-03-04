<script setup lang="ts">
import { onMounted, watch, shallowRef, type Component } from 'vue';
import Topbar from '@/components/Topbar.vue';
import ScentSpaceIcon from '@/assets/icons/scentspaces.svg?component';
import ShopIcon from '@/assets/icons/shop.svg?component';
import AnalyticsIcon from '@/assets/icons/analytics.svg?component';
import SettingsIcon from '@/assets/icons/settings.svg?component';
import ScentSpaces from '@/views/ScentSpaces.vue';
import InternalComponent from '@/views/Internal.vue';
import ProfileView from '@/views/Profile.vue';
import { useAppStore } from '@/stores/appStore.ts';
import { useAuthStore } from '@/stores/authStore';

const appStore = useAppStore();
const authStore = useAuthStore();
const currentComponent = shallowRef<Component>(null);

const loadComponent = (component: Component) => {
  currentComponent.value = component;
  appStore.profile.visible = false;
};

onMounted(() => {
  loadComponent(ScentSpaces);
});

watch(() => appStore.profile.visible, (profileVisible) => {
  if (profileVisible && authStore.session) {
    currentComponent.value = ProfileView;
  }
});
</script>

<template>
  <div
    id="main-grid"
    class="p-4"
    style="height: 100%"
  >
    <Topbar id="topbar" />

    <div
      id="navigation"
      class="p-2 bg-zinc-800"
    >
      <div
        v-tooltip="'Spaces'"
        class="cursor-pointer"
        @click="loadComponent(ScentSpaces)"
      >
        <ScentSpaceIcon
          width="24"
          class="mb-4"
        />
      </div>
      <div
        v-tooltip="'Trading'"
        class="cursor-pointer"
      >
        <ShopIcon
          width="24"
          class="mb-4"
        />
      </div>
      <div
        v-tooltip="'Analytics'"
        class="cursor-pointer"
      >
        <AnalyticsIcon
          width="24"
          class="mb-4"
        />
      </div>
      <div
        v-tooltip="'Internal'"
        class="cursor-pointer"
        @click="loadComponent(InternalComponent)"
      >
        <SettingsIcon width="24" />
      </div>
    </div>
    <div
      id="main"
      class="bg-zinc-800"
    >
      <component
        :is="currentComponent"
        v-if="currentComponent"
        :session="authStore.session"
      />
    </div>
  </div>
</template>

<style scoped>

#main-grid {
  display: grid;
  grid-template-columns: 40px repeat(4, 1fr);
  grid-template-rows: auto 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
}

#topbar {
  grid-area: 1 / 1 / 2 / 6;
}

#navigation {
  grid-area: 2 / 1 / 6 / 2;
}

#main {
  grid-area: 2 / 2 / 6 / 6;
  overflow: auto;
}
</style>
