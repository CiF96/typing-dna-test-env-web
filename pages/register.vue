<template>
  <div
    class="flex flex-col items-center w-full h-full bg-gradient-to-b from-blue-500 to-blue-200 p-8"
  >
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        or
        <a href="/login" class="font-medium text-blue-800 hover:text-blue-700">
          sign in with an existing acount
        </a>
      </p>
    </div>
    <div
      class="rounded-md p-8 shadow-lg w-full bg-white sm:max-w-lg sm:mx-auto"
    >
      <formulate-form class="mb-4" @submit="submitRegisterForm">
        <div class="flex flex-row flex-wrap sm:flex-nowrap">
          <formulate-input
            id="first_name"
            type="text"
            name="firstName"
            label="first name"
            validation="bail|required|alpha:default"
            label-class="mb-1 font-bold text-lg"
            input-class="field"
            error-class="text-red-500 text-xs"
            class="mb-4 sm:mr-4 w-full"
            error-behavior="submit"
            validation-name="First name"
          />
          <formulate-input
            id="last_name"
            type="text"
            name="lastName"
            label="last name"
            validation="bail|required|alpha:default"
            label-class="mb-1 font-bold text-lg"
            input-class="field"
            error-class="text-red-500 text-xs"
            class="mb-4 w-full"
            error-behavior="submit"
            validation-name="Last name"
          />
        </div>
        <formulate-input
          id="email"
          type="email"
          name="email"
          label="email"
          autocomplete="off"
          validation="bail|required|email"
          label-class="mb-1 font-bold text-lg"
          input-class="field"
          error-class="text-red-500 text-xs"
          class="mb-4"
          error-behavior="submit"
          validation-name="Email"
        />
        <formulate-input
          id="password"
          type="password"
          name="password"
          label="password"
          validation="bail|required|min:6,length"
          label-class="mb-1 font-bold text-lg"
          input-class="field"
          error-class="text-red-500 text-xs"
          class="mb-4"
          error-behavior="submit"
          validation-name="Password"
        />
        <formulate-input
          id="password_confirm"
          type="password"
          name="passwordConfirm"
          label="confirm password"
          validation="bail|required|confirm:password"
          label-class="mb-1 font-bold text-lg"
          input-class="field"
          error-class="text-red-500 text-xs"
          class="mb-4"
          validation-name="Password confirmation"
        />

        <formulate-input
          type="submit"
          name="create account"
          input-class="block p-4 hover:bg-blue-500  bg-blue-400 rounded-md text-white text-lg w-full text-center"
        />
      </formulate-form>
      <!-- <a
        href="/register"
        class="block text-center no-underline text-md text-gray-400 hover:text-gray-800"
      >
        already have an account?
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

interface RegisterFormProps {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
}

const typingDna = new TypingDNA()

typingDna.addTarget('email')
typingDna.addTarget('password')

export default Vue.extend({
  methods: {
    submitRegisterForm(data: RegisterFormProps) {
      const emailAndPasswordTypingPattern = typingDna.getTypingPattern({
        type: 1,
        text: `${data.email ?? ''}${data.password ?? ''}`,
      })

      console.log({
        emailAndPasswordTypingPattern,
      })

      // const emailTypingPattern = typingDna.getTypingPattern({
      //   type: 1,
      //   text: data.email,
      //   targetId: 'email',
      // })
      // const passwordTypingPattern = typingDna.getTypingPattern({
      //   type: 1,
      //   text: data.password,
      //   targetId: 'password',
      // })

      // console.log({
      //   emailTypingPattern,
      //   passwordTypingPattern,
      // }) -- OVAJ NACIN ZAHTJEVA ODVAJANJE DVA TYPING PATTERNA ; SIMBOLOM PRILIKOM REQUESTA

      // try {
      //   const response = await this.$axios.$get(
      //     `https://api.typingdna.com/auto/${data.email}`,
      //     {
      //       headers: {
      //         'Content-Type': 'application/form-data',
      //       },
      //       params: {
      //         tp: emailAndPasswordTypingPattern,
      //       },
      //     }
      //   )
      //   console.log('Response', { response })
      //   this.$router.push({ path: '/index' })
      // } catch (error) {
      //   console.log('DEV - ', error)
      //   alert('Something went wrong. Please try again.')
      // }
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
.fiftyPercentWidth {
  max-width: 50%;
}
</style>
