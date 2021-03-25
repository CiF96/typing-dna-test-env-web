<template>
  <div>
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />

      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          or
          <nuxt-link
            to="/register"
            class="font-medium text-blue-800 hover:text-blue-700"
          >
            create your account
          </nuxt-link>
        </p>
      </div>
    </div>
    <formulate-form
      :key="enrollmentsLeft"
      :form-errors="formErrors"
      :errors="inputErrors"
      form-error-class="text-red-500"
      class="mb-4"
      @submit="submitLoginForm"
    >
      <formulate-input
        id="email"
        type="email"
        name="email"
        label="email"
        validation="email"
        autocomplete="off"
        label-class="input-label"
        input-class="input"
        error-class="input-error"
        class="mb-4"
        error-behavior="submit"
      />

      <formulate-input
        id="password"
        type="password"
        name="password"
        label="password"
        label-class="input-label"
        input-class="input"
        error-class="input-error"
        class="mb-4"
        error-behavior="submit"
      />

      <formulate-errors class="mb-4" />

      <formulate-input
        :key="enrollmentsLeft"
        type="submit"
        :name="enrollmentsLeft > 0 ? 'enroll' : 'sign in'"
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

interface LoginFormProps {
  email: string
  password: string
}

console.log({ sensors: window.DeviceMotionEvent })

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
    enrollmentsLeft() {
      return this.$store.state.enrollmentsLeft
    },
  },
  methods: {
    async submitLoginForm(data: LoginFormProps) {
      try {
        const loginResponse = await this.$store.dispatch('loginUser', {
          email: data.email,
          password: data.password,
        })

        console.log({ loginResponse })

        this.$router.push({ path: '/same-text' })

        // if (this.enrollmentsLeft > 0) {
        //   this.$router.push({
        //     path: '/login',
        //   })
        //   data.email = ''
        //   data.password = ''
        // } else {
        //   this.$router.push({ path: '/same-text' })
        // }
      } catch (error) {
        console.log('DEV - ', { error })
        const errorStatus = error.response.status ?? undefined
        if (errorStatus == null) {
          alert('Something went wrong. Please try again.')
        }
        if (errorStatus === 401) {
          this.formErrors = ['Wrong email or password']
        }
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        if (errorStatus === 404) {
          this.inputErrors = error.response.data.errors
          this.formErrors = ['Wrong email or password']
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
</style>
