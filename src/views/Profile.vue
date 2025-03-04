<script setup lang="ts">
import { toRefs } from 'vue';
import { onMounted, ref } from 'vue';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabase, updateSupabase } from '@/utils/superbaseFetch.ts';

const props = defineProps<{ session: Session }>();
const { session } = toRefs(props);
const user = ref<User | null>(null);

const loading = ref(true);
const edit = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');

onMounted(() => {
  authUser();
});

const authUser = async () => {
  try {
    loading.value = true;
    if (!session.value?.user) return;

    user.value = session.value.user;

    const data = await getSupabase('profiles', { id: user.value.id }, true);

    if (data) {
      username.value = data.username;
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const updateUser = async () => {
  if (!user.value) return;
  edit.value = true;

  try {
    const success = await updateSupabase('profiles', { id: user.value.id }, { username: username.value });

    if (success) {
      console.info('update success');
      edit.value = false;
    }
  } catch (error) {
    console.error('update failed', error);
  } finally {
    edit.value = false;
  }
};
</script>

<template>
  <div class="m-3">
    <Card>
      <template #title>
        <div class="flex justify-between">
          <div>
            Profile
          </div>
          <div>
            <Button
              text
              label="Edit"
              icon="pi pi-user-edit"
              size="small"
              @click="edit = !edit"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-4 gap-4">
          <div class="md:col-span-2 col-span-4">
            <div class="flex flex-col gap-1">
              <label for="username">
                Username
              </label>
              <InputText
                v-model="username"
                type="text"
                class="mb-2"
                :disabled="!edit"
              />
            </div>
          </div>
          <div class="md:col-span-2 col-span-4">
            <div class="flex flex-col gap-1">
              <label for="email">
                Email
              </label>
              <InputText
                v-model="email"
                type="text"
                class="mb-2"
                :disabled="!edit"
              />
            </div>
          </div>

          <div class="md:col-span-2 col-span-4">
            <div class="flex flex-col gap-1">
              <label for="firstname">
                Password
              </label>
              <InputText
                v-model="password"
                type="text"
                class="mb-2"
                :disabled="!edit"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div
          v-if="edit"
          class="flex gap-4 mt-1"
        >
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            class="w-full"
            size="small"
            @click="edit = false;"
          />
          <Button
            label="Save"
            class="w-full"
            size="small"
            @click="updateUser"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>
