<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { supabase } from '@/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Perfume {
  id: number;
  name: string;
  brand: {
    name: string;
  };
  concentration: string;
  notes: {
    name: string;
    type: string;
  }[];
}

const perfumes = ref<Perfume[]>([]);
let subscription: RealtimeChannel | null;

const fetchPerfumes = async () => {
  let { data: perfumeData, error } = await supabase
      .from('perfumes')
      .select(`
      id,
      name,
      brand:brand_id (
        name
      ),
      concentration,
      notes:perfumes_notes (
        note:notes(name),
        type
      )
    `);

  if (error) alert(error.message);

  const flattenedPerfumeData = perfumeData.map((perfume: Perfume[]) => ({
    ...perfume,
    notes: perfume.notes.map(item => ({
      name: item.note.name,
      type: item.type
    }))
  }));

  console.info('Flattened perfumes:', flattenedPerfumeData);

  perfumes.value = flattenedPerfumeData;
};

// Subscribe to realtime changes
const subscribeToPerfumes = () => {

  const channel = supabase.channel('perfumes-channel');

  channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'perfumes'
      },
      (payload: RealtimePostgresChangesPayload<Perfume>) => {
        console.info('Realtime change received:', payload.eventType);
        fetchPerfumes();
      }
  ).subscribe();

  return channel;
};

onMounted(() => {
  fetchPerfumes();
  subscription = subscribeToPerfumes();
});

onUnmounted(() => {
  // Unsubscribe to prevent memory leaks
  if (subscription) {
    supabase.removeChannel(subscription);
  }
});
</script>

<template>
  <DataTable
    edit-mode="row"
    :value="perfumes"
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
      field="brand.name"
      header="Brand"
    />
    <Column
      field="concentration"
      header="Concentration"
    />
    <Column
      field="notes"
      header="Notes"
    >
      <template #body="slotProps">
        <div
          v-for="note in slotProps.data.notes"
          class="capitalize"
        >
          {{ note.type }}: {{ note.name }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>
