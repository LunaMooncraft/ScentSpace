<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/supabase';

onMounted(() => {
  fetchNotes();
});

const notes = ref([]);

const fetchNotes = async () => {
  let { data: ingredientsData, error } = await supabase
      .from('notes')
      .select('*');

  if (error) alert(error.message);

  notes.value = ingredientsData;
};
</script>

<template>
  <DataTable
    :value="notes"
    table-style="min-width: 50rem"
  >
    <Column
      field="id"
      header="ID"
    />
    <Column
      field="name"
      header="Name"
    />
    <Column
      field="category"
      header="Fragrance Wheel Category"
    />
    <Column
      field="subcategory"
      header="Fragrance Wheel Subcategory"
    />
    <Column
      field="user_category"
      header="User-friendly Category"
    />
    <Column
      field="user_subcategory"
      header="User-friendly Subcategory"
    />
  </DataTable>
</template>
