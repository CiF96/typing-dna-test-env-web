<template>
  <div>
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        or
        <nuxt-link
          to="/login"
          class="font-medium text-blue-800 hover:text-blue-700"
        >
          sign in with an existing acount
        </nuxt-link>
        to
      </p>
    </div>
    <formulate-form
      :form-errors="formErrors"
      :errors="inputErrors"
      class="mb-4"
      form-error-class="text-red-500"
      @submit="submitRegisterForm"
    >
      <div class="flex flex-row flex-wrap sm:flex-nowrap">
        <formulate-input
          id="first_name"
          type="text"
          name="firstName"
          label="first name"
          validation="bail|required|alpha:default"
          label-class="input-label"
          input-class="input"
          error-class="input-error"
          class="mb-4 sm:mr-4 w-full"
          validation-name="First name"
        />

        <formulate-input
          id="last_name"
          type="text"
          name="lastName"
          label="last name"
          validation="bail|required|alpha:default"
          label-class="input-label"
          input-class="input"
          error-class="input-error"
          class="mb-4 w-full"
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
        label-class="input-label"
        input-class="input"
        error-class="input-error"
        class="mb-4"
        validation-name="Email"
      />

      <formulate-input
        id="password"
        type="password"
        name="password"
        label="password"
        validation="bail|required|min:6,length"
        label-class="input-label"
        input-class="input"
        error-class="input-error"
        class="mb-4"
        validation-name="Password"
      />

      <formulate-input
        id="password_confirm"
        type="password"
        name="passwordConfirmation"
        label="confirm password"
        validation="bail|required|confirm:password"
        label-class="input-label"
        input-class="input"
        error-class="input-error"
        class="mb-4"
        validation-name="Password confirmation"
      />

      <formulate-errors class="mb-4" />

      <formulate-input
        type="submit"
        name="create account"
        input-class="block p-4 bg-blue-500  hover:bg-blue-400 rounded-md text-white text-lg w-full text-center"
      />
    </formulate-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface VueData {
  formErrors: string[]
  inputErrors: any
}

interface RegisterFormProps {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
}

export default Vue.extend({
  layout: 'authentication',

  data(): VueData {
    return {
      formErrors: [],
      inputErrors: {},
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    },
  },
  methods: {
    async submitRegisterForm(data: RegisterFormProps) {
      try {
        await this.$store.dispatch('registerUser', {
          name: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        })

        this.$router.push({ path: '/same-text' })

        // if (typingDnaResponse.message_code === 10) {
        //   this.$router.push({
        //     path: '/login',
        //   })
        // }
      } catch (error) {
        console.log('DEV - ', { error })
        const errorStatus = error.response.status ?? undefined
        if (errorStatus == null) {
          alert('Something went wrong. Please try again.')
        }
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        if (errorStatus === 404) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
      }
    },
  },
})
</script>

<style>
.input {
  @apply border;
  @apply py-2;
  @apply px-3;
  @apply rounded-md;
  @apply w-full;
}

.input-label {
  @apply mb-1;
  @apply font-bold;
  @apply text-lg;
}

.input-error {
  @apply text-red-500;
  @apply text-xs;
}

.fiftyPercentWidth {
  max-width: 50%;
}
</style>
