<template>
  <div>
    <div class="flex flex-col items-center mb-4">
      <img src="/typingdna-logo.png" />
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
    <p v-if="enrollmentsLeft > 0" :key="enrollmentsLeft" class="mb-4">
      Enrollments left before verification - {{ enrollmentsLeft }}
    </p>
    <formulate-form
      :form-errors="formErrors"
      :errors="inputErrors"
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

      <button
        class="block p-4 hover:bg-blue-500 bg-blue-400 rounded-md text-white text-lg w-full"
      >
        sign in
      </button>
    </formulate-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

interface VueData {
  enrollmentsLeft: number | undefined
  formErrors: string[]
  inputErrors: any
}

interface LoginFormProps {
  email: string
  password: string
}

console.log({ a: window.DeviceMotionEvent })

const typingDna = new TypingDNA()
typingDna.isMobile()

typingDna.addTarget('email')
typingDna.addTarget('password')

export default Vue.extend({
  layout: 'authentication',
  // middleware({ store, redirect }) {
  //   if (store.state.authenticated) {
  //     return redirect('/dashboard')
  //   }
  // },
  middleware({ store, redirect }) {
    console.log({ state: store.state })
    if (store.state.authenticated) {
      console.log('OVDJE')
      return redirect('/dashboard')
    }
  },
  data(): VueData {
    return {
      enrollmentsLeft: undefined,
      formErrors: [],
      inputErrors: {},
    }
  },
  computed: {
    ...mapState(['isAuthenticated']),
  },
  watchQuery: ['enrollments_left'],
  updated() {
    this.$data.enrollmentsLeft = this.$router.currentRoute.query.enrollments_left
  },
  mounted() {
    console.log(this.isAuthenticated)
    this.$data.enrollmentsLeft = this.$router.currentRoute.query.enrollments_left
  },
  methods: {
    async submitLoginForm(data: LoginFormProps) {
      const emailAndPasswordTypingPattern = typingDna.getTypingPattern({
        type: 1,
        text: `${data.email ?? ''}${data.password ?? ''}`,
      })

      console.log({ emailAndPasswordTypingPattern })

      try {
        const loginResponse = await this.$store.dispatch('loginUser', {
          email: data.email,
          password: data.password,
          typingPattern: emailAndPasswordTypingPattern,
        })

        const {
          user: activeUser,
          typing_dna: typingDnaResponse,
        } = loginResponse

        console.log('User and typingDna', { activeUser, typingDnaResponse })

        if (
          typingDnaResponse.message_code === 10 &&
          this.enrollmentsLeft != null
        ) {
          const decrementedEnrollmentCount = this.enrollmentsLeft - 1
          this.$router.push({
            path: '/login',
            query: { enrollments_left: decrementedEnrollmentCount.toString() },
          })
        } else {
          this.$router.push({ path: '/dashboard' })
        }
      } catch (error) {
        console.log('DEV - ', { error })
        typingDna.reset()
        const errorStatus = error.response.status
        if (errorStatus === 422) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        if (errorStatus === 404) {
          this.inputErrors = error.response.data.errors
          this.formErrors = [error.response.data.message]
        }
        // alert('Something went wrong. Please try again.')
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
