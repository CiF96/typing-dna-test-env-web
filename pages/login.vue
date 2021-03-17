<template>
  <div>
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />
      <div v-if="enrollmentsLeft > 0" :key="enrollmentsLeft">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          enroll new typing pattern
        </h2>
        <p class="mt-2 text-center text-sm font-semibold text-green-400">
          Enrollments left before verification - {{ enrollmentsLeft }}
        </p>
        <p class="mt-2 text-center text-md font-semibold">
          Please enter your credentials
        </p>
      </div>
      <div v-else :key="enrollmentsLeft">
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

console.log({ a: window.DeviceMotionEvent })

const typingDna = new TypingDNA()

const deviceType = typingDna.isMobile() === 0 ? 'desktop' : 'mobile'

typingDna.addTarget('email')
typingDna.addTarget('password')

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
      const emailAndPasswordText = `${data.email ?? ''}${data.password ?? ''}`
      const emailAndPasswordTextId =
        typingDna.getTextId(emailAndPasswordText) +
        '-auth-' +
        emailAndPasswordText.length

      const emailAndPasswordTypingPattern = typingDna.getTypingPattern({
        type: 1,
        text: emailAndPasswordText,
        textId: emailAndPasswordTextId,
      })

      console.log({ emailAndPasswordTypingPattern })

      try {
        await this.$store.dispatch('loginUser', {
          email: data.email,
          password: data.password,
          typingPattern: emailAndPasswordTypingPattern,
          deviceType,
          patternType: '1',
          textId: emailAndPasswordTextId,
        })

        if (this.enrollmentsLeft > 0) {
          this.$router.push({
            path: '/login',
          })
          data.email = ''
          data.password = ''
        } else {
          this.$router.push({ path: '/dashboard' })
        }
      } catch (error) {
        console.log('DEV - ', { error })
        typingDna.reset()
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
</style>
