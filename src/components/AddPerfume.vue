<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { supabase } from '@/supabase';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';

const initialValues = ref({
  name: '',
  brand: '',
  concentration: {
    name: ''
  },
  volumeData: [],
  noteData: []
});

const brands = ref([]);
const selectedBrand = ref(null);

const concentrations = ref([
  { name: 'Body Spray' },
  { name: 'Eau de Cologne' },
  { name: 'Eau de Toilette' },
  { name: 'Eau de Parfum' },
  { name: 'Extrait de Parfum' },
  { name: 'Perfume Oil' }
]);

const scentStructure = ref('Scent Pyramid');
const scentStructures = ref(['Scent Pyramid', 'Notes']);

const notes = ref([]);
const selectedNotes = ref(null);
const selectedTopNotes = ref(null);
const selectedHeartNotes = ref(null);
const selectedBaseNotes = ref(null);

const searchBrand = async (event: AutoCompleteCompleteEvent) => {
  try {
    const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .ilike('name', `%${event.query}%`);

    if (error) {
      console.error('Error fetching data:', error);
      brands.value = [];
    } else {
      brands.value = data || [];
    }
  } catch (err) {
    console.error('Error:', err);
    brands.value = [];
  }
};

const searchNotes = async (event: AutoCompleteCompleteEvent) => {
  try {
    const { data, error } = await supabase
        .from('ingredients')
        .select('name')
        .ilike('name', `%${event.query}%`);

    if (error) {
      console.error('Error fetching data:', error);
      notes.value = [];
    } else {
      notes.value = data.map((item: { name: string }) => item.name);
    }
  } catch (err) {
    console.error('Error:', err);
    notes.value = [];
  }
};

const resolver = ref(zodResolver(
    z.object({
      name: z.string().min(1, { message: 'Name is required.' }),
      brand: z.object({
        id: z.number(),
        name: z.string().min(1, { message: 'Brand is required.' })
      }),
      creator: z.string().optional(),
      concentration: z.union([
        z.object({
          name: z.string().min(1, 'Concentration is required.')
        }),
        z.any().refine(() => false, { message: 'Concentration is required.' })
      ]),
      noteData: z.array(z.string().min(1, 'Note is required.')).min(1, 'At least one note is required.')
    })
));

const onFormSubmit = async ({ valid, values }: { valid: boolean }) => {
  if (valid) {
    const { error } = await supabase
        .from('perfumes')
        .insert({
          name: values.name,
          brand_id: values.brand.id,
          creator: values.creator === '' ? null : values.creator,
          concentration: values.concentration.name,
          notes: values.noteData
        })
        .select()
        .single();

    if (error) {
      console.error('Error inserting perfume:', error);
      return;
    }
  }
};
</script>

<template>
  <div class="grid p-6">
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      :validate-on-blur="true"
      class="flex flex-col gap-4 w-full"
      @submit="onFormSubmit"
    >
      <div class="flex flex-col gap-1">
        <label for="name">Name*</label>
        <InputText
          name="name"
          type="text"
          placeholder="Name"
          fluid
        />
        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.name.error?.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="brand">Brand*</label>
        <AutoComplete
          v-model="selectedBrand"
          name="brand"
          option-label="name"
          fluid
          :suggestions="brands"
          placeholder="Brand"
          @complete="searchBrand"
        />
        {{ selectedBrand }}
        <Message
          v-if="$form.brand?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.brand.error?.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="creator">Creator</label>
        <InputText
          name="creator"
          type="text"
          placeholder="Creator"
          fluid
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="concentration">Concentration*</label>
        <Select
          name="concentration"
          :options="concentrations"
          option-label="name"
          placeholder="Select a Concentration"
          fluid
        />
        <Message
          v-if="$form.concentration?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.concentration.error.message }}
        </Message>
      </div>

      <div class="flex flex-col gap-1">
        <label for="notes">Composition</label>
        <SelectButton
          v-model="scentStructure"
          name="notes"
          :options="scentStructures"
          size="small"
          class="w-full"
        />
      </div>

      <div
        v-if="scentStructure === 'Scent Pyramid'"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex flex-col gap-1">
          <label for="top">Top</label>
          <AutoComplete
            v-model="selectedTopNotes"
            name="top"
            multiple
            fluid
            :suggestions="notes"
            @complete="searchNotes"
          />
          {{ selectedTopNotes }}
        </div>

        <div class="flex flex-col gap-1">
          <label for="heart">Heart</label>
          <AutoComplete
            v-model="selectedHeartNotes"
            name="heart"
            multiple
            fluid
            :suggestions="notes"
            @complete="searchNotes"
          />
          {{ selectedHeartNotes }}
        </div>

        <div class="flex flex-col gap-1">
          <label for="base">Base</label>
          <AutoComplete
            v-model="selectedBaseNotes"
            name="base"
            multiple
            fluid
            :suggestions="notes"
            @complete="searchNotes"
          />
          {{ selectedBaseNotes }}
        </div>
      </div>


      <div
        v-else-if="scentStructure === 'Notes'"
        class="flex flex-col gap-1"
      >
        <label for="noteData">Notes</label>
        <AutoComplete
          v-model="selectedNotes"
          name="noteData"
          multiple
          fluid
          :suggestions="notes"
          @complete="searchNotes"
        />
        <Message
          v-if="$form.noteData?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.noteData.error.message }}
        </Message>
      </div>

      <Button
        type="submit"
        label="Submit"
        class="mt-4"
      />
    </Form>
  </div>
</template>

<style scoped>

</style>
