<script setup lang="ts">
import { ref } from 'vue';
import { Form } from '@primevue/forms';
import { supabase } from '@/supabase.js';
import { useRouter } from 'vue-router';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import bg from '../assets/bg.webp';

const router = useRouter();

const email = ref(null);
const password = ref(null);

const initialValues = ref({
  email: '',
  password: ''
});

const resolver = ref(zodResolver(
    z.object({
      email: z.string().min(1, { message: 'Email is required.' }).email().trim(),
      password: z.string().min(6, { message: 'Password must be at least 8 characters.' }).trim()
    })
));

const onFormSubmit = ({ valid }) => {
  if (valid) {
    handleSignIn();
  }
};

const handleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (data.user) {
      // Redirect only when login is successful
      router.push('/');
    }
    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};

/*const resetPassword = async () => {
  try {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email.value);
    if (error) throw error;
    alert('Check your email for the reset link!');
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};*/
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden">
    <div class="hidden md:block">
      <img
        :src="bg"
        class="w-full h-screen object-cover"
      >
    </div>

    <div class="flex flex-col items-center justify-center">
      <p class="text-2xl my-4">
        ScentSpace
      </p>
      <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        :validateOnValueUpdate="true"
        :validateOnBlur="true"
        @submit="onFormSubmit"
      >
        <div class="mb-2">
          <InputText
            v-model="email"
            name="email"
            type="text"
            placeholder="Email"
            fluid
          />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ $form.email.error.message }}
          </Message>
        </div>
        <div class="mb-4">
          <Password
            v-model="password"
            type="text"
            name="password"
            placeholder="Password"
            :feedback="false"
            toggle-mask
            fluid
            :inputProps="{ autocomplete: 'new-password' }"
          />
          <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ $form.password.error.message }}
          </Message>
        </div>

        <Button
          type="submit"
          severity="primary"
          label="Login"
          fluid
        />
      </Form>
      <!--      <a
        class="my-4"
        @click="resetPassword"
      >Forgot password?</a>-->
    </div>
  </div>
</template>

<style scoped>

</style>
