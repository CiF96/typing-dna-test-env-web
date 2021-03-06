<template>
  <div
    class="flex flex-col items-center w-full h-full bg-gradient-to-b from-blue-500 to-blue-200 p-8"
  >
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        or
        <a
          href="/register"
          class="font-medium text-blue-800 hover:text-blue-700"
        >
          create your account
        </a>
      </p>
    </div>
    <div
      class="rounded-md p-8 shadow-lg w-full bg-white sm:max-w-lg sm:mx-auto"
    >
      <formulate-form class="mb-4" @submit="submitLoginForm">
        <formulate-input
          id="email"
          type="email"
          name="email"
          label="email"
          validation="email"
          label-class="mb-1 font-bold text-lg"
          input-class="field"
          error-class="text-red-500 text-xs"
          class="mb-4"
          error-behavior="submit"
        />

        <formulate-input
          id="password"
          type="password"
          name="password"
          label="password"
          label-class="mb-1 font-bold text-lg"
          input-class="field"
          error-class="text-red-500 text-xs"
          class="mb-4"
          error-behavior="submit"
        />

        <button
          class="block p-4 hover:bg-blue-500 bg-blue-400 rounded-md text-white text-lg w-full"
        >
          sign in
        </button>
      </formulate-form>
      <!-- <a
        href="/register"
        class="block text-center no-underline text-md text-gray-400 hover:text-gray-800"
      >
        don't have an account?
      </a> -->
    </div>
    <p class="mt-2 text-center text-sm text-gray-600 max-w-md">
      This is a testing environment for the typingDna api and is not intended
      for commercial use.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface LoginFormProps {
  email: string
  password: string
}

const typingDna = new TypingDNA()

typingDna.addTarget('email')
typingDna.addTarget('password')

export default Vue.extend({
  methods: {
    submitLoginForm(data: LoginFormProps) {
      console.log({
        tst: typingDna.getTypingPattern({
          type: 1,
          targetId: 'email',
          text: data.email,
        }),
        tst2: typingDna.getTypingPattern({
          type: 1,
          targetId: 'password',
          text: data.password,
        }),
      })
      // this.$router.push({path: "/dashboard"}) -- after successful login
    },
  },
})
</script>

<style>
.field {
  @apply border;
  @apply py-2;
  @apply px-3;
  @apply rounded-md;
  @apply w-full;
}
</style>
