<script setup lang="ts">
import { ref } from 'vue';
import Perfumes from '@/components/Perfumes.vue';
import Notes from '@/components/Notes.vue';
import AddPerfume from '@/components/AddPerfume.vue';

const addPerfumeVisible = ref(false);
</script>

<template>
  <div class="p-3">
    <Panel
      header="Perfumes"
      toggleable
      class="mb-2"
      :collapsed="true"
    >
      <Perfumes />
    </Panel>
    <Panel
      header="Notes"
      toggleable
      class="mb-4"
      :collapsed="true"
    >
      <Notes />
    </Panel>

    <Button
      label="Add perfume"
      icon="pi pi-plus"
      class="mr-2"
      size="small"
      @click="addPerfumeVisible = true"
    />
    <Button
      label="Add note"
      icon="pi pi-plus"
      size="small"
    />
    <Dialog
      v-model:visible="addPerfumeVisible"
      modal
      header="Add Perfume"
      :style="{ width: '50rem' }"
    >
      <AddPerfume />
    </Dialog>
  </div>
</template>

<style scoped>

</style>
